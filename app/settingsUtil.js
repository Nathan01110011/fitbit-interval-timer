import {inbox} from "file-transfer";
import {readFileSync} from "fs";
import * as cbor from 'cbor';
import document from 'document';

let defaultSettings = {
    timerValue: 60,
    backgroundColor: 'black'
};
inbox.onnewfile = processInbox;

const time = document.getElementById("time-text");
const arc = document.getElementById("circ");
const bg = document.getElementById("bg");
const timer = document.getElementById("countdown-text");
const set = document.getElementById("set-text");

export let settings = defaultSettings;

export const loadSettings = () => {
    try {
        settings = readFileSync("settings.cbor", "cbor");
        transformSettings();
        mergeWithDefaultSettings();
    } catch (e) {
        settings = defaultSettings;
    }
    changeBackground();
};

function mergeWithDefaultSettings() {
    for (let key in defaultSettings) {
        if (!settings.hasOwnProperty(key)) {
            settings[key] = defaultSettings[key];
        }
    }
}

function processInbox() {
    let fileName;
    while (fileName = inbox.nextFile()) {
        if (fileName === 'settings.cbor') {
            loadSettings();
        }
    }
}

function transformSettings() {
    if (settings.toggle) {
        settings.timerValue = parseInt(settings.input.name);
    } else {
        settings.timerValue = settings.timerValue.values[0].value.valueOf();
    }
}

function changeBackground() {
    time.class = "time-text text-" + settings.backgroundColor;
    timer.class = "countdown-text text-" + settings.backgroundColor;
    set.class = "set-text text-" + settings.backgroundColor;
    bg.class = "background-" + settings.backgroundColor;
    arc.class = "circ arc-" + settings.backgroundColor;
}
