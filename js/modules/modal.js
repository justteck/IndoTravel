// reservation modal
import {loadStyle} from './loadStyle.js';
import {makeCorrectEndings} from './correctDeclension.js';
import {fetchRequest} from './fetchRequest.js';
import {showResponseForm} from './controlForms.js';

const closeModal = (modalOverlay, closeBtn) => {
  const close = ({target}) => {
    if (target === closeBtn ||
        target.matches('.overlay')) {
      modalOverlay.remove();

      document.removeEventListener('click', close);
    }
  };

  document.addEventListener('click', close);
};

const confirmModal = (data, btn) => {
  btn.addEventListener('click', () => {
    console.log('clicked');
    fetchRequest('https://jsonplaceholder.typicode.com/posts', {
      method: 'post',
      callback: showResponseForm,
      body: {
        title: 'Booking',
        body: {
          name: data.name,
          phone: data.phone,
          date: data.dates,
          people: data.people,
          price: data.price,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

const renderModal = async (data, url) => {
  console.log('sd', data);
  await loadStyle(url);

  const {
    dates: tourDate,
    people: tourPeople,
    price: tourPrice} = data;

  const overlay = document.createElement('div');
  const modalWindow = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');
  const date = document.createElement('p');
  const price = document.createElement('button');
  const btnWrapper = document.createElement('div');

  const confirmBtn = document.createElement('button');
  const editBtn = document.createElement('button');

  overlay.classList.add('overlay', 'overlay_confirm');
  modalWindow.classList.add('modal');

  title.classList.add('modal__title');
  title.textContent = `Подтверждение заявки`;

  description.classList.add('modal__text');
  description.textContent =
    `Бронирование путешествия в Индию на ${tourPeople}
    ${makeCorrectEndings(tourPeople, 'человек', 'человека', 'человек')}`;

  date.classList.add('modal__text');
  date.textContent = `В даты: ${tourDate}`;

  price.classList.add('modal__text');
  price.textContent = `Стоимость тура ${tourPrice}`;

  btnWrapper.classList.add('modal__button');

  confirmBtn.classList.add('modal__btn', 'modal__btn_confirm');
  confirmBtn.textContent = 'Подтверждаю';

  editBtn.classList.add('modal__btn', 'modal__btn_edit');
  editBtn.textContent = 'Изменить данные';

  overlay.append(modalWindow);
  modalWindow.append(title, description, date, price, btnWrapper);
  btnWrapper.append(confirmBtn, editBtn);
  document.body.append(overlay);

  closeModal(overlay, editBtn);
  confirmModal(data, confirmBtn);
};

export {
  renderModal,
  closeModal,
};
