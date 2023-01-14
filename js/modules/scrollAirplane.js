// scroll airplane

const page = document.documentElement;
const plane = document.createElement('div');
const planeWrapper = document.createElement('div');

planeWrapper.append(plane);
page.append(planeWrapper);

plane.classList.add('plane');
planeWrapper.classList.add('plane-wrapper');

planeWrapper.style.cssText = `
  position: fixed;
  right: 0;
  bottom: 0;
  width: 50px;
  height: 50px;
`;

plane.style.cssText = `
  width: 50px;
  height: 50px;
  background: url('/img/airplane.svg') center/contain;
  z-index: 999;
`;

// funcs
const addPlaneIcon = () => {
  document.body.append(planeWrapper);
};

const removePlaneIcon = () => {
  document.querySelector('.plane-wrapper').remove();
};

const controlPlaneIcon = () => {
  const planeIcon = document.querySelector('.plane-wrapper');
  if (page.clientWidth > 758) {
    if (!planeIcon) addPlaneIcon();
  } else if (planeIcon) {
    removePlaneIcon();
  }
};

const calcPositionPlane = () => {
  const maxTop = page.clientHeight - planeWrapper.clientHeight;
  const maxScroll = page.scrollHeight - page.clientHeight;
  const percentScroll = (window.pageYOffset / maxScroll) * 100;
  const top = maxTop * percentScroll / 100;

  planeWrapper.style.transform = `translateY(${-top}px)`;
};

const reversePlaneIcon = (direction) => {
  plane.style.transition = '0.3s';

  if (direction === 'up') {
    plane.style.transform = '';
  } else {
    plane.style.transform = 'rotate(0.5turn)';
  }
};

const changePlaneDirection = () => {
  let currentScrollPosition = 0;
  let direction = '';

  return () => {
    const newScrollPosition = page.scrollTop;

    if (newScrollPosition > currentScrollPosition) {
      if (direction === 'up') {
        reversePlaneIcon(direction);
      }
      direction = 'down';
    } else {
      if (direction === 'down') {
        reversePlaneIcon(direction);
      }
      direction = 'up';
    }

    currentScrollPosition = newScrollPosition;
  };
};

// execute
controlPlaneIcon();
calcPositionPlane();

const controlDirection = changePlaneDirection();

window.addEventListener('resize', controlPlaneIcon);

window.addEventListener('scroll', () => {
  controlDirection();
  calcPositionPlane();
});
