import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules

import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

export default function Slidersofware(logis) {
  const [saftawareslider] = useState(logis.translate.saft);
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
      breakpoints={{
        220: {
          slidesPerView: 1,
        },
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1440: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="mySwiper secand"
    >
      {saftawareslider &&
        saftawareslider.map((item, index) => {
          return (
            <SwiperSlide key={index} className="slide-item">
              <img src={item.urlthaimber} alt={item.caption} />
              <p className="caption sliders">{item.caption}</p>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
