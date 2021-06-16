function mySettings(props) {
    return (
        <Page>
            <Section
                title={<Text bold align="center">Rest Break Settings</Text>}>
                <Select
                    label={`Timer Value`}
                    settingsKey="restTimerValue"
                    options={[
                        { name: "30", value: 30 },
                        { name: "60", value: 60 },
                        { name: "120", value: 120 },
                        { name: "300", value: 300 }
                    ]}
                    disabled={(props.settings.customRestToggle === "true")}
                />
                <Toggle
                    settingsKey="customRestToggle"
                    label="Custom Interval"
                />
                
            {props.settings.customRestToggle ? (
                    JSON.parse(props.settings.customRestToggle) == true ? (
                        <TextInput
                        label="Custom Interval Length"
                        placeholder="Type an interval in seconds"
                        type="number"
                        settingsKey="customRestTime"
                    />  
                    ) : null
                ) : null}
            </Section>

            <Section title={<Text bold align="center">Timed Exercise Settings</Text>}>
                <Toggle settingsKey="exerciseToggle" label="Exercise Times" />
                {props.settings.exerciseToggle ? (
                    JSON.parse(props.settings.exerciseToggle) == true ? (
                        <Section>
                        <Select
                    label={`Exercise Time`}
                    settingsKey="exerciseTimerValue"
                    options={[
                        { name: "30", value: 30 },
                        { name: "60", value: 60 },
                        { name: "120", value: 120 },
                        { name: "300", value: 300 }
                    ]}
                    disabled={(props.settings.customExerciseTimeToggle === "true")}
                />
                <Toggle settingsKey="customExerciseTimeToggle" label="Custom Exercise Time" />
                {props.settings.customExerciseTimeToggle ? (
                    JSON.parse(props.settings.customExerciseTimeToggle) == true ? (
                <TextInput label="Custom Interval Length" placeholder="Type an interval in seconds" type="number" settingsKey="customExerciseTime" />
                ) : null
            ) : null}
                    </Section>
                    ) : null
                ) : null}
            </Section>

            <Section title={<Text bold align="center">Reset To Defaults</Text>}>
                <Toggle settingsKey="resetToggle" label="Are you sure?" />
                {props.settings.resetToggle ? (
                    JSON.parse(props.settings.resetToggle) == true ? (
                            <Button list label="Reset settings to defaults" onClick={() => props.settingsStorage.clear()} />
                    ) : null
                ) : null}
            </Section>
        </Page>);
}

registerSettingsPage(mySettings);

