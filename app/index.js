import document from "document";
import clock from "clock";
import * as util from "../common/utils";

let timerText = document.getElementById("timer-text");
let setText = document.getElementById("set-text");
const circle = document.getElementById("circ");
const circleBack = document.getElementById("circBack");

let btnPlay = document.getElementById("btn-play");
let btnPause = document.getElementById("btn-pause");
let btnSkip = document.getElementById("btn-skip");
let btnReset = document.getElementById("btn-reset");
let currentTime = document.getElementById("current-time");
timerText.text = "5.0";
const interval = 5;

clock.granularity = "minutes";

let lastValueTimestamp = Date.now();
let currentTimer = interval;
let activeFlag = false;
let timeElapsed;
let countdownInterval;
let setCount = 1;

function timerCountdown() {
    timeElapsed = (Date.now() - lastValueTimestamp) / 1000;
    let updated = Math.round((currentTimer - timeElapsed) * 10);
    let string = updated.toString();
    if (string === `0`) {
        resetTimer(true);
    }
    timerText.text = addDecimalPoint(string);
    circle.sweepAngle = Math.round(timerText.text / interval * 100 * 1.8);
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
    currentTimer = timerText.text;
    clearInterval(countdownInterval);
    setPausedButtons();
};

btnSkip.onactivate = function (evt) {
    resetTimer(true)
};

btnReset.onactivate = function (evt) {
    resetTimer(false)
};

function setPausedButtons() {
    btnPlay.style.display = "inline";
    btnPause.style.display = "none";
    btnReset.style.display = "inline";
    btnSkip.style.display = "none";
}

function setPlayingButtons() {
    btnPause.style.display = "inline";
    btnPlay.style.display = "none";
    btnReset.style.display = "none";
    btnSkip.style.display = "inline";
}

function resetTimer(incrementSet) {
    incrementSet ? setCount ++ : setCount = 0;
    activeFlag = false;
    clearInterval(countdownInterval);
    setPausedButtons();
    currentTimer = interval;
    circle.sweepAngle = 180;
    timerText.text = interval;
    setText.text = `Set ` + setCount;
}

clock.ontick = evt => {
    let today = evt.date;
    let hours = today.getHours();
    // preferences.clockDisplay === "12h"
    true ? hours = hours % 12 || 12 : hours = util.zeroPad(hours);
    let mins = util.zeroPad(today.getMinutes());
    currentTime.text = `${hours}:${mins}`;
};
