import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate && userSelectedDate > new Date()) {
      document.querySelector('[data-start]').disabled = false;
    } else {
      iziToast.error({ title: 'Error', message: 'Please choose a date in the future' });
      document.querySelector('[data-start]').disabled = true;
    }
  },
};

flatpickr("#datetime-picker", options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer() {
  const now = new Date();
  const timeLeft = userSelectedDate - now;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    document.querySelector('[data-start]').disabled = true;
    document.querySelector('#datetime-picker').disabled = false;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

document.querySelector('[data-start]').addEventListener('click', () => {
  document.querySelector('[data-start]').disabled = true;
  document.querySelector('#datetime-picker').disabled = true;
  timerInterval = setInterval(updateTimer, 1000);
});