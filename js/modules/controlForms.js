// imports
import {makeCorrectEndings} from './correctDeclension.js';
import {fetchRequest} from './fetchRequest.js';
import {
  getAllDataDB,
  getToursDate,
  getToursAmountPeople,
} from './requestsDB.js';
import {
  renderModal,
  closeModal,
} from './modal.js';

// forms
const tourForm = document.querySelector('.tour__form');
const reservationForm = document.querySelector('.reservation__form');
const footerForm = document.querySelector('.footer__form');

// total price element + total date and people elements
const totalPriceElement = document.querySelector('.reservation__price');
const totalTourParametersElement = document.querySelector('.reservation__data');

// for formFieldsControl func
let tempCurrentPeople;
let tempCurrentDates;

// ----- FUNCS -----
// set defaults for forms
const setDefaultFormParameters = () => {
  totalPriceElement.innerHTML = '';
  totalTourParametersElement.innerHTML = '';

  const selects = document.querySelectorAll('.reservation__select');
  selects.forEach(item => {
    item.required = true;
  });

  const formName = document.querySelector('.reservation__input_name');
  formName.required = true;
  formName.name = 'name';

  const formPhone = document.querySelector('#reservation__phone');
  formPhone.required = true;
  formPhone.type = 'tel';
  formPhone.name = 'phone';

  const footerInput = document.querySelector('.footer__input');
  footerInput.name = 'mail';
};

// disable form fields
const disableFormFields = (form) => {
  const selects = form.querySelectorAll('select');
  const inputs = form.querySelectorAll('input');
  const buttons = form.querySelectorAll('button');

  form.reset();
  selects[0].textContent = '';
  selects[1].textContent = '';
  selects.forEach(item => item.disabled = true);
  inputs.forEach(item => item.disabled = true);
  buttons.forEach(item => item.disabled = true);
};

// get min and max number of people
const getAmountPeople = (array) => {
  const min = Math.min(...array.map(obj => obj['min-people']));
  const max = Math.max(...array.map(obj => obj['max-people']));

  return {
    min,
    max,
  };
};

// work with forms options
const createOption = (data) => {
  const option = document.createElement('option');
  option.classList.add('tour__option');
  option.value = option.textContent = data;

  return option;
};

const renderPeopleOptions = (array, select) => {
  const {min} = getAmountPeople(array);
  const {max} = getAmountPeople(array);
  let current = min;

  select.append(createOption('Количество человек'));
  select.children[0].disabled = true;
  select.children[0].value = '';

  while (current <= max) {
    select.append(createOption(current));
    current += 1;
  }
};

const renderDateOptions = (array, select) => {
  select.append(createOption('Выберите дату'));
  select.children[0].disabled = true;
  select.children[0].value = '';

  array.forEach(obj => {
    select.append(createOption(obj['date']));
  });
};

// fetch callbacks
const showResponseForm = (err, data) => {
  const modalFail = document.querySelector('.overlay-fail');
  const modalFailBtn = modalFail.querySelector('.modal__btn_fail');

  const modalOK = document.querySelector('.overlay-ok');
  const modalOKbtn = modalOK.querySelector('.modal__btn_ok');

  const modalConfirm = document.querySelector('.overlay_confirm');

  if (err) {
    console.warn(err, data);
    console.log('FAIL');

    modalConfirm.remove();
    modalFail.classList.add('overlay-active');
    closeModal(modalFail, modalFailBtn);

    return;
  }
  console.log('OK');

  modalConfirm.remove();
  modalOK.classList.add('overlay-active');
  closeModal(modalOK, modalOKbtn);
  disableFormFields(reservationForm);
};

const showResponseFooter = (err, data) => {
  const footerFormTitle = document.querySelector('.footer__form-title');
  const footerFormText = document.querySelector('.footer__text');
  const footerInput = document.querySelector('.footer__input-wrap');

  const resizeBlock = () => {
    footerForm.style.minHeight = `${footerForm.offsetHeight}px`;
    footerForm.style.minWidth = `${footerForm.offsetWidth}px`;
    footerInput.style.display = 'none';
  };

  if (err) {
    console.warn(err, data);

    footerFormTitle.textContent = 'Что-то пошло не так =(';
    footerFormText.textContent = `При отправке произошла ошибка.
    Попробуйте отправить данные позже.`;

    resizeBlock();

    return;
  }

  footerFormTitle.textContent = 'Ваша заявка успешно отправлена';
  footerFormText.textContent =
    `Наши менеджеры свяжутся с Вами в течение 3-х рабочих дней`;

  resizeBlock();
};

// forms control
const setFormOptions = (form, selectName, toursArr, cbRender) => {
  const select = form[selectName];
  select.innerHTML = '';

  cbRender(toursArr, select);
};

