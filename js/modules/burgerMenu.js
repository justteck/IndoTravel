// menu

const menuBtn = document.querySelector('.header__menu-button');
const navigation = document.querySelector('.header__menu');

const menuToggle = () => navigation.classList.toggle('header__menu_active');
const menuClose = () => navigation.classList.remove('header__menu_active');

document.addEventListener('click', ({target}) => {
  if (target === menuBtn) {
    menuToggle();
  } else {
    menuClose();
  }
});
