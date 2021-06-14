import { inbox } from "file-transfer";
import { readFileSync } from "fs";

let defaultSettings = {
    restTimerValue: 60,
    backgroundColor: 'black'
};
inbox.onnewfile = processInbox;

export let settings = defaultSettings;

export const loadSettings = () => {
    try {
        settings = readFileSync("settings.cbor", "cbor");
        transformSettings();
        mergeWithDefaultSettings();
    } catch (e) {
        console.log('Settings Broken!')
        console.log(e)
        settings = defaultSettings;
    }
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
    if (settings.customRestToggle) {
        settings.restTimerValue = parseInt(settings.customRestTime.name);
    } else {
        settings.restTimerValue = settings.restTimerValue.values[0].value.valueOf();
    }
    try {
        if (settings.customExerciseTimeToggle) {
            settings.exerciseTimerValue = parseInt(settings.customExerciseTime.name);
        } else {
            settings.exerciseTimerValue = settings.exerciseTimerValue.values[0].value.valueOf();
        }
    } catch (e) {
        settings.exerciseTimerValue = 30;
    }
}
