import React from 'react';
import Header from '../components/header/Header';
import Carousel from '../components/Slider/Carousel';
import IPhone from '../components/HotSale/components/Iphone'
import Samsung from '../components/HotSale/components/Samsung'
import Xiaomi from '../components/HotSale/components/Xiaomi';
import Footer from '../components/footer/Footer'
import AppChat from '../components/AppChat/AppChat'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
import { useSelector } from 'react-redux';
import Oppo from '../components/HotSale/components/Oppo';

function HomePage(props) {
    const {userInfo} = useSelector(state => state.userSignin)
    
    return (
        <div style={{position: 'relative'}}>
            <Header></Header>
            <Carousel></Carousel>
            <Samsung></Samsung>
            <Xiaomi></Xiaomi>
            <IPhone></IPhone>
            <Oppo></Oppo>
            <Footer></Footer>
            <ScrollToTop></ScrollToTop>
            {
               userInfo && userInfo.isAdmin === false ? (<AppChat></AppChat>) : ""
            }
        </div>
    );
}

export default HomePage;