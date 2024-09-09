import React, { Component, useState, useEffect } from 'react';

import Header from '../directives/header'
import Footer from '../directives/footer'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

import Cookies from 'js-cookie'
import config from '../config/config'
import Web3 from 'web3';
import Swal from 'sweetalert2'
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import axios from 'axios';



const Home = () => {

    const [maticBalance, setmaticBalance] = useState(0);
    const [LittlelamboWallet, setLittlelamboWallet] = useState(Cookies?.get('walletDetails') ? JSON.parse(Cookies?.get('walletDetails')) : []);
    const [PaymentMethod, setPaymentMethod] = useState('A');
    const [ConnectWalletAddress, setConnectWalletAddress] = useState('');
    const [MintText, setMintText] = useState('MINT NOW');
    const [purchased_quantity, setpurchased_quantity] = useState(1);
    const [isDialogOpen, setisDialogOpen] = useState(false);



    useEffect(() => {

        setInterval(() => {
            if (window.ethereum && localStorage.getItem("connectWalletAddress")) {
                const { ethereum } = window;
                if (ethereum.selectedAddress) {
                    var web3 = new Web3(window.ethereum);
                    if (web3.currentProvider.chainId == 80001 || web3.currentProvider.chainId == '0x13881') {
                        setConnectWalletAddress(ethereum.selectedAddress)
                        getMaticBalance(web3, ethereum.selectedAddress);
                    }
                }
            }
        }, 1000);


    }, [])

    

    

    const getMaticBalance = async (web3, address) =>{
        
        let bal = await web3.eth.getBalance(address);
        setmaticBalance((parseFloat(bal) / 10**18).toFixed(6))
    }
    async function manageWallet(address) {
        let cc = await localStorage.getItem("connectWalletAddress").toString();
        let add = await address.toString();

        if (cc.toUpperCase() != add.toUpperCase()) {
            localStorage.setItem("connectWalletAddress", address);
            window.location.reload();
        }
    }


    const minusQuantity = () => {
        var qty = parseInt(purchased_quantity) - parseInt(1);

        if (purchased_quantity > 1) {
            setpurchased_quantity(qty)
            // this.setState({
            //    'purchased_quantity': qty
            // })
        }
    }


    const plusQuantity = () => {
        var qty = parseInt(purchased_quantity) + parseInt(1);
        if (qty > 10) {
            return;
        }
        setpurchased_quantity(qty)

    }


    const disconnect = async () => {
        localStorage.setItem('isLogout', "Yes");
        window.location.reload();
    }

    const connectMetaMask = async () => {
        if (window.ethereum) {
            var isMetaMask = await window.ethereum.isMetaMask;
            if (!isMetaMask) {

                Swal.fire({
                    text: 'Please install MetaMask to use this App!',
                    // icon: 'warning',
                    title: "Alert",
                    confirmButtonText: 'Okay',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                })
                return;
            }

            if (!window.ethereum.providers) {
                var metamaskProvider = await window.ethereum;
            } else {
                var metamaskProvider = await window.ethereum.providers.find((provider) => provider.isMetaMask);
            }
            try {
                const accounts = await metamaskProvider.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);

                if (web3.currentProvider.chainId == 80001 || web3.currentProvider.chainId == '0x13881') {

                    setConnectWalletAddress(accounts[0])
                    // setisConnectMetamask(true)
                    localStorage.setItem('walletType', 'metamask')
                    localStorage.setItem('connectWalletAddress', accounts[0]);
                    localStorage.removeItem('isLogout');
                    setTimeout(() => {

                        window.location.reload()
                    }, 200);
                    // await web3.currentProvider.request({
                    //     method: 'wallet_switchEthereumChain',
                    //     params: [
                    //         {
                    //             chainName: 'Mumbai Testnet',
                    //             chainId: '0x13881',
                    //             nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                    //             rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                    //             blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                    //         },
                    //     ],
                    // });
                } else {
                    await Swal.fire({
                        text: "Please connect with polygon testnet network",
                        // icon: 'warning',
                        title: "Alert",
                        confirmButtonText: 'Okay',
                        confirmButtonColor: 'rgb(1 2 2)',
                        background: 'rgb(52 54 56)',
                        color: '#fff'
                    })
                }
            } catch (err) {

                Swal.fire({
                    text: err.message,
                    // icon: 'warning',
                    title: "Alert",
                    confirmButtonText: 'Okay',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                })
            }

        }
        else {
            Swal.fire({
                text: 'Please install MetaMask to use this App!',
                // icon: 'warning',
                title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })

        }
    }

    const getCurrentProvider = async () => {
        let CurrentProvider = "";
        if (localStorage.getItem("connectWalletAddress") && localStorage.getItem("walletType") == 'metamask') {
            if (!window.ethereum.providers) {
                CurrentProvider = await window.ethereum;
            } else {
                CurrentProvider = await window.ethereum.providers.find((provider) => provider.isMetaMask);
            }
        } else {
            if (!window.ethereum.providers) {
                if (window.ethereum.isCoinbaseWallet == true) {
                    CurrentProvider = await window.ethereum;
                }
            } else {
                CurrentProvider = await window.ethereum.providers.find((provider) => provider.isCoinbaseWallet);
            }
        }
        return CurrentProvider;
    }


    const mintItemByLLC = async (e) => {
        if (MintText === "Processing...") {
            return;
        }

        let from_address = localStorage.getItem("connectWalletAddress")

        setMintText("Processing...");        
        setisDialogOpen(true);
        const res = await axios.post(config.API_URL+'/mint', {
            "address": from_address.toLowerCase(),
            "nftNumber":purchased_quantity
        });
        if (res.data.success) {
            setTimeout(() => {
                
            setMintText("MINT NOW");
            setisDialogOpen(false);
            Swal.fire({
                text: res.data.message,
                // icon: 'warning',
                title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })
        }, 1000);
        } else {setTimeout(() => {
                
            setMintText("MINT NOW");
            setisDialogOpen(false);
            Swal.fire({
                text: res.data.message,
                // icon: 'warning',
                title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })
        }, 1000);
        }

    }
    const mintItem = async (e) => {

        if (MintText === "Processing...") {
            return;
        }

        let nftNumber = parseInt(purchased_quantity);
        if (nftNumber > 10) {
            Swal.fire({
                text: '5 NFTs mint in per transaction',
                // icon: 'warning',
                title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })
            return;
        }
        // if (parseInt(TotalMined) + nftNumber > parseInt(mintLimit)) {
        //   let mint = parseInt(mintLimit) - parseInt(TotalMined);
        //   Swal.fire({
        //     text: 'Only ' + mint + ' slot left for mint',
        //     // icon: 'warning',
        //     title: "Alert",
        //     confirmButtonText: 'Okay',
        //     confirmButtonColor: 'rgb(1 2 2)',
        //     background: 'rgb(52 54 56)',
        //     color: '#fff'
        //   })
        //   return;
        // }
        if (!ConnectWalletAddress) {
            connectMetaMask();
            return;
        }
        const providers = await getCurrentProvider();
        const web3 = new Web3(providers);

        try {



            if (web3.currentProvider.networkVersion != 80001 && web3.currentProvider.networkVersion != '0x13881') {

                Swal.fire({
                    text: 'Please select mumbai polygon network!',
                    // icon: 'warning',
                    // title: "Alert",
                    confirmButtonText: 'Okay',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                })
                return;
            }
            setMintText("Processing...");
            setisDialogOpen(true);
            const NFT_CONTRACT = await new web3.eth.Contract(config.ABI, config.contractAddress);
            let accounts = await web3.eth.getAccounts();
            web3.eth.defaultAccount = accounts[0];
            let from_address = accounts[0];
            // let balance = await web3.eth.getBalance(from_address);

            let chainId = '0x13881';


            let getMintFees = await NFT_CONTRACT.methods.getMintFees(nftNumber).call();
            getMintFees = parseInt(getMintFees);

            let myAddress = from_address.toUpperCase();

            let contractOnwer = await NFT_CONTRACT.methods.owner().call();

            let encoded_tx = "";

            if (myAddress == contractOnwer.toUpperCase()) {
                let tx_builder = await NFT_CONTRACT.methods.mintAsOwner(nftNumber);
                encoded_tx = tx_builder.encodeABI();
                getMintFees = 0;
            } else {

                let tx_builder = await NFT_CONTRACT.methods.mint(nftNumber);
                encoded_tx = tx_builder.encodeABI();
            }





            let gasPrice = await web3.eth.getGasPrice();
            gasPrice = parseInt(gasPrice) + 10000000000;

            let gasLimit = await web3.eth.estimateGas({
                gasPrice: web3.utils.toHex(gasPrice),
                to: config.contractAddress,
                from: from_address,
                value: web3.utils.toHex(getMintFees),
                chainId: chainId,
                data: encoded_tx
            });

            const transactionParameters = {
                from: from_address,
                gasPrice: web3.utils.toHex(gasPrice),
                gas: web3.utils.toHex(gasLimit),
                to: config.contractAddress,
                value: web3.utils.toHex(getMintFees),
                chainId: chainId,
                data: encoded_tx
            };


            const txData = await web3.currentProvider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

            // let messageAlert = `<span>Transaction details : <a style="color:blue" href="https://etherscan.io/tx/${txHash.transactionHash}" target="_blank">0x....hash</a> </span>`;
            // messageAlert = ` ${messageAlert} <br/> <a style="color:blue" href="https://testnets.opensea.io/${localStorage.getItem("connectWalletAddress")}" target="_blank">View on Opensea</a> </span>`

            if (txData) {
                Swal.fire({
                    width: 500,
                    title: 'Successful!',
                    html: 'Congratulation! NFT minted Successfully.',
                    // icon: 'warning',
                    // title: "Alert",
                    confirmButtonText: 'Ok, Thanks',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                }).then((result) => {
                    window.location.reload();
                })
            }
        } catch (err) {
            console.log("err", err)
            setMintText("MINT NOW");
            setisDialogOpen(false);
            if (err.message.toString().split('insufficient funds')[1]) {

                Swal.fire({
                    text: 'Transaction reverted : ' + err.message,
                    // icon: 'warning',
                    // title: "Alert",
                    confirmButtonText: 'Okay',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                })
            } else {
                if (err.toString().split('execution reverted:')[1]) {
                    Swal.fire({
                        text: 'Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0],
                        // icon: 'warning',
                        title: "Alert",
                        confirmButtonText: 'Okay',
                        confirmButtonColor: 'rgb(1 2 2)',
                        background: 'rgb(52 54 56)',
                        color: '#fff'
                    })
                } else {
                    if (err.message.toString().search(/supplied gas/) > -1 || err.message.toString().search(/exceeds allowance/) > -1) {
                        Swal.fire({
                            text: "Transaction reverted : insufficient funds for transaction fee",
                            // icon: 'warning',
                            title: "Alert",
                            confirmButtonText: 'Okay',
                            confirmButtonColor: 'rgb(1 2 2)',
                            background: 'rgb(52 54 56)',
                            color: '#fff'
                        })
                    } else {
                        Swal.fire({
                            text: err.message,
                            // icon: 'warning',
                            title: "Alert",
                            confirmButtonText: 'Okay',
                            confirmButtonColor: 'rgb(1 2 2)',
                            background: 'rgb(52 54 56)',
                            color: '#fff'
                        })
                    }
                }
            }
        }
    
    const getWalletDetailsFromHeader = async (data)=>{
        console.log("Home Data : ", data)
    }

    }


    return (
        <>
            <Header  getWalletDetails={(data) => setLittlelamboWallet(data)}/>

            {/*Bithu Banner Start*/}
            <div className="bithu_v3_baner_sect" id="home">
                <Dialog
                    title="Processing..."
                    // icon="warning-sign"
                    style={{
                        color: 'red',
                    }}
                    isOpen={isDialogOpen}
                    isCloseButtonShown={false}
                >
                    <div className="text-center">
                        <BarLoader color="#e84747" height="2" />
                        <br />
                        <h4 style={{ color: '#000' }}>Transaction under process...</h4>
                        <p style={{ color: 'red' }}>
                            Please do not refresh page or close tab.
                        </p>
                        <div>
                        </div>
                    </div>
                </Dialog>

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="banner-image-area3">
                                <span className="shape_1 rotated-style">
                                    <img src="assets/images/banner/shape1.png" alt="" />
                                </span>
                                <span className="shape_2 rotated-style">
                                    <img src="assets/images/banner/shape2.png" alt="" />
                                </span>
                                <span className="shape_3 rotated-style">
                                    <img src="assets/images/banner/shape3.png" alt="" />
                                </span>
                                <img
                                    className="banner-image banner-image1"
                                    src="assets/images/banner/item1.png"
                                    alt="image"
                                />
                                <img
                                    className="banner-image banner-image2"
                                    src="assets/images/banner/item2.png"
                                    alt="image"
                                />
                                <img
                                    className="banner-image banner-image3"
                                    src="assets/images/banner/item3.png"
                                    alt="image"
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="banner-conent3">
                                <h4 className="banner-subtitle uppercase">
                                    Whitelist : <span className="red-color">Comming Soon</span>
                                </h4>
                                <h1 className="banner-title uppercase">Mint is Comming Soon</h1>
                                <div className="bithu_v3_timer">
                                    <h5 className="uppercase">Public Mint start in</h5>
                                    <div className="timer timer_1">
                                        <ul>
                                            <li className="days">
                                                26<span>D</span>:
                                            </li>
                                            <li className="hours">
                                                15<span>H</span>
                                            </li>
                                            <li className="minutes">
                                                44<span>M</span>
                                            </li>
                                            <li className="seconds">
                                                18<span>S</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {!ConnectWalletAddress ||
                                    <div className='radiobtn'>
                                        <h6>Select Payment Method</h6>
                                        <label style={{ marginRight: '35px', cursor: 'pointer' }}>
                                            <input type="radio" checked={PaymentMethod == "A"} onClick={() => setPaymentMethod('A')} name="A" /> Matic
                                        </label>
                                        <label style={{ cursor: 'pointer' }}>
                                            <input type="radio" checked={PaymentMethod == "B"} onClick={() => setPaymentMethod('B')} name="A" /> LLC
                                        </label>
                                        <div className='form-group'>
                                            {PaymentMethod == "A" ?
                                                <span style={{ fontSize: '15px' }}>
                                                    Wallet Balnace : {parseFloat(maticBalance).toFixed(6)} Matic
                                                </span>
                                                :
                                                <span style={{ fontSize: '15px' }}>
                                                    Wallet Balnace : {parseFloat(LittlelamboWallet.balance).toFixed(6)} LLC
                                                </span>
                                            }
                                        </div>
                                    </div>}

                                <div className="banner-count-inner d-flex align-items-center">
                                    <div className="banner-btn-area">
                                        <span className="input-number-decrement" onClick={e => minusQuantity(e)}>–</span>
                                        <input className="input-number" type="number" disabled={true} value={purchased_quantity} />
                                        <span className="input-number-increment" onClick={e => plusQuantity(e)}>+</span>
                                    </div>
                                    <div className="bithu_v3_baner_buttons">
                                        {PaymentMethod == "A" ?
                                            <button
                                                className="mint_btn hov_shape_show"
                                                data-bs-toggle="modal"
                                                // data-bs-target="#mintModal"
                                                onClick={e => mintItem()}
                                            >
                                                {MintText}

                                                <span className="hov_shape1">
                                                    <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                                </span>
                                                <span className="hov_shape2">
                                                    <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                                </span>
                                                <span className="square_hov_shape_dark" />
                                            </button>
                                            :
                                            <button
                                                className="mint_btn hov_shape_show"
                                                data-bs-toggle="modal"
                                                // data-bs-target="#mintModal"
                                                onClick={e => mintItemByLLC()}
                                            >
                                                {MintText}

                                                <span className="hov_shape1">
                                                    <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                                </span>
                                                <span className="hov_shape2">
                                                    <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                                </span>
                                                <span className="square_hov_shape_dark" />
                                            </button>
                                        }




                                    </div>
                                </div>
                                <div className="banner-bottom-text uppercase">
                                    Public Mint 0.09 Eth + Gas Floor Price 2.08 Eth
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Bithu Banner End*/}
            {/*Slider Section Start*/}
            {/* <div class="bithu_owl_carousel_sect slide-section3">
      <div class="bithu_owl_carousel_content">
          <div class="swiper swiper-autoplay-slider">
              <div class="swiper-wrapper">
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img2.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img3.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img4.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img5.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img6.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img2.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img3.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img4.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img5.png" alt="img"></div></div>
                  <div class="swiper-slide"><div class="item bg-2"><img src="assets/images/nft/slider-img6.png" alt="img"></div></div>
              </div>
          </div>
      </div>
  </div> */}
            {/*Slider Section End*/}
            {/* About Us section Start */}
            <div
                className="v1_about_us_section bithu-about-section3 height-auto"
                id="about"
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="v1_about_us_right_sect">
                                <div className="bithu_title_section">
                                    <h2>
                                        THE STORY{" "}
                                        <span>
                                            <img src="assets/images/icon/title_shapes.svg" alt="" />
                                        </span>
                                    </h2>
                                    <h3 className="uppercase">OUR PLAN</h3>
                                </div>
                                <div className="v1_about_us_right_text">
                                    <p>
                                        Little Lambo Coin will be the main currency used to purchase
                                        NFT's from our new and upcoming NFT eCommerce platform. We will
                                        be building out NFT store over the next few months. We hope to
                                        launch our NFT store by Q3-Q4 2022, and if all goes well, maybe
                                        sooner. Little Lambo Coin will be used to purchase these
                                        collectible NFT's which in turn can then be traded on NFT
                                        trading platforms.
                                    </p>
                                    <p>
                                        {" "}
                                        With a lot of hard work and a Little Lambo luck our coin will
                                        reach exchanges in a timely manner as well as our NFT's reaching
                                        NFT markets worldwide.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-left-item pl-45 md-pl-0 md-mt-30">
                                <div className="bithu_title_section mb-30">
                                    <h2 className="uppercase white-color">
                                        Meet The Artists{" "}
                                        <span>
                                            <img src="assets/images/icon/title_shapes.svg" alt="" />
                                        </span>
                                    </h2>
                                </div>
                                <div className="ab-content d-flex">
                                    <div className="ab-item-box mr-30">
                                        <img src="assets/images/blog/ab-img.png" alt="" />
                                        <div className="ab-text pt-20">
                                            <h5>
                                                <a href="#">
                                                    Berneice Tran
                                                    <img src="assets/images/icon/ab-icon-image.png" alt="" />
                                                </a>
                                            </h5>
                                        </div>
                                        <span>Artist</span>
                                    </div>
                                    <div className="ab-item-box">
                                        <img src="assets/images/blog/ab-img2.png" alt="" />
                                        <div className="ab-text pt-20">
                                            <h5>
                                                <a href="#">
                                                    Leana Rosa
                                                    <img src="assets/images/icon/ab-icon-image2.png" alt="" />
                                                </a>
                                            </h5>
                                        </div>
                                        <span>Co-Artist</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* About Us section End*/}
            {/* Mint section Start*/}
            <div className="how_to_mint_sect bithu-mint-section">
                <div className="container how_to_mint_container">
                    <div className="bithu_title_section">
                        <h2>
                            EASY STEPS{" "}
                            <span>
                                <img src="assets/images/icon/title_shapes.svg" alt="" />
                            </span>
                        </h2>
                        <h3 className="mb-10">How to mint</h3>
                    </div>
                    <div className="how_to_mint_content">
                        <ul>
                            <li>
                                <h4 className="green">1</h4>
                                <p>Connect Your Wallet</p>
                            </li>
                            <li>
                                <h4 className="blue">2</h4>
                                <p>Select Your Quantity</p>
                            </li>
                            <li>
                                <h4 className="yellow">3</h4>
                                <p>Confiem the Transaction</p>
                            </li>
                            <li>
                                <h4 className="red">4</h4>
                                <p>Receive Your NFTs</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Mint section End*/}
            {/* Bithu roadmap Start*/}
            {/* <div class="bithu_roadmap_section bithu_roadmap_section3" id="roadmap">
      <div class="container">
          <div class="bithu_title_section text-center">
              <h2><span class="shape_left"><img src="assets/images/icon/title_shapes2.svg" alt="" /></span>Our Goals<span><img src="assets/images/icon/title_shapes.svg" alt="" /></span></h2>
              <h3>Roadmap</h3>
          </div>
          <div class="row v3_roadmap_content">
              <div class="col-lg-12">
                  <div class="bithu_roadmap_item">
                      <div class="bithu_roadmap_content">
                          <div class="bithu_roadmap_counter">
                              <div class="roadmap_parcentage"><span>10</span>%</div>
                          </div>
                          <div class="bithu_roadmap_text">
                              <div class="roadmap_heading">
                                  <h5 class="mb-15"><a href="#">Launch The Website</a></h5>
                                  <img src="assets/images/blog/arrow.png" alt="">
                              </div>
                              <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced.</p>
                          </div>
                      </div>
                      <div class="roadmap_img">
                          <img src="assets/images/blog/roadmap-img5.png" alt="">
                      </div>
                  </div>
              </div>
              <div class="col-lg-12">
                  <div class="bithu_roadmap_item">
                      <div class="bithu_roadmap_content">
                          <div class="bithu_roadmap_counter">
                              <div class="roadmap_parcentage"><span>20</span>%</div>
                          </div>
                          <div class="bithu_roadmap_text">
                              <div class="roadmap_heading">
                                  <h5 class="mb-15"><a href="#">Giveaway to Holders</a></h5>
                                  <img src="assets/images/blog/arrow.png" alt="">
                              </div>
                              <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced.</p>
                          </div>
                      </div>
                      <div class="roadmap_img">
                          <img src="assets/images/blog/roadmap-img4.png" alt="">
                      </div>
                  </div>
              </div>
              <div class="col-lg-12">
                  <div class="bithu_roadmap_item">
                      <div class="bithu_roadmap_content">
                          <div class="bithu_roadmap_counter">
                              <div class="roadmap_parcentage"><span>50</span>%</div>
                          </div>
                          <div class="bithu_roadmap_text">
                              <div class="roadmap_heading">
                                  <h5 class="mb-15"><a href="#">Pre-sale Start</a></h5>
                                  <img src="assets/images/blog/arrow.png" alt="">
                              </div>
                              <p>It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore.</p>
                          </div>
                      </div>
                      <div class="roadmap_img">
                          <img src="assets/images/blog/roadmap-img5.png" alt="">
                      </div>
                  </div>
              </div>
              <div class="col-lg-12">
                  <div class="bithu_roadmap_item">
                      <div class="bithu_roadmap_content">
                          <div class="bithu_roadmap_counter">
                              <div class="roadmap_parcentage"><span>75</span>%</div>
                          </div>
                          <div class="bithu_roadmap_text">
                              <div class="roadmap_heading">
                                  <h5 class="mb-15"><a href="#">Legendary Guest Artist Backgrounds</a></h5>
                                  <img src="assets/images/blog/arrow.png" alt="">
                              </div>
                              <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced.</p>
                          </div>
                      </div>
                      <div class="roadmap_img">
                          <img src="assets/images/blog/roadmap-img4.png" alt="">
                      </div>
                  </div>
              </div>
              <div class="col-lg-12">
                  <div class="bithu_roadmap_item">
                      <div class="bithu_roadmap_content">
                          <div class="bithu_roadmap_counter">
                              <div class="roadmap_parcentage"><span>100</span>%</div>
                          </div>
                          <div class="bithu_roadmap_text">
                              <div class="roadmap_heading">
                                  <h5 class="mb-15"><a href="#">Personalize Your NFT</a></h5>
                                  <img src="assets/images/blog/arrow.png" alt="">
                              </div>
                              <p>Sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                          </div>
                      </div>
                      <div class="roadmap_img">
                          <img src="assets/images/blog/roadmap-img5.png" alt="">
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div> */}
            {/* Bithu roadmap End*/}
            {/*Bithu Team Start */}
            <div className="bithu_team_sect v1_team_sect v3_team_sect" id="team">
                <div className="v1_team_overlay team-section">
                    <div className="container">
                        <div className="bithu_title_section text-center">
                            <h2 className="uppercase">
                                <span className="shape_left">
                                    <img src="assets/images/icon/title_shapes2.svg" alt="" />
                                </span>
                                Team Members
                                <span>
                                    <img src="assets/images/icon/title_shapes.svg" alt="" />
                                </span>
                            </h2>
                            <h3>Meet The Crew</h3>
                        </div>
                        <div className="bithu_team_content">
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar1.png" alt="" />
                                        </div>
                                        <h3>Berneice Tran</h3>
                                        <h4>Founder</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar2.png" alt="" />
                                        </div>
                                        <h3>Nathan Bean</h3>
                                        <h4>Co-Founder</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar3.png" alt="" />
                                        </div>
                                        <h3>Lynnette 4Wilkes</h3>
                                        <h4>Aritst</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar4.png" alt="" />
                                        </div>
                                        <h3>Claudia Hicks</h3>
                                        <h4>Co-Artist</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar5.png" alt="" />
                                        </div>
                                        <h3>Moneo Doa</h3>
                                        <h4>UI Designer</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar6.png" alt="" />
                                        </div>
                                        <h3>Robert Neo</h3>
                                        <h4>Digital Artist</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar7.png" alt="" />
                                        </div>
                                        <h3>Sony Jina</h3>
                                        <h4>Blockchain Dev</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="bithu_team_card hov_shape_team">
                                        <div className="team_member_img">
                                            <img src="assets/images/team/crew_avatar8.png" alt="" />
                                        </div>
                                        <h3>Natala Elon</h3>
                                        <h4>SEO Engineer</h4>
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                        </span>
                                        <div className="team_social_icon">
                                            <ul>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-twitter" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-instagram" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i className="fa-brands fa-linkedin-in" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Bithu Team Start */}
            {/* FAQ Section Start */}
            <div className="bithu_faq_sect bithu-faq-section pt-0" id="faq">
                <div className="faq_bg_wattermark">
                    <img src="assets/images/bg/faq_bg_wattermark.png" alt="" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="bithu_faq_content md-pb-30">
                                <div className="bithu_title_section">
                                    <h2>
                                        Questions &amp; Answers
                                        <span>
                                            <img src="assets/images/icon/title_shapes.svg" alt="" />
                                        </span>
                                    </h2>
                                    <div className="mb-50">
                                        <h3>
                                            Frequently Asked <br />
                                            questions
                                        </h3>
                                        <p>
                                            Please contact us if you cannot find an answer to your
                                            question. Farming Little Lambo Coin leaves less of a carbon
                                            footprint then other more energy and equipment intensive
                                            mining.
                                        </p>
                                    </div>
                                </div>
                                <div className="Bithu_faq_text">
                                    <ul>
                                        <li>Don't get your answer?</li>
                                        <li>
                                            Fell free to leave a message,<span>Ask Here!</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="bithu_faq_questions mt-0 d-block">
                                        <div className="faq_questions">
                                            <Accordion>
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            What is Little Lambo Coin?
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            Little Lambo Coin is a cryptocurrency that runs on the PoST network and can be farmed on hard drives and old computers. The PoST network takes far less energy to farm then POW coins that require large amounts of electricity. This makes it a green choice for cryptocurrencies.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            Is free will real or just an illusion?
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            In ad velit in ex nostrud dolore cupidatat consectetur
                                                            ea in ut nostrud velit in irure cillum tempor laboris
                                                            sed adipisicing eu esse duis nulla non.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            How do I farm Little Lambo Coin?
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            Please click on the "getting started" link at the top of the page.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            How much is Little Lambo Coin worth?
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            Because we are so new, we have not yet had a price discovery. This means it is a good time to start farming to be an early adopter.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            Is Little Lambo Coin a "green" cryptocurrency?
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        <p>
                                                            The answer is yes in respects to the amount of energy it takes to acquire the coin compared to other cryptocurrencies. This gives us a smaller carbon footprint then other more energy consuming cryptocurrencies.
                                                        </p>
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </Accordion>
                                            {/* <h2 className="accordion no-border">
                                                What is Little Lambo Coin?
                                                <span>
                                                    <img
                                                        src="assets/images/icon/plus.svg"
                                                        alt=""
                                                        className="img-fluid IconPlus"
                                                    />
                                                    <img
                                                        src="assets/images/icon/munis.svg"
                                                        alt=""
                                                        className="Img-fluid IconMunise"
                                                    />
                                                </span>
                                            </h2>
                                            <div className="accordion-panel">
                                                <p>
                                                    Little Lambo Coin is a cryptocurrency that runs on the
                                                    PoST network and can be farmed on hard drives and old
                                                    computers. The PoST network takes far less energy to farm
                                                    then POW coins that require large amounts of electricity.
                                                    This makes it a green choice for cryptocurrencies.{" "}
                                                </p>
                                            </div>
                                            <h2 className="accordion">
                                                How can I participate?
                                                <span>
                                                    <img
                                                        src="assets/images/icon/plus.svg"
                                                        alt=""
                                                        className="img-fluid IconPlus"
                                                    />
                                                    <img
                                                        src="assets/images/icon/munis.svg"
                                                        alt=""
                                                        className="Img-fluid IconMunise"
                                                    />
                                                </span>
                                            </h2>
                                            <div className="accordion-panel">
                                                <p>
                                                    There are two ways to get Little Lambo Coin. By farming it
                                                    or purchasing it. At this time, because we have just
                                                    launched, we are not on any exchanges so farming it seems
                                                    the logical choice.
                                                </p>
                                            </div>
                                            <h2 className="accordion">
                                                How do I farm Little Lambo Coin?
                                                <span>
                                                    <img
                                                        src="assets/images/icon/plus.svg"
                                                        alt=""
                                                        className="img-fluid IconPlus"
                                                    />
                                                    <img
                                                        src="assets/images/icon/munis.svg"
                                                        alt=""
                                                        className="Img-fluid IconMunise"
                                                    />
                                                </span>
                                            </h2>
                                            <div className="accordion-panel">
                                                <p>
                                                    Please click on the "getting started" link at the top of
                                                    the page.
                                                </p>
                                            </div>
                                            <h2 className="accordion">
                                                How much is Little Lambo Coin worth?
                                                <span>
                                                    <img
                                                        src="assets/images/icon/plus.svg"
                                                        alt=""
                                                        className="img-fluid IconPlus"
                                                    />
                                                    <img
                                                        src="assets/images/icon/munis.svg"
                                                        alt=""
                                                        className="Img-fluid IconMunise"
                                                    />
                                                </span>
                                            </h2>
                                            <div className="accordion-panel">
                                                <p>
                                                    Because we are so new, we have not yet had a price
                                                    discovery. This means it is a good time to start farming
                                                    to be an early adopter.
                                                </p>
                                            </div>
                                            <h2 className="accordion">
                                                Is Little Lambo Coin a "green" cryptocurrency?
                                                <span>
                                                    <img
                                                        src="assets/images/icon/plus.svg"
                                                        alt=""
                                                        className="img-fluid IconPlus"
                                                    />
                                                    <img
                                                        src="assets/images/icon/munis.svg"
                                                        alt=""
                                                        className="Img-fluid IconMunise"
                                                    />
                                                </span>
                                            </h2>
                                            <div className="accordion-panel">
                                                <p>
                                                    The answer is yes in respects to the amount of energy it
                                                    takes to acquire the coin compared to other
                                                    cryptocurrencies. This gives us a smaller carbon footprint
                                                    then other more energy consuming cryptocurrencies.{" "}
                                                </p>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Faq Section End */}
            {/* Blog list Start */}
            {/* <div class="blog-list-content bithu-blog-content">
      <div class="container">
          <div class="bithu_title_section mb-45">
              <h2>Latest Articles<span><img src="assets/images/icon/title_shapes.svg" alt="" /></span></h2>
              <h3>Blog Post</h3>
          </div>
          <div class="row">
              <div class="col-lg-4 col-md-6">
                  <div class="blog-item1">
                      <div class="blog-image">
                          <a href="#"><img src="assets/images/blog/blog-img.png" alt="Blog-Image"></a>
                      </div>
                      <div class="blog-text1">
                          <div class="sec-heading">
                              <div class="sub-inner mb-15">
                                  <span class="sub-title"> Nft</span> <a class="breadcrumbs-link" href="#"> 24 FEB, 2022</a>
                              </div>
                              <h4 class="title mb-0">
                                  <a href="blog-details.html"> How to Create Your 1st Crypto NFTs</a>
                              </h4>
                              <div class="blog-dots"></div>
                              <p> On the other hand, we denounce with righteous indignation and dislike men who are so beguiled </p>
                          </div>
                          <div class="blog-link d-flex justify-content-between">
                              <div class="blog-btn">
                                  <a href="blog-details.html"> Read more</a>
                              </div>
                              <div class="blog-icon">
                                  <a href="#"><img src="assets/images/blog/comment.png" alt=""><span>05</span></a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-lg-4 col-md-6">
                  <div class="blog-item1">
                      <div class="blog-image">
                          <a href="#"><img src="assets/images/blog/blog-img2.png" alt="Blog-Image"></a>
                      </div>
                      <div class="blog-text1">
                          <div class="sec-heading">
                              <div class="sub-inner">
                                  <span class="sub-title"> Gamming</span> <a class="breadcrumbs-link" href="#"> 13 FEB, 2022</a>
                              </div>
                              <h4 class="title mb-0">
                                  <a href="blog-details.html"> The New World is All about Metaverse</a>
                              </h4>
                              <div class="blog-dots dots1"></div>
                              <p> On the other hand, we denounce with righteous indignation and dislike men who are so beguiled</p>
                          </div>
                          <div class="blog-link d-flex justify-content-between">
                              <div class="blog-btn">
                                  <a href="blog-details.html"> Read more</a>
                              </div>
                              <div class="blog-icon">
                                  <a href="#"><img src="assets/images/blog/comment.png" alt=""><span>05</span></a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-lg-4 col-md-6">
                  <div class="blog-item1">
                      <div class="blog-image">
                          <a href="#"><img src="assets/images/blog/blog-img8.png" alt="Blog-Image"></a>
                      </div>
                      <div class="blog-text1">
                          <div class="sec-heading">
                              <div class="sub-inner mb-15">
                                  <span class="sub-title"> Metaverse</span><a class="breadcrumbs-link" href="#"> 18 JAN, 2022</a>
                              </div>
                              <h4 class="title mb-0">
                                  <a href="blog-details.html"> It’s the Great Chance to Invest in NFT</a>
                              </h4>
                              <div class="blog-dots dots2"></div>
                              <p> On the other hand, we denounce with righteous indignation and dislike men who are so beguiled</p>
                          </div>
                          <div class="blog-link d-flex justify-content-between">
                              <div class="blog-btn">
                                  <a href="blog-details.html"> Read more</a>
                              </div>
                              <div class="blog-icon">
                                  <a href="#"><img src="assets/images/blog/comment.png" alt=""><span>05</span></a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div> */}
            {/* Blog list End */}


            <Footer />
        </>
    )

}
export default Home;