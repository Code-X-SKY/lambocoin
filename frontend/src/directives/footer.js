import React, { Component } from 'react'
import config from '../config/config'
import { Link } from 'react-router-dom';

const Footer = () => {


    return (

        <>

            {/* Bithu Footer Start */}
            <div className="bithu_v1_footer_sect footer-sec1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="bithu_title_section">
                                <h3>Join Our community &amp; get Early access</h3>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="join_comunity_btns list-btn">
                                <button className="wishlist_btn hov_shape_show">
                                    <img src="assets/images/blog/list-img3.png" alt="" />
                                    Join Twitter
                                    <span className="hov_shape1">
                                        <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                    </span>
                                    <span className="hov_shape2">
                                        <img src="assets/images/icon/hov_shape_L_dark.svg" alt="" />
                                    </span>
                                    <span className="square_hov_shape_dark" />
                                </button>
                                <button className="join_discord_btn hov_shape_show">
                                    <img src="assets/images/icon/dis_logo.svg" alt="" />
                                    Join Discord
                                    <span className="hov_shape1">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                    <span className="hov_shape2">
                                        <img src="assets/images/icon/hov_shape_L.svg" alt="" />
                                    </span>
                                    <span className="square_hov_shape_dark" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="star-image">
                        <div className="star-1 rotated-style">
                            <img src="assets/images/icon/star_6.svg" alt="" />
                        </div>
                        <div className="star-2 rotated-style">
                            <img src="assets/images/icon/star_3.svg" alt="" />
                        </div>
                        <div className="star-3 rotated-style">
                            <img src="assets/images/icon/star_1.svg" alt="" />
                        </div>
                        <div className="star-4 rotated-style">
                            <img src="assets/images/icon/star_7.svg" alt="" />
                        </div>
                        <div className="star-5 rotated-style">
                            <img src="assets/images/icon/star_4.svg" alt="" />
                        </div>
                        <div className="star-6 rotated-style">
                            <img src="assets/images/icon/star_2.svg" alt="" />
                        </div>
                        <div className="star-7 rotated-style">
                            <img src="assets/images/icon/star_5.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Bithu Footer End */}
            {/* Bithu Main Footer Start */}
            <div className="main-footer-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="footer_image">
                                <a href="#">
                                    <img src="assets/images/logo.png" alt="logo" width="90px" />
                                </a>
                            </div>
                            <p>
                                Little Lambo Coin is great solution for launch your NFT for minting.
                                It uses a dictionary over 200 Latin words, combined with a handful.
                            </p>
                        </div>
                        <div className="col-lg-2">
                            <div className="footer-menu">
                                <h5 className="menu-title">Site map</h5>
                                <ul className="menu-list">
                                    <li>
                                        <a href="#home">Home</a>
                                    </li>
                                    <li>
                                        <a href="#about">Resources</a>
                                    </li>
                                    <li>
                                        <a href="#team">Contact us</a>
                                    </li>
                                    <li>
                                        <a href="#faq">FAQs</a>
                                    </li>
                                    {/* <li><a href="blog.html">Articles</a></li> */}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="footer-menu">
                                <h5 className="menu-title">Company</h5>
                                <ul className="menu-list">
                                    <li>
                                        <a href="#">Whitepaper</a>
                                    </li>
                                    <li>
                                        <a href="#">Terms Canditions</a>
                                    </li>
                                    <li>
                                        <a href="#">Privacy Policy</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="footer_newsletter">
                                <h5 className="menu-title">Subscribe Newsletter</h5>
                                <div className="footer-button">
                                    <input
                                        type="text"
                                        name="text"
                                        placeholder="Email address"
                                        required=""
                                    />
                                    <a href="#">
                                        <img src="assets/images/blog/arrow-icon.png" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bithu Main Footer End */}
            {/* Bithu Footer Start */}
            <div className="bithu_v1_main_footer bithu-footer">
                <div className="footer_bottom footer-main">
                    <div className="footer_bottom_content">
                        <span className="footer_shapes_left">
                            <img src="assets/images/icon/footer_shapes_left.png" alt="" />
                        </span>
                        <span className="footer_shapes_right">
                            <img src="assets/images/icon/footer_shapes_right.png" alt="" />
                        </span>
                        <div className="container">
                            <div className="footer_menu">
                                <div className="bottom_footer_left">
                                    <div className="copiright_text">
                                        <a href="#">
                                            Copyright ©2022 Little Lambo Coin, All rights reserved.
                                        </a>
                                    </div>
                                </div>
                                <a href="#" className="bact_to_top_btn">
                                    <img src="assets/images/icon/back_to_top.svg" alt="" />
                                </a>
                                <div className="bottom_footer_right">
                                    <ul>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img.png" alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img2.png" alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img3.png" alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img4.png" alt="" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img5.png" alt="" />{" "}
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <img src="assets/images/blog/list-img6.png" alt="" />{" "}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bithu Footer End */}
           


        </>
    )

}
export default Footer;