const formFieldsControl = (formOne, formTwo) => {
  tempCurrentPeople = formOne.people.value;
  tempCurrentDates = formOne.dates.value;

  const makeOptionSelected = (form, selectName, currenValue) => {
    Array.from(form[selectName].children).forEach(option => {
      if (option.value === currenValue) {
        option.selected = true;
      }
    });
  };

  const changeAmountPeople = async () => {
    const currentPeople = formOne.people.value;

    setFormOptions(
        formOne,
        'dates',
        await getToursAmountPeople(currentPeople),
        renderDateOptions);

    setFormOptions(
        formTwo,
        'dates',
        await getToursAmountPeople(currentPeople),
        renderDateOptions);

    tempCurrentPeople = currentPeople;
    makeOptionSelected(formOne, 'dates', tempCurrentDates);

    // duplicate selected for second form
    makeOptionSelected(formTwo, 'people', tempCurrentPeople);
    makeOptionSelected(formTwo, 'dates', tempCurrentDates);
  };

  const changeDate = async () => {
    const currentDates = formOne.dates.value;

    setFormOptions(
        formOne,
        'people',
        await getToursDate(currentDates),
        renderPeopleOptions);

    setFormOptions(
        formTwo,
        'people',
        await getToursDate(currentDates),
        renderPeopleOptions);

    tempCurrentDates = currentDates;
    makeOptionSelected(formOne, 'people', tempCurrentPeople);

    // duplicate selected values for second form
    makeOptionSelected(formTwo, 'dates', tempCurrentDates);
    makeOptionSelected(formTwo, 'people', tempCurrentPeople);
  };

  formOne.dates.addEventListener('change', changeDate);

  formOne.people.addEventListener('change', changeAmountPeople);
};

const showFormTotalPrice = (form) => {
  const defaultDate = form.dates.value;
  const defaultPeople = form.people.value;

  form.addEventListener('change', async () => {
    let currentDate;
    let currentPeople;

    if (form.dates.value !== defaultDate &&
        form.people.value !== defaultPeople) {
      currentDate = form.dates.value;
      currentPeople = form.people.value;

      const tourObj = await getToursDate(currentDate);

      totalTourParametersElement.textContent =
        `${currentDate}, ${currentPeople}
        ${makeCorrectEndings(currentPeople, 'человек', 'человека', 'человек')}`;

      totalPriceElement.textContent = `${tourObj[0].price * currentPeople} ₽`;
    }
  });
};

const showFooterFormResponse = () => {
  footerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = footerForm.mail.value;

    fetchRequest('https://jsonplaceholder.typicode.com/posts', {
      method: 'post',
      callback: showResponseFooter,
      body: {
        title: 'Mail',
        body: {
          mail: data,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

const scrollToSecondForm = () => {
  const scrollBtn = tourForm.querySelector('.tour__button');
  const destinationBlock = document.querySelector('.reservation');

  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();

    scrollBy({
      left: 0,
      top: destinationBlock.offsetTop - window.pageYOffset,
      behavior: 'smooth',
    });
  });
};

const controlCorrectFields = (form) => {
  const regExpName = /[^а-яё\s]/ig;
  const regExpPhone = /[^0-9+]/;
  form.name.addEventListener('input', () => {
    form.name.value = form.name.value.replace(regExpName, '');
  });

  form.phone.addEventListener('input', () => {
    form.phone.value = form.phone.value.replace(regExpPhone, '');
  });
};

const isFormNameCorrect = (form) => {
  const regExp = /(\s+)?([а-яА-Я]+)(\s+)([а-яА-Я]+)(\s+)([а-яА-Я]+)(\s*)/i;
  return regExp.test(form.name.value);
};

// modal

const showModal = (form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormNameCorrect(form)) {
      const formData = new FormData(e.target);

      const data = Object.fromEntries(formData);
      data.price = form.querySelector('.reservation__price').textContent;

      renderModal(data, 'css/modal.css');
    } else {
      const currentName = form.name.value;
      form.name.value = 'ФИО некорректно';
      form.name.style.color = 'red';

      setTimeout(() => {
        form.name.value = currentName;
        form.name.style.color = '';
      }, 3000);
    }
  });
};

// EXECUTE
setDefaultFormParameters();

// set form options on page load
setFormOptions(
    tourForm,
    'dates',
    await getAllDataDB(),
    renderDateOptions);

setFormOptions(
    tourForm,
    'people',
    await getAllDataDB(),
    renderPeopleOptions);

setFormOptions(
    reservationForm,
    'dates',
    await getAllDataDB(),
    renderDateOptions);

setFormOptions(
    reservationForm,
    'people',
    await getAllDataDB(),
    renderPeopleOptions);

// forms control
showFormTotalPrice(tourForm);
showFormTotalPrice(reservationForm);
showFooterFormResponse();
showModal(reservationForm);

formFieldsControl(tourForm, reservationForm);
formFieldsControl(reservationForm, tourForm);

scrollToSecondForm();

controlCorrectFields(reservationForm);

export {
  showResponseForm,
};
