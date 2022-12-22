// count total price
import {makeCorrectEndings} from './correctDeclension.js';

// forms
const tourForm = document.querySelector('.tour__form');
const reservationForm = document.querySelector('.reservation__form');

// total price el + total date and people el
const totalPriceElement = document.querySelector('.reservation__price');
const totalTourParametersElement = document.querySelector('.reservation__data');

// for formFieldsControl func
let tempCurrentPeople;
let tempCurrentDates;


// FUNCS
const resetFormTotalParameters = () => {
  totalPriceElement.innerHTML = '';
  totalTourParametersElement.innerHTML = '';
};

// get data from db
const getAllDataDB = async () => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return data;
};

const getToursDate = async (date) => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return [data.find(obj => obj.date === date)];
};

const getToursAmountPeople = async (amountPeople) => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return data.reduce((prev, curr) => {
    if (amountPeople >= curr['min-people'] &&
        amountPeople <= curr['max-people']) {
      return [...prev, curr];
    } else return [...prev];
  }, []);
};

// work with forms options
const createOption = (data) => {
  const option = document.createElement('option');
  option.classList.add('tour__option');
  option.value = option.textContent = data;

  return option;
};

const getAmountPeople = (array) => {
  const min = Math.min(...array.map(obj => obj['min-people']));
  const max = Math.max(...array.map(obj => obj['max-people']));

  return {
    min,
    max,
  };
};

const renderPeopleOptions = (array, select) => {
  const {min} = getAmountPeople(array);
  const {max} = getAmountPeople(array);
  let current = min;

  select.append(createOption('Количество человек'));
  select.children[0].disabled = true;

  while (current <= max) {
    select.append(createOption(current));
    current += 1;
  }
};

const renderDateOptions = (array, select) => {
  select.append(createOption('Выберите дату'));
  select.children[0].disabled = true;

  array.forEach(obj => {
    select.append(createOption(obj['date']));
  });
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

const formControl = (form) => {
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


// execute
resetFormTotalParameters();

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

formControl(tourForm);
formControl(reservationForm);

formFieldsControl(tourForm, reservationForm);
formFieldsControl(reservationForm, tourForm);

scrollToSecondForm();
