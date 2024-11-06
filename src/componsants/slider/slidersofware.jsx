import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import bitbakedimg from "../../assets/bitbakedimg.png";
import githubimg from "../../assets/githubimg.png";
import gitlabimg from "../../assets/gitlabimg.png";
import vscodeimg from "../../assets/vscodeimg.png";
import dockerdsktop from "../../assets/dockerdsktop.png";
import ZohoSprintimg from "../../assets/ZohoSprintimg.png";
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
export default function Slidersofware() {
  const imgsatware = [
    { caption: "bitbucket", urlthaimber: bitbakedimg },
    { caption: "github", urlthaimber: githubimg },
    { caption: "gitlab", urlthaimber: gitlabimg },
    { caption: "vs code", urlthaimber: vscodeimg },
    { caption: "Docker desktop", urlthaimber: dockerdsktop },
    { caption: "Zoho CRM", urlthaimber: ZohoSprintimg },
  ];
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
      {imgsatware &&
        imgsatware.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={item.urlthaimber} alt={item.caption} />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
