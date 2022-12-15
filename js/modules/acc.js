// acc

const accBtns = document.querySelectorAll('.travel__item-title');
const accItems = document.querySelectorAll('.travel__item');
const accTextWrappers = document.querySelectorAll('.travel__item-text-wrapper');

// funcs
const deactivateItems = () =>
  accItems.forEach(item => {
    item.classList.remove('travel__item_active');
  });

const getItemHeight = () => {
  let accItemHeight = 0;

  accTextWrappers.forEach(wrapper => {
    if (accItemHeight < wrapper.scrollHeight) {
      accItemHeight = wrapper.scrollHeight;
    }
  });

  return accItemHeight;
};

const controlAccItems = (btnIndex) => {
  accItems.forEach((item, itemIndex) => {
    if (itemIndex === btnIndex) {
      accTextWrappers[itemIndex].style.height =
        item.classList.contains('travel__item_active') ?
          '' : `${getItemHeight()}px`;
      item.classList.toggle('travel__item_active');
    } else {
      item.classList.remove('travel__item_active');
      accTextWrappers[itemIndex].style.height = '';
    }
  });
};

// execute
deactivateItems();

accBtns.forEach((btn, btnIndex) => {
  btn.addEventListener('click', () => controlAccItems(btnIndex));
});
