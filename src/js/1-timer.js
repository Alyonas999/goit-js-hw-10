'use strict';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector("button[data-start]");
const input = document.querySelector("#datetime-picker");
const dataDay = document.querySelector("[data-days]");
const dataHours = document.querySelector("[data-hours]");
const dataMin = document.querySelector("[data-minutes]");
const dataSec = document.querySelector("[data-seconds]");

let userSelectedData = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selectedDates[0] <= new Date()) {
      iziToast.error({
        title: 'Error Illegal operation',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
      return;
    }
    userSelectedData = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(input, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedData) return;

  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const timeStop = userSelectedData - now;

    if (timeStop <= 0) {
      clearInterval(timerId);
      updateTimer(convertMs(0));
      input.disabled = false;
      return;
    }

    updateTimer(convertMs(timeStop));
  }, 1000);
});

function updateTimer({ days, hours, minutes, seconds }) {
  dataDay.textContent = addLeadingZero(days);
  dataHours.textContent = addLeadingZero(hours);
  dataMin.textContent = addLeadingZero(minutes);
  dataSec.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
};

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
console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}