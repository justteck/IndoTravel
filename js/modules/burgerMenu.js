// menu

const animationDuration = 0.4;
const menuBtn = document.querySelector('.header__menu-button');
const navigation = document.querySelector('.header__menu');

// styles for nav
navigation.style.transform = 'scaleY(0)';
navigation.style.transition = `transform ${animationDuration}s ease`;
navigation.style.transformOrigin = 'top';
navigation.dataset.menu = false;

// funcs
const animateMenuToggle = () => {
  if (navigation.dataset.menu === 'false') {
    navigation.style.transform = 'scaleY(1)';
    navigation.style.zIndex = 1;
    navigation.style.opacity = 1;
    navigation.dataset.menu = true;
  } else {
    navigation.style.transform = 'scaleY(0)';
    navigation.dataset.menu = false;
  }
};

const animateMenuClose = () => {
  navigation.style.transform = 'scaleY(0)';
  navigation.dataset.menu = false;
};

const menuControl = ({target}) => {
  if (target === menuBtn) {
    animateMenuToggle();
  } else if (navigation.dataset.menu === 'true') {
    animateMenuClose();
  }
};

// execute
document.addEventListener('click', (e) => {
  menuControl(e);
});
