// timer

const timerBlock = document.querySelector('.timer');

const timerBlockDays = timerBlock.querySelector('.timer__count_days');
const timerBlockHours = timerBlock.querySelector('.timer__count_hours');
const timerBlockMinutes = timerBlock.querySelector('.timer__count_minutes');

const timer = () => {
  const deadline = timerBlock.dataset.timerDeadline;

  const makeTwoDigitsTime = time => {
    const twoDigitsTime = (time < 10) ? `0${time}` : time;

    return twoDigitsTime;
  };

  const makeCorrectUnits = (number, one, two, five) => {
    number %= 100;
    if (number >= 5 && number <= 20) {
      return five;
    }
    number %= 10;
    if (number === 1) {
      return one;
    }
    if (number >= 2 && number <= 4) {
      return two;
    }
    return five;
  };

  const getTimeRemaining = () => {
    const dateStop = new Date(deadline).getTime();
    const dateNow = Date.now();
    const timeRemaining = dateStop - dateNow;

    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);
    const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);
    const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);
    const seconds = Math.floor(timeRemaining / 1000 % 60);

    return {
      timeRemaining,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const renderTimerDays = () => {
    const timer = getTimeRemaining();

    timerBlockDays.textContent = timer.days;
    timerBlockDays.nextElementSibling.textContent =
      makeCorrectUnits(timer.days, 'день', 'дня', 'дней');

    timerBlockHours.textContent = makeTwoDigitsTime(timer.hours);
    timerBlockHours.nextElementSibling.textContent =
      makeCorrectUnits(timer.hours, 'час', 'часа', 'часов');

    timerBlockMinutes.textContent = makeTwoDigitsTime(timer.minutes);
    timerBlockMinutes.nextElementSibling.textContent =
      makeCorrectUnits(timer.minutes, 'минута', 'минуты', 'минут');
  };

  const renderTimerHours = () => {
    const timer = getTimeRemaining();

    timerBlockDays.textContent = timer.hours;
    timerBlockDays.nextElementSibling.textContent =
      makeCorrectUnits(timer.hours, 'час', 'часа', 'часов');

    timerBlockHours.textContent = makeTwoDigitsTime(timer.minutes);
    timerBlockHours.nextElementSibling.textContent =
    makeCorrectUnits(timer.minutes, 'минута', 'минуты', 'минут');

    timerBlockMinutes.textContent = makeTwoDigitsTime(timer.seconds);
    timerBlockMinutes.nextElementSibling.textContent =
    makeCorrectUnits(timer.seconds, 'секунда', 'секунды', 'секунд');
  };

  const removeSaleBlock = () => {
    const saleText = document.querySelector('.hero__text');
    const saleTimer = document.querySelector('.hero__timer');
    saleText.remove();
    saleTimer.remove();
  };

  const startTimer = () => {
    const timer = getTimeRemaining();

    // if more then 24h
    if (timer.timeRemaining > 1000 * 60 * 60 * 24) {
      renderTimerDays();
      setTimeout(startTimer, 1000 * 60);
    } else {
      // if less then 24h
      renderTimerHours();
      const timerId = setTimeout(startTimer, 1000);
      // if less then 1 minute
      if (timer.timeRemaining <= 1000) {
        clearTimeout(timerId);
        removeSaleBlock();
      }
    }
  };

  startTimer();
};

export {
  timer,
};
