import React, { useEffect, useState } from "react";
import "./Carousel.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ display: 'none' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{ display: 'none'}}
      onClick={onClick}
    />
  );
}

function Carousel(props) {
  let {slider, slider1, slider2} = props
  const [nav, setNav] = useState({nav1: null, nav2: null})

  useEffect(() => {
    setNav({
      nav1: slider1,
      nav2: slider2
    })
  }, [])

  const settings = {
    loop:true,
    dots: false,
    infinite: true,
    // autoplay: true,
    // autoplaySpeed: 2500,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

 
  const next = () =>  {
    console.log(slider1)
    slider1.slickNext();
  }
  const previous = () => {
    slider2.slickPrev();
  }

  return (
    <section id="carousel">
      <div className="carousel">
        <div className="carousel-left">
          <div className="carousel-left-slide">
            <Slider asNavFor={nav.nav2}
                    ref={slider => (slider1 = slider)} 
                    {...settings} >
              <div key={1}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-15-17390-sliding.png"></img>
              </div>
              <div key={2}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/GALAXY-AI-WEEK-homepage.png"></img>
              </div>
              <div key={3}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/Sliding%20air%2013mb.png"></img>
              </div>
              <div key={4}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/soundpeats_watch_4_sliding.jpg"></img>
              </div>
              <div key={5}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/robot-hut-bui-roborock-s8-max-ultra-slide-11-04-24.jpg"></img>
              </div>
              <div key={6}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/asus.jpg"></img>
              </div>
              <div key={7}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/thu-cu-dong-ho-sliding.jpg"></img>
              </div>
              <div key={8}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/masstel-sliding-th444.jpg"></img>
              </div>
              <div key={9}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/massage-philips-11-04-2024.jpg"></img>
              </div>
              <div key={10}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/Galaxy-Tab-S9-FE-Plus-WIFI-8GB-128GB.png"></img>
              </div>
              <div key={11}>
                <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/vivo-y03-sliding-th4.png"></img>
              </div>
            </Slider>
            <div className='carousel-left-move' onClick={() => previous()}>
                <div className="prev">
                    <LeftOutlined></LeftOutlined>
                </div>
                <div className="next" onClick={() => next()}>
                    <RightOutlined></RightOutlined>
                </div>
            </div>
          </div>
          <div className="carousel-left-bottom">
            <Slider asNavFor={nav.nav1}
                    ref={slider => (slider2 = slider)}
                    slidesToShow={4}
                    swipeToSlide={true}
                    focusOnSelect={true}
                     >
              
              <div>
              IPHONE 15 SERIES <br></br> Deal hời mua ngay
              </div>
              <div>
              GALAXY AI WEEK  <br></br>  Giá tốt chốt ngay
              </div>
              <div>
              MACBOOK AIR M3  <br></br>  Sẵn hàng mua ngay
              </div>
              <div>
              SOUNDPEATS WATCH  <br></br>  Mở bán mua ngay
              </div>
              <div>
              ROBOROCK S8 MAX   <br></br>  Mở bán quá khủng
              </div>
              <div>
              ASUS VIVOBOOK   <br></br>  Chỉ từ 16.69 triệu
              </div>
              <div>
              THU CŨ ĐỒNG HỒ   <br></br>  Trợ giá đến 400K
              </div>
              <div>
              ĐIỆN THOẠI MASSTEL   <br></br> Chính hãng quá rẻ
              </div>
              <div>
              MÁY MASSAGE   <br></br>  Ưu đãi đến 30%
              </div>
              <div>
              TAB S9 FE+   <br></br>  Ưu đãi cực sốc
              </div>
              <div>
              VIVO Y03   <br></br> Săn ngay giá tốt
              </div>

            </Slider>
          </div>
        </div>
        <div className="carousel-right">
          <div className="carousel-right-item">
            <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/samsung-23-right-1325.png"></img>
          </div>
          <div className="carousel-right-item">
            <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-ipad-th444.jpg"></img>
          </div>
          <div className="carousel-right-item">
            <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right%20sv.png"></img>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
