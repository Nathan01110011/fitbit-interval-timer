import * as util from "../common/utils";
import document from "document";
import clock from "clock";
import {display} from "display";
import {preferences} from "user-settings";
import {vibration} from "haptics";
import {loadSettings, settings} from "./settingsUtil";

const countdownText = document.getElementById("countdown-text");
const countdownShadow = document.getElementById("countdown-text-shadow");
const setText = document.getElementById("set-text");
const setTextShadow = document.getElementById("set-text-shadow");
const currentTime = document.getElementById("time-text");
const currentTimeShadow = document.getElementById("time-text-shadow");
const circle = document.getElementById("circ");

const btnPlay = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnSkip = document.getElementById("btn-skip");
const btnReset = document.getElementById("btn-reset");

countdownText.text = countdownShadow.text = "Ready";
clock.granularity = "minutes";
display.autoOff = false;

let interval = settings.timerValue;
let lastValueTimestamp = Date.now();
let currentTimer = interval;
let activeFlag = false;
let timeElapsed;
let countdownInterval;
let setCount = 1;

loadSettings();
resetTimer();

function timerCountdown() {
    timeElapsed = (Date.now() - lastValueTimestamp) / 1000;
    let updated = Math.round((currentTimer - timeElapsed) * 10);
    let string = updated.toString();
    if (string === `0`) {
        vibration.start("nudge-max");
        resetTimer(true);
    }
    countdownText.text = countdownShadow.text = addDecimalPoint(string);
    circle.sweepAngle = Math.round(countdownText.text / interval * 100 * 1.8);
    display.poke();
}

function addDecimalPoint(number) {
    const size = number.length;
    return util.zeroPad(number.slice(0, size - 1) + "." + number.slice(size - 1));
}

btnPlay.onactivate = function (evt) {
    activeFlag = true;
    lastValueTimestamp = Date.now();
    countdownInterval = setInterval(timerCountdown, 100);
    setPlayingButtons();
};

btnPause.onactivate = function (evt) {
    activeFlag = false;
    currentTimer = countdownText.text;
    clearInterval(countdownInterval);
    setPausedButtons(true);
};

btnSkip.onactivate = function (evt) {
    resetTimer(true)
};

btnReset.onactivate = function (evt) {
    resetTimer(false)
};

function setPausedButtons(resetActive) {
    resetActive ? btnReset.style.display = "inline" : btnReset.style.display = "none";
    btnPlay.style.display = "inline";
    btnPause.style.display = "none";
    btnSkip.style.display = "none";
}

function setPlayingButtons() {
    btnPause.style.display = "inline";
    btnPlay.style.display = "none";
    btnReset.style.display = "none";
    btnSkip.style.display = "inline";
}

function resetTimer(incrementSet) {
    incrementSet ? setCount++ : setCount = 1;
    activeFlag = false;
    clearInterval(countdownInterval);
    setPausedButtons(incrementSet);
    interval = settings.timerValue;
    currentTimer = interval;
    circle.sweepAngle = 180;
    countdownText.text = countdownShadow.text = `Ready`;
    setText.text = setTextShadow.text = `Set ` + setCount;
    display.poke();
}

clock.ontick = evt => {
    let today = evt.date;
    let hours = today.getHours();
    preferences.clockDisplay === "12h" ? hours = hours % 12 || 12 : hours = util.zeroPad(hours);
    let mins = util.zeroPad(today.getMinutes());
    currentTime.text = currentTimeShadow.text = `${hours}:${mins}`;
};
