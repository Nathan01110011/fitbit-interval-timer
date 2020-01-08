function mySettings(props) {
    return (
        <Page>

            <Section
                title={<Text bold align="center">Color Settings</Text>}>
                <ColorSelect
                    label={`Colour`}
                    settingsKey="backgroundColor"
                    colors={[
                        {color: '#000000', value: 'black'},
                        {color: '#943126', value: 'red'},
                        {color: '#1B4F72', value: 'blue'},
                        {color: '#FFFFFF', value: 'white'}
                    ]}
                />
            </Section>
            <Section
                title={<Text bold align="center">Timer Settings</Text>}>
                <Select
                    label={`Timer Value`}
                    settingsKey="timerValue"
                    options={[
                        {name: "30", value: 30},
                        {name: "60", value: 60},
                        {name: "120", value: 120},
                        {name: "300", value: 300}
                    ]}
                />
                <Toggle
                    settingsKey="toggle"
                    label="Custom Interval"
                />
                <TextInput
                    title="test"
                    label="Custom Interval Length (Seconds)"
                    placeholder="Type something"
                    type="number"
                    settingsKey="input"
                    disabled={!(props.settings.toggle === "true")}
                />
            </Section>

        </Page>);
}

registerSettingsPage(mySettings);
