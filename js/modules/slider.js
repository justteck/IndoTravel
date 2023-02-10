import Swiper from '../swiper.js';

new Swiper('.swiper', {
  autoplay: {
    delay: 3000,
  },
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.album__left',
    prevEl: '.album__right',
  },
});
