import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination,Autoplay  } from 'swiper/modules';
export default function Slider(props) {

  return (
    <Swiper
    slidesPerView={3}
    spaceBetween={30}
    freeMode={true}
    pagination={{
      clickable: true,
    }}
    autoplay={{
      delay: 3000, // Delay in milliseconds (3000ms = 3s)
      disableOnInteraction: false, // Autoplay will not stop after user interaction
    }}
    modules={[FreeMode, Pagination,Autoplay]}
    className="mySwiper first"
  >
    <SwiperSlide> Wordpress elementor / divi </SwiperSlide>
    <SwiperSlide> Wordpress gentburg / vue js </SwiperSlide>
    <SwiperSlide> Front end  React js</SwiperSlide>
    <SwiperSlide> Front end  Angulars js</SwiperSlide>
    <SwiperSlide> Front end  Next js</SwiperSlide>
  </Swiper>
  )
}
