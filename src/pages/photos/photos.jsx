import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Virtual } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/virtual';
import 'react-toastify/dist/ReactToastify.css';

export default function Photos() {
  const apiUrls = process.env.REACT_APP_API_URL2;
  const [images, setImages] = useState([]);
  const toastShown = useRef(false);

  useEffect(() => {
    const fetchImages = () => {
      axios
        .get(`${apiUrls}/images/search?limit=10`)
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
  
            setImages(response.data);
          } else {
            console.error('Unexpected response format:', response.data);
          }
          if (!toastShown.current) {
            toast.success('Data fetched successfully!', {
              position: 'top-right',
              autoClose: 3000,
            });
            toastShown.current = true;
          }
        })
        .catch((error) => {
          console.error('There was an error!', error);
          if (!toastShown.current) {
            toast.error('Failed to fetch data.', {
              position: 'top-right',
              autoClose: 3000,
            });
            toastShown.current = true;
          }
        });
    };

    fetchImages(); // Fetch images when component mounts
  }, [apiUrls]);

  return (
    <div className='container'>
      
      <Swiper modules={[Virtual]} spaceBetween={50} slidesPerView={3} virtual>
  {images.map((img) => (
       <SwiperSlide key={img.id} style={{ width: '500px',heigh: '500px', objectFit: 'cover' }}>
      <img
        src={img.url}
        
        width={img.width} // Optional: if img.width is provided
        height={img.height} // Optional: if img.height is provided
      />
    </SwiperSlide>
  ))}
</Swiper>
    <ToastContainer />
  </div>
  )
}
