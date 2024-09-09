const { RPCAgent, setLogLevel } = require("chia-agent");
const littlelambo = require("chia-agent/api/rpc");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cron = require('node-cron');


const mysql = require('mysql2');
const config = require('./config');

const cors = require('cors');
const pool = mysql.createPool({host:config.host, user: config.user,password: config.password, database: config.database});
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

const wallet = require("./wallet/wallet");

const port = 8088;
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




  setLogLevel("debug"); // none/error/warning/info/debug is available.
  // const agent = new RPCAgent({ service: "wallet", configPath: "/root/.littlelambocoin/mainnet/config/config.yaml" });
  const agent = new RPCAgent({ service: "wallet", configPath: "/home/littlenode/.littlelambocoin/mainnet/config/config.yaml" });
  app.get("/api",async(req,res)=>{

          return res.status(200).send({
            success: true,
            message: "Node running...",
          })
  });

  
  app.post("/api/mint", wallet.mint.bind(this,promisePool))
  

  app.post("/api/refreshAmount",async(req,res)=>{
        if(!req.body.address){
          return res.status(200).send({
            success: false,
            message: "\'address\' Parameter is required!",
          })
        }
        let sql = `SELECT id FROM wallet where address = '${req.body.address}'`;
        const [result,row] = await promisePool.query(sql);
        if(result.length > 0){
          getTransactions(result[0].id);
          return res.status(200).send({
            success: true,
            message: "We've queued this wallet for an update! Check back in a minute..."
          });

        }else{
          return res.status(200).send({
            success: false,
            message: "Address not found!"
          })
        }

  });

  app.post("/api/sign",async(req,res)=>{
      try{
        if(!req.body.address){
          return res.status(200).send({
            success: false,
            message: "\'address\' Parameter is required!",
          })
        }
      let sql = `SELECT * FROM wallet where address = '${req.body.address}'`;
      const [result,row] = await promisePool.query(sql);
  

        if(result.length > 0) {
          return res.status(200).send({
            success: true,
            message: "Logged in!!",
            data: {
              balance: result[0].balance, 
              llc_address : result[0].wallet_Address
            }      
         });
        }

        const [findWallet] = await promisePool.query('SELECT id,wallet_Address,balance FROM `wallet` WHERE isAssigned = 0 AND address is null ORDER by id ASC LIMIT 1');
        if(findWallet.length > 0){
            await promisePool.query('UPDATE wallet SET isAssigned = 1, address = ? WHERE id = ?',[req.body.address,findWallet[0].id]);
            return res.status(200).send({
              success: true,
              message: "Logged in!!",
              data: {
                balance: findWallet[0].balance, 
                llc_address : findWallet[0].wallet_Address
              }
             });
          
        }else{


        let getPrivateKey = await littlelambo.generate_mnemonic(agent);
          //  let getPrivateKey = {
          //   mnemonic: ['boring','among','milk','claim','educate','belt','portion','render','dial','melt','snack','flight','useful','delay','correct','slim','melody','apology','draft','stay','clinic','gold','achieve','habit' ],
          //   success: true
          // };

        let addKeyToWallet = await littlelambo.add_key(agent, getPrivateKey);// await littlelambo.generate_mnemonic(agent);
        let getFingerPrint = await  littlelambo.get_private_key(agent, { "fingerprint": addKeyToWallet.fingerprint });// await littlelambo.generate_mnemonic(agent);
        let getAddress =  await littlelambo.get_next_address(agent, { "fingerprint": addKeyToWallet.fingerprint, "wallet_id": 1, "new_address": false });
        // console.log(getPrivateKey,addKeyToWallet,getFingerPrint,getAddress)
        const sql2 = `INSERT INTO wallet(isAssigned,address, PrivateKey, FingerPrint, wallet_Address)  VALUES(1,'${req.body.address}','${getPrivateKey.mnemonic}','${getFingerPrint.private_key.fingerprint}', '${getAddress.address}')  `;
       
         const [resultNew, row1] = await promisePool.query(sql2);
    
            return res.status(200).send({
              success: true,
              message: "Logged in!!",
              data: {
                balance: 0, 
                llc_address : getAddress.address
              }
             });
         }        
        } catch(err){

          return res.status(200).send({
            success: false,
            message: err.toString(),
          })
        }
  });





// "data": [
//         {
//             "getPrivateKey": [boring,among,milk,claim,educate,belt,portion,render,dial,melt,snack,flight,useful,delay,correct,slim,melody,apology,draft,stay,clinic,gold,achieve,habit ],
//             "getFingerPrint": 3665254814,
//             "getaddress": "llc18f5h2zpahhfs2j04tay28tp53f8st97g9d94lwp6ufsknpn9fsvq4a02dw"
//         }
//     ]


cron.schedule('*/2 * * * *', () => {
  console.log('running every minute 5');
  getTransactions();
});


  



