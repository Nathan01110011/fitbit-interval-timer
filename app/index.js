import { zeroPad, addDecimalPoint } from "../common/utils";
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
const currentSetMode = document.getElementById("current-set-mode");
const circle = document.getElementById("circ");

const startButton = document.getElementById("button-start");
const resetButton = document.getElementById("button-reset");
const continuePauseButton = document.getElementById("button-pause");

countdownText.text = countdownShadow.text = "Ready";
currentSetMode.style.display = 'none'
setText.style.display = setTextShadow.style.display = 'none'
clock.granularity = "minutes";
display.autoOff = false;

let restTimeInterval = settings.restTimerValue;
let currentTimer = restTimeInterval;
let exerciseTimeInterval = settings.exerciseTimerValue;
let lastValueTimestamp = Date.now();
let timeElapsed;
let countdownInterval;
let setCount = 1;
let activeFlag = false;
let nextTimerRest = true;

loadSettings();
setVariables();
resetTimer();
clearInterval(countdownInterval);
resetFunc();
startButton.text = "Start";


function keepAwake() {
    display.poke();
}

function timerCountdown() {

    timeElapsed = (Date.now() - lastValueTimestamp) / 1000;

    let updated = Math.round((currentTimer - timeElapsed) * 10);
    // Sometimes the above can throw a negative number which is weird but this fixes it
    if (updated < 0) {
        updated = 0;
    }
    let string = updated.toString();
    countdownText.text = countdownShadow.text = addDecimalPoint(updated.toString());

    if (settings.exerciseToggle && nextTimerRest) {
        circle.sweepAngle = Math.round(countdownText.text / settings.exerciseTimerValue * 100 * 1.8);
    } else {
        circle.sweepAngle = Math.round(countdownText.text / settings.restTimerValue * 100 * 1.8);
    }
    if (Date.now() <= lastValueTimestamp || !(parseFloat(string) > 0)) {
        vibration.start("ping")
        resetTimer();
    }
    display.poke();
}

function setVariables() {
    clearInterval(countdownInterval);
    startButton.style.display = 'inline'
    activeFlag = false;
    setCount = 0;
    restTimeInterval = settings.restTimerValue;
    exerciseTimeInterval = settings.exerciseTimerValue;
}

function resetTimer() {
    clearInterval(countdownInterval);
    if (settings.exerciseToggle) {
        if (nextTimerRest) {
            setText.style.display = setTextShadow.style.display = 'inline'
            setCount = setCount + 1;
            nextTimerRest = false;
            currentSetMode.text = 'Rest';
            currentTimer = settings.restTimerValue;
            activeFlag = true;
            lastValueTimestamp = Date.now();
            countdownInterval = setInterval(timerCountdown, 100);
            setPlaying();
        } else {
            nextTimerRest = true;
            currentSetMode.text = 'Exercise'
            currentTimer = exerciseTimeInterval;
            activeFlag = true;
            lastValueTimestamp = Date.now();
            countdownInterval = setInterval(timerCountdown, 100);
            setPlaying();
        }
    } else {

        activeFlag = false;
        countdownText.text = countdownShadow.text = `Ready`;
        currentSetMode.text = 'Exercise'
        continuePauseButton.text = 'Continue'
    }
    setText.text = setTextShadow.text = `Set ` + setCount;
}

startButton.addEventListener("click", (evt) => {
    vibration.start("confirmation-max")
    if (settings.exerciseToggle) {
        restTimeInterval = settings.restTimerValue;
        currentSetMode.text = 'Exercise'
        currentSetMode.style.display = 'inline'
        currentTimer = settings.exerciseTimerValue;
        nextTimerRest = true;
        activeFlag = true;
        lastValueTimestamp = Date.now();
        countdownInterval = setInterval(timerCountdown, 100);
        setPlaying();

    } else {
        setText.style.display = setTextShadow.style.display = 'inline'
        currentSetMode.style.display = 'inline'
        setCount = setCount + 1;
        setText.text = setTextShadow.text = `Set ` + setCount;
        currentSetMode.text = 'Rest'
        restTimeInterval = settings.restTimerValue;
        currentTimer = restTimeInterval;
        activeFlag = true;
        lastValueTimestamp = Date.now();
        countdownInterval = setInterval(timerCountdown, 100);
        setPlaying();
    }
})

continuePauseButton.addEventListener("click", (evt) => {
    vibration.start("confirmation-max")
    if (parseFloat(countdownText.text) > 1 || countdownText.text === 'Ready') {
        if (settings.exerciseToggle) {
            if (activeFlag == true) {
                activeFlag = false;
                currentTimer = countdownText.text;
                clearInterval(countdownInterval);
                continuePauseButton.text = 'Continue'
            } else {
                activeFlag = true;
                lastValueTimestamp = Date.now();
                countdownInterval = setInterval(timerCountdown, 100);
                continuePauseButton.text = 'Pause'
            }
        }
        else {
            if (activeFlag == true) {
                activeFlag = false;
                currentTimer = countdownText.text;
                clearInterval(countdownInterval);
                continuePauseButton.text = 'Continue'
            } else {
                if (countdownText.text === 'Ready') {
                    setCount = setCount + 1;
                    setText.text = setTextShadow.text = `Set ` + setCount;
                    currentTimer = restTimeInterval;
                    currentSetMode.text = 'Rest'
                }
                activeFlag = true;
                lastValueTimestamp = Date.now();
                countdownInterval = setInterval(timerCountdown, 100);
                continuePauseButton.text = 'Pause'

            }
        }
    }
}
)

resetButton.addEventListener("click", (evt) => {
    resetFunc();
})

function resetFunc() {
    startButton.style.display = 'inline'
    currentSetMode.style.display = 'none'
    setText.style.display = setTextShadow.style.display = 'none'
    continuePauseButton.text = 'Pause'
    countdownText.text = countdownShadow.text = `Ready`;
    setText.text = setTextShadow.text = `Set ` + setCount;
    setCount = 0
    activeFlag = false;
    nextTimerRest = false;
    clearInterval(countdownInterval);
    restTimeInterval = settings.timerValue;
    currentTimer = restTimeInterval;
    circle.sweepAngle = 180;
    display.poke();
    setVariables()
}

function setPlaying() {
    startButton.style.display = 'none'
}

clock.ontick = evt => {
    loadSettings();
    let today = evt.date;
    let hours = today.getHours();
    preferences.clockDisplay === "12h" ? hours = hours % 12 || 12 : hours = zeroPad(hours);
    let mins = zeroPad(today.getMinutes());
    currentTime.text = currentTimeShadow.text = `${hours}:${mins}`;
};
