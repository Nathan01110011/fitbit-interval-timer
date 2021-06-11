import {zeroPad, addDecimalPoint} from "../common/utils";
import { loadSettings, settings } from "./settingsUtil";
import document from "document";
import clock from "clock";
import { display } from "display";
import { preferences } from "user-settings";
import { vibration } from "haptics";


const countdownText = document.getElementById("countdown-text");
const countdownShadow = document.getElementById("countdown-text-shadow");
const setText = document.getElementById("set-text");
const setTextShadow = document.getElementById("set-text-shadow");
const currentTime = document.getElementById("time-text");
const currentTimeShadow = document.getElementById("time-text-shadow");
const circle = document.getElementById("circ");
const startButton = document.getElementById("button-start");

const btnPlay = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnSkip = document.getElementById("btn-skip");
const btnReset = document.getElementById("btn-reset");

countdownText.text = countdownShadow.text = "Ready";
clock.granularity = "minutes";
display.autoOff = false;

let interval = settings.timerValue;
let currentTimer = interval;
let lastValueTimestamp = Date.now();
let timeElapsed;
let countdownInterval;
let setCount = 1;
let activeFlag = false;
loadSettings();


startButton.text = "Start";

function timerCountdown() {
    timeElapsed = (Date.now() - lastValueTimestamp) / 1000;
    let updated = Math.round((currentTimer - timeElapsed) * 10);
    let string = updated.toString();
    if (updated <= 0) {
        vibration.start("nudge-max");
        resetTimer(true);
    }
    countdownText.text = countdownShadow.text = addDecimalPoint(string);
    circle.sweepAngle = Math.round(countdownText.text / interval * 100 * 1.8);
    display.poke();
}

startButton.addEventListener("click", (evt) => {
    console.log("CLICKED");
    activeFlag = true;
    lastValueTimestamp = Date.now();
    countdownInterval = setInterval(timerCountdown, 100);
    setPlaying();
  })

function setPlaying() {

}

clock.ontick = evt => {
    loadSettings()
    interval = settings.timerValue;
    let today = evt.date;
    let hours = today.getHours();
    preferences.clockDisplay === "12h" ? hours = hours % 12 || 12 : hours = zeroPad(hours);
    let mins = zeroPad(today.getMinutes());
    currentTime.text = currentTimeShadow.text = `${hours}:${mins}`;
};