async function getTransactions(id=0){
    const sql = (id > 0) ? `SELECT * FROM wallet WHERE id = ${id}` : `SELECT * FROM wallet WHERE isAssigned =1`;
    
    const [result, row] = await promisePool.query(sql);     
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
        let mainAddress = result[i].wallet_Address;
        let walletId = result[i].id;
          
          let login = await littlelambo.log_in(agent, { "fingerprint": parseInt(result[i].FingerPrint) });
          
          // let Wallet = await littlelambo.get_wallet_balance(agent, { "wallet_id": 1 });
        console.log("LLC Address",mainAddress,login,parseInt(result[i].FingerPrint))

    let get_sync_status = await littlelambo.get_sync_status(agent);
    let get_network_info = await littlelambo.get_network_info_of_wallet(agent);
    // console.log({get_network_info,get_sync_status})
      if(login.success){

          // let WalletTrxCount = await littlelambo.get_transaction_count(agent, { "wallet_id": 1 });
          // console.log(WalletTrxCount)

          let WalletTrx = await littlelambo.get_transactions(agent, { "wallet_id": 1 });
          if(WalletTrx.success){
            console.log("transactions.length ",WalletTrx.transactions.length)
            if(WalletTrx.transactions.length > 0){
              // console.log(WalletTrx.transactions[i].additions)
              WalletTrx.transactions.map(async item => {
                // console.log(item);
                if(item.confirmed){
                  let to_address = item.to_address;
                  let amount = parseFloat(parseInt(item.amount) / 1000).toFixed(6); //decimal of 3
                  let name_hash = item.name;
                  let to_puzzle_hash = item.to_puzzle_hash;
                  let additions = item.additions;


                  if(to_address.toLocaleLowerCase() == mainAddress.toLocaleLowerCase()){
                    // console.log("1")
                      const [chkTrx,chkRow] = await promisePool.query(`SELECT * FROM transaction WHERE hash = ?`,[to_puzzle_hash]);
                      if(chkTrx.length == 0){
                        // console.log("2")
                        let [userGet,rowget] = await promisePool.query(`SELECT balance FROM wallet WHERE id = ?`,[walletId]);
                        console.log("Balance Update : ", walletId,amount)
                        let balance = parseFloat(userGet[0].balance) + parseFloat(amount);
                        await promisePool.query(`UPDATE wallet SET balance = ?  WHERE id = ?`,[balance, walletId])
                        await promisePool.query(`INSERT INTO transaction SET ?`,[{
                          address : to_address,
                          user_id : walletId,
                          amount : amount,
                          status : 1,
                          type : 1,
                          hash : to_puzzle_hash,
                          name_hash : name_hash,
                          additions: JSON.stringify(additions)
                        }]);
                      }
                  }
                }
              });
              

            }
          }
      }
          
        }
      }
  }



cron.schedule('* * * * *', () => {
  console.log('running every minute 1');
  createWalletAuto();
});



async function createWalletAuto(){
    const [result] = await promisePool.query("SELECT id FROM wallet WHERE isAssigned = 0");  
    if(result.length < 10){

      let getPrivateKey = await littlelambo.generate_mnemonic(agent);

      let addKeyToWallet = await littlelambo.add_key(agent, getPrivateKey);// await littlelambo.generate_mnemonic(agent);
      let getFingerPrint = await  littlelambo.get_private_key(agent, { "fingerprint": addKeyToWallet.fingerprint });// await littlelambo.generate_mnemonic(agent);
      let getAddress =  await littlelambo.get_next_address(agent, { "fingerprint": addKeyToWallet.fingerprint, "wallet_id": 1, "new_address": false });
          // console.log(getPrivateKey,addKeyToWallet,getFingerPrint,getAddress)
          if(!getFingerPrint.private_key) {
            return;
          }
      const sql2 = `INSERT INTO wallet(PrivateKey, FingerPrint, wallet_Address)  VALUES('${getPrivateKey.mnemonic}','${getFingerPrint.private_key.fingerprint}', '${getAddress.address}')  `;
       
         const [resultNew,] = await promisePool.query(sql2);
         return true;
    }

}





























// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++n




  app.get('/getAllFingerPrints', async (req, res) => {
    let Wallet = await littlelambo.get_public_keys(agent);
    console.log(Wallet)
    return res.status(200).send({
      success: true,
      msg: "data fetched",
      data: Wallet
    })

  });
  app.get('/getwallets', async (req, res) => {

    let Wallet = await littlelambo.get_wallets(agent);
    console.log(Wallet)
    return res.status(200).send({
      success: true,
      msg: "data fetched",
      data: Wallet

    })

  });

  app.get('/getwalletbalance', async (req, res) => {

    let Wallet = await littlelambo.get_wallet_balance(agent, { "wallet_id": 1 });
    console.log(Wallet)
    return res.status(200).send({
      success: true,
      msg: "balance fetched",
      data: Wallet

    })

  });

  app.get('/getTransactions', async (req, res) => {

    let getTransactions = await littlelambo.get_transactions(agent, { "wallet_id": 1 });// await littlelambo.generate_mnemonic(agent);
    console.log(getTransactions)
    return res.status(200).send({
      success: true,
      msg: "Transactions fetched",
      data: getTransactions

    })

  });

  app.get('/generateWallet', async (req, res) => {
    let getPrivateKey = await littlelambo.generate_mnemonic(agent);
    let addKeyToWallet = await littlelambo.add_key(agent, getPrivateKey);// await littlelambo.generate_mnemonic(agent);
    let getFingerPrint = await littlelambo.get_private_key(agent, { "fingerprint": addKeyToWallet.fingerprint });// await littlelambo.generate_mnemonic(agent);
    let getAddress = await littlelambo.get_next_address(agent, { "fingerprint": addKeyToWallet.fingerprint, "wallet_id": 1, "new_address": false });
    // let login = await littlelambo.log_in(agent, { "fingerprint": addKeyToWallet.fingerprint });
    // console.log({ login })
    let sync = await littlelambo.get_sync_status(agent);
    // console.log({ bl1 })

    return res.status(200).send({
      success: true,
      msg: "wallet generated",
      data: [{ "getPrivateKey": getPrivateKey, "addKeyToWallet": addKeyToWallet, "getFingerPrint": getFingerPrint, "getAddress": getAddress, "sync": sync }]

    })

  });


