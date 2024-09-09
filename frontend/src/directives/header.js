// import React, { Component } from 'react'
import { useState, useEffect } from "react";
import config from '../config/config'
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { useQRCode } from 'react-qrcode'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Header = (props) => {

    const [CopiedText, setCopiedText] = useState('')
    const [modalShow, setModalShow] = useState('');


    const [loginDataAddress, setloginDataAddress] = useState(localStorage.getItem("connectWalletAddress") ? localStorage.getItem("connectWalletAddress") : '');
    const [LittlelamboWallet, setLittlelamboWallet] = useState([]);
    const dataUrl = useQRCode(LittlelamboWallet?.llc_address || "NO WALLET")
    useEffect(() => {

        const { ethereum } = window;
        

        setInterval(() => {
            if (window.ethereum) {


                if (ethereum.selectedAddress && localStorage.getItem("connectWalletAddress")) {
                    var web3 = new Web3(window.ethereum);

                    var currentNetwork = web3.currentProvider.chainId;
                    if (currentNetwork != '80001' && currentNetwork != '0x13881') {
                        localStorage.setItem("connectWalletAddress", "");
                        Cookies.set('walletDetails', "");

                        return;
                    }
                    if (loginDataAddress != ethereum.selectedAddress) {
                        setloginDataAddress(ethereum.selectedAddress);
                        localStorage.setItem("connectWalletAddress", ethereum.selectedAddress);
                        // getWalletDetails(ethereum.selectedAddress);
                    }
                }

            }
        }, 1000);
        
    }, [])

    const refreshWallet = async (address) => {

        const res = await axios.post(config.API_URL + '/refreshAmount', {
            "address": address.toLowerCase()
        });

        if (res.data.success) {
            getWalletDetails(address)
            await Swal.fire({
                text: res.data.message,
                // icon: 'warning',
                // title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })
        }




    }

    const getWalletDetails = async (address) => {


        const res = await axios.post(config.API_URL + '/sign', {
            "address": address.toLowerCase()
        });

        if (res.data.success) {
            Cookies.set('walletDetails', JSON.stringify(res.data.data));
            setLittlelamboWallet(res.data.data);
            props.getWalletDetails(res.data.data);
            localStorage.setItem("connectWalletAddress", address);
        }


    }

    const logout = () => {
        localStorage.setItem('connectWalletAddress', '')
        setTimeout(() => {
            window.location.reload()
        });
    }
    const networkChanged = (chainId) => {
        window.location.reload()
    }
    const copyText = () => {
        setCopiedText("Copied")
        setTimeout(() => {
            setCopiedText("")
        }, 1500);
    }
    const connectMetasmask = async () => {


        try {
            if (window.ethereum) {
                await window.ethereum.send('eth_requestAccounts');
                window.web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

                var web3 = new Web3(window.ethereum);


                var currentNetwork = web3.currentProvider.chainId;

                if (currentNetwork != '80001' && currentNetwork != '0x13881') {
                    localStorage.setItem("connectWalletAddress", '');
                    Swal.fire({
                        text: 'Please select mumbai polygon network!',
                        // icon: 'warning',
                        // title: "Alert",
                        confirmButtonText: 'Okay',
                        confirmButtonColor: 'rgb(1 2 2)',
                        background: 'rgb(52 54 56)',
                        color: '#fff'
                    })

                    return false;
                }

                setloginDataAddress(accounts[0])
                localStorage.setItem("connectWalletAddress", accounts[0]);
                let res = await getWalletDetails(accounts[0]);
                setTimeout(() => {
                    // window.location.reload()
                }, 100);

                // setLittlelamboWallet()
            } else {
                Swal.fire({
                    text: `Please install MetaMask to use this dApp!`,
                    // icon: 'warning',
                    // title: "Alert",
                    confirmButtonText: 'Okay',
                    confirmButtonColor: 'rgb(1 2 2)',
                    background: 'rgb(52 54 56)',
                    color: '#fff'
                })

            }
        } catch (err) {
            Swal.fire({
                text: 'Please Connect Your  MetaMask Wallet!',
                // icon: 'warning',
                // title: "Alert",
                confirmButtonText: 'Okay',
                confirmButtonColor: 'rgb(1 2 2)',
                background: 'rgb(52 54 56)',
                color: '#fff'
            })
            console.log('err', err)
        }
    }
    return (

        <>

            {/*Preloader area start here*/}
            <section className="loader_first">
                <div className="circular-spinner" />
            </section>
            {/*Preloader area End here*/}
            {/*Header Start*/}
            <div className="bithu_header" id="navbar">
                <div className="container">
                    {/* Main Menu Start */}
                    <div className="bithu_menu_sect">
                        <div className="bithu_menu_left_sect">
                            <div className="logo">
                                <a href="./">
                                    <img src="assets/images/logo.png" alt="logo" />
                                </a>
                            </div>
                        </div>
                        <div className="bithu_menu_right_sect bithu_v1_menu_right_sect">
                            <div className="bithu_menu_list">
                                <ul>
                                    <li>
                                        <a href="#home">Home</a>
                                    </li>
                                    <li>
                                        <a href="#">Resources</a>
                                    </li>
                                    <li>
                                        <a href="#">Contact us</a>
                                    </li>
                                    {/* <li><a href="#about">About</a></li>
                          <li><a href="#roadmap">Roadmap</a></li>
                          <li><a href="#team">Team</a></li>
                          <li><a href="#faq">FAQ</a></li>
                          <li class="submenu">
                              <a href="#">Pages +</a>
                              <div class="sub_menu_sect">
                                  <ol class="sub_menu_list">
                                      <li><a href="index-2.html">Home One</a></li>
                                      <li><a href="index2.html">Home Two</a></li>
                                      <li><a href="index3.html">Home Three</a></li>
                                      <li><a href="index4.html">Home Four</a></li>
                                      <li><a href="mint.html">Mint One</a></li>
                                      <li><a href="mint2.html">Mint Two</a></li>
                                      <li><a href="comming-soon.html">Coming Soon</a></li>
                                      <li><a href="blog.html">Latest Blog</a></li>
                                      <li><a href="blog-details.html">Blog Details</a></li>
                                  </ol>
                              </div>
                          </li>
                      </ul> */}
                                </ul>
                            </div>
                            <div className="bithu_menu_right_buttons">
                                <ul className="header_social_links">
                                    {/* <li><a href="#"><img src="assets/images/icon/opensea.svg" alt="" /></a></li> */}
                                    <li>
                                        <a href="#">
                                            <i className="fa-brands fa-twitter" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa-brands fa-discord" />
                                        </a>
                                    </li>
                                    {/* {loginDataAddress.length > 0 ?
                                        <>
                                            <li>
                                                <span style={{ color: "#fff" }}>{loginDataAddress.toString().substring(0, 5) + '.....' + loginDataAddress.toString().substr(loginDataAddress.length - 5)}</span>

                                            </li>
                                            <li>
                                                <a href="#">
                                                    <img style={{ maxWidth: 'unset' }}
                                                        src="assets/images/icon/connect_wallet.svg" alt="" />
                                                </a>
                                            </li>
                                            <li onClick={e => logout()}>
                                                <a href="#">
                                                    <i className="fa fa-sign-out" />
                                                </a>
                                            </li>
                                        </>
                                        : ''} */}
                                </ul>
                                <button className="menu_bar">
                                    <i className="fa-solid fa-bars" />
                                </button>
                                {loginDataAddress.length > 0 ?
                                    <>
                                        {/* <span style={{ color: "#fff" }}>{loginDataAddress.toString().substring(0, 5) + '.....' + loginDataAddress.toString().substr(loginDataAddress.length - 5)}</span> */}

                                        <button onClick={e => logout()}
                                            className="connect_btn hov_shape_show"
                                        >Logout</button>
                                    </>
                                    :
                                    <button
                                        className="connect_btn hov_shape_show"
                                        // data-bs-toggle="modal"
                                        // data-bs-target="#connectModal"
                                        onClick={e => connectMetasmask()}
                                    >


                                        CONNECT
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_s.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_s.svg" alt="" />
                                        </span>
                                        <span className="square_hov_shape" />
                                    </button>
                                }
                            </div>
                        </div>


                        {loginDataAddress.length > 0 ?
                            <>
                                <button className="walletbtn" onClick={() => getWalletDetails(loginDataAddress)}><img data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" src="assets/images/icon/connect_wallet.svg" alt="" /></button>
                            </>
                            : ''}
                    </div>
                    {/* Main Menu END */}
                    {/* Mobile Menu Start */}
                    <div className="bithu_mobile_menu">
                        <div className="bithu_mobile_menu_content">
                            <div className="mobile_menu_logo">
                                <span>
                                    <img src="assets/images/logo.png" alt="" />
                                </span>
                                <button className="mobile_menu_close_btn">
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            </div>
                            <div className="bithu_mobile_menu_list">
                                <ul>
                                    <li className="mobile_menu_hide">
                                        <a href="#home">Home</a>
                                    </li>
                                    <li className="mobile_menu_hide">
                                        <a href="#">Resources</a>
                                    </li>
                                    <li className="mobile_menu_hide">
                                        <a href="#">Contact us</a>
                                    </li>
                                    {/* <li class="mobile_menu_hide"><a href="#about">About</a></li>
                          <li class="mobile_menu_hide"><a href="#roadmap">Roadmap</a></li>
                          <li class="mobile_menu_hide"><a href="#team">Team</a></li>
                          <li class="mobile_menu_hide"><a href="#faq">FAQ</a></li>
                          <li class="submenu mobile_submenu" id="submenu">
                              <a href="#">Pages +</a>
                              <ol class="sub_menu_list mobile_sub_menu_list" id="sub_menu_list">
                                  <li class="mobile_menu_hide"><a href="index-2.html">Home One</a></li>
                                  <li class="mobile_menu_hide"><a href="index2.html">Home Two</a></li>
                                  <li class="mobile_menu_hide"><a href="index3.html">Home Three</a></li>
                                  <li class="mobile_menu_hide"><a href="index4.html">Home Four</a></li>
                                  <li class="mobile_menu_hide"><a href="mint.html">Mint One</a></li>
                                  <li class="mobile_menu_hide"><a href="mint2.html">Mint Two</a></li>
                                  <li class="mobile_menu_hide"><a href="comming-soon.html">Coming Soon</a></li>
                                  <li class="mobile_menu_hide"><a href="blog.html">Latest Blog</a></li>
                                  <li class="mobile_menu_hide"><a href="blog-details.html">Blog Details</a></li>
                              </ol>
                          </li> */}
                                </ul>
                            </div>
                            <div className="mobile_menu_btns">
                                <ul className="mobile_menu_social_links">
                                    <li>
                                        <a href="#">
                                            <img src="assets/images/icon/opensea.svg" alt="" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa-brands fa-twitter" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa-brands fa-discord" />
                                        </a>
                                    </li>
                                </ul>
                                <button
                                    className="connect_btn hov_shape_show mobile_menu_hide"
                                    data-bs-toggle="modal"
                                    data-bs-target="#connectModal"
                                >
                                    <img src="assets/images/icon/connect_wallet.svg" alt="" />
                                    Connect
                                    <span className="hov_shape1">
                                        <img src="assets/images/icon/hov_shape_s.svg" alt="" />
                                    </span>
                                    <span className="hov_shape2">
                                        <img src="assets/images/icon/hov_shape_s.svg" alt="" />
                                    </span>
                                    <span className="square_hov_shape" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Menu End */}
                </div>
            </div>
            {/*Header End*/}
            {/* Connect Wallet Modal */}
            <div className="connect_modal">
                <div
                    className="modal fade "
                    id="connectModal"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal_overlay">

                                <div className="modal_header">

                                    <h2> Connect Wallet</h2>
                                    <button data-bs-dismiss="modal" aria-label="Close">
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                </div>
                                <div className="modal_body text-center">
                                    <p>
                                        Please select a wallet to connect for start Minting your NFTs
                                    </p>
                                    <div className="connect-section">
                                        <ul className="heading-list">
                                            <li onClick={e => connectMetasmask()}>
                                                <a  >
                                                    <span>
                                                        <img
                                                            src="assets/images/icon/MetaMask.svg"
                                                            alt="Meta-mask-Image"
                                                        />

                                                    </span>
                                                    MetaMask
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span>
                                                        <img
                                                            src="assets/images/icon/Formatic.svg"
                                                            alt="Coinbase-Image"
                                                        />
                                                    </span>
                                                    Coinbase
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span>
                                                        <img
                                                            src="assets/images/icon/Trust_Wallet.svg"
                                                            alt="Trust-Image"
                                                        />
                                                    </span>
                                                    Trust Wallet
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span>
                                                        <img
                                                            src="assets/images/icon/WalletConnect.svg"
                                                            alt="Wallet-Image"
                                                        />
                                                    </span>
                                                    WalletConnect
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <h6>
                                        By connecting your wallet, you agree to our{" "}
                                        <a href="#">Terms of Service</a> and our{" "}
                                        <a href="#">Privacy Policy</a>.
                                    </h6>
                                </div>
                                <div className="modal_bottom_shape">
                                    <span className="modal_bottom_shape_left">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                    <span className="modal_bottom_shape_right">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Connect Wallet Modal */}
            {/* Mint Modal */}
            <div className="mint_modal">
                <div
                    className="modal fade "
                    id="mintModal"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal_overlay2">
                                <div className="modal_header">
                                    <h2>Collect YOUR NFT before end</h2>
                                    <button data-bs-dismiss="modal" aria-label="Close">
                                        <span className="clossbtn_bg">
                                            <i className="fa-solid fa-xmark" />
                                        </span>
                                    </button>
                                </div>
                                <div className="modal_body text-center">
                                    <div className="mint_img">
                                        <img src="assets/images/icon/mint-img.png" alt="img" />
                                    </div>
                                    <div className="mint_count_list">
                                        <ul>
                                            <li>
                                                <h5>Remaining</h5>
                                                <h5>
                                                    4583/<span>9999</span>
                                                </h5>
                                            </li>
                                            <li>
                                                <h5>Price</h5>
                                                <h5>0.15 ETH</h5>
                                            </li>
                                            <li>
                                                <h5>Quantity</h5>
                                                <div className="mint_quantity_sect">
                                                    <button onClick="buttonClick_Dec();">-</button>
                                                    <input type="text" id="quantity" defaultValue={2} />
                                                    <button onClick="buttonClick_Inc();">+</button>
                                                </div>
                                                <h5>
                                                    <span>0.30</span> ETH
                                                </h5>
                                            </li>
                                        </ul>
                                    </div>
                                    <button className="modal_mint_btn hov_shape_show">
                                        MINT NOW
                                        <span className="hov_shape1">
                                            <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                        </span>
                                        <span className="hov_shape2">
                                            <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                        </span>
                                    </button>
                                    <h6>Presale &amp; Whitelist : Soldout</h6>
                                </div>
                                <div className="modal_bottom_shape">
                                    <span className="modal_bottom_shape_left">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                    <span className="modal_bottom_shape_right">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Section End*/}



            <div className={`offcanvas offcanvas-end ${modalShow}`} tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <i class="fa-solid fa-circle-user"></i>
                    <h5>Littlelambo Wallet</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="">
                        <i class="fa fa-times" aria-hidden="true"></i></button>
                </div>
                {!LittlelamboWallet.llc_address ?
                    <div className="offcanvas-body">
                        <div className="text-center">
                            <h5>Wallet not found, Due Network problem, Please try to refresh.</h5>
                            <div>
                                <br />
                                <butto class="btn btn-info" onClick={() => getWalletDetails(loginDataAddress)}>Refresh</butto>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="offcanvas-body">
                        <div className="text-center">
                            <h4>Balance :<span> {parseFloat(LittlelamboWallet.balance).toFixed(6)}</span> LLC</h4>
                        </div>
                        <div className="qr-area">
                            <img src={dataUrl} alt="" />
                        </div>
                        <div className="qr-text">
                            <h6>Scan this code to pay LLC</h6>
                            <div className="addressCopy" style={{ cursor: 'pointer' }}>
                                <span>{LittlelamboWallet.llc_address.toString().substring(0, 8) + '.....' + LittlelamboWallet.llc_address.toString().substr(LittlelamboWallet.llc_address.length - 8) } </span>
                                <CopyToClipboard text={LittlelamboWallet.llc_address}
                                    onCopy={() => copyText()}
                                >
                                <i className="fa fa-copy"></i>
                                </CopyToClipboard>
                                {CopiedText}

                            </div>
                            <br />
                            <span onClick={() => refreshWallet(loginDataAddress)} style={{ cursor: "pointer" }}>Refresh <i className="fa fa-refresh"></i></span>
                        </div>
                    </div>}
            </div>

        </>
    )

}
export default Header;