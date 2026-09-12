(async function () {
    const waitForContext = () => new Promise(resolve => {
        if (window.SillyTavern?.getContext) return resolve(SillyTavern.getContext());
        const interval = setInterval(() => {
            if (window.SillyTavern?.getContext) {
                clearInterval(interval);
                resolve(SillyTavern.getContext());
            }
        }, 80);
    });

    const context = await waitForContext();
    const { eventSource, event_types, extensionSettings, saveSettingsDebounced, isStreamingEnabled } = context;

    const MODULE = 'imessagetyping';

    const defaultSettings = {
        enabled: true,
        streaming: true,
        bottom: 90,
    };

    function getSettings() {
        if (!extensionSettings[MODULE]) {
            extensionSettings[MODULE] = structuredClone(defaultSettings);
        }
        for (const key in defaultSettings) {
            if (extensionSettings[MODULE][key] === undefined) {
                extensionSettings[MODULE][key] = defaultSettings[key];
            }
        }
        return extensionSettings[MODULE];
    }

    function addExtensionSettings(settings) {
        const settingsContainer = document.getElementById('extensions_settings2')
            || document.getElementById('extensions_settings');
        if (!settingsContainer) return;
        if (document.getElementById('imessage_typing_settings')) return;

        const inlineDrawer = document.createElement('div');
        inlineDrawer.id = 'imessage_typing_settings';
        inlineDrawer.classList.add('inline-drawer');
        settingsContainer.append(inlineDrawer);

        const inlineDrawerToggle = document.createElement('div');
        inlineDrawerToggle.classList.add('inline-drawer-toggle', 'inline-drawer-header');

        const extensionName = document.createElement('b');
        extensionName.textContent = 'iMessage Typing';

        const inlineDrawerIcon = document.createElement('div');
        inlineDrawerIcon.classList.add('inline-drawer-icon', 'fa-solid', 'fa-circle-chevron-down', 'down');

        inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

        const inlineDrawerContent = document.createElement('div');
        inlineDrawerContent.classList.add('inline-drawer-content');
        inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

        // Enabled
        const enabledLabel = document.createElement('label');
        enabledLabel.classList.add('checkbox_label');
        const enabledCheckbox = document.createElement('input');
        enabledCheckbox.type = 'checkbox';
        enabledCheckbox.checked = settings.enabled;
        enabledCheckbox.addEventListener('change', () => {
            settings.enabled = enabledCheckbox.checked;
            saveSettingsDebounced();
            if (!settings.enabled) hideTypingIndicator();
        });
        const enabledText = document.createElement('span');
        enabledText.textContent = 'Enabled';
        enabledLabel.append(enabledCheckbox, enabledText);
        inlineDrawerContent.append(enabledLabel);

        // Show while streaming
        const streamingLabel = document.createElement('label');
        streamingLabel.classList.add('checkbox_label');
        const streamingCheckbox = document.createElement('input');
        streamingCheckbox.type = 'checkbox';
        streamingCheckbox.checked = settings.streaming;
        streamingCheckbox.addEventListener('change', () => {
            settings.streaming = streamingCheckbox.checked;
            saveSettingsDebounced();
        });
        const streamingText = document.createElement('span');
        streamingText.textContent = 'Show while streaming';
        streamingLabel.append(streamingCheckbox, streamingText);
        inlineDrawerContent.append(streamingLabel);

        // Position
        const positionLabel = document.createElement('label');
        positionLabel.style.display = 'block';
        positionLabel.style.marginTop = '12px';
        positionLabel.innerHTML = `<span>Position (depuis le bas) : <b id="imessage_bottom_value">${settings.bottom}px</b></span>`;

        const positionSlider = document.createElement('input');
        positionSlider.type = 'range';
        positionSlider.min = '40';
        positionSlider.max = '180';
        positionSlider.step = '2';
        positionSlider.value = settings.bottom;
        positionSlider.style.width = '100%';
        positionSlider.style.marginTop = '6px';

        positionSlider.addEventListener('input', () => {
            settings.bottom = parseInt(positionSlider.value);
            document.getElementById('imessage_bottom_value').textContent = settings.bottom + 'px';

            const el = document.getElementById('imessage_typing_indicator');
            if (el) el.style.bottom = settings.bottom + 'px';
            saveSettingsDebounced();
        });

        positionLabel.appendChild(positionSlider);
        inlineDrawerContent.append(positionLabel);
    }

    function createBubble() {
        const settings = getSettings();
        const wrapper = document.createElement('div');
        wrapper.id = 'imessage_typing_indicator';
        wrapper.className = 'imessage-typing-indicator';
        wrapper.style.bottom = settings.bottom + 'px';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'imessage-dot';
            wrapper.appendChild(dot);
        }

        return wrapper;
    }

    function showTypingIndicator(type, _args, dryRun) {
        const settings = getSettings();
        if (dryRun || ['quiet', 'impersonate'].includes(type)) return;
        if (!settings.enabled) return;
        if (!settings.streaming && isStreamingEnabled?.()) return;

        if (document.getElementById('imessage_typing_indicator')) return;

        const indicator = createBubble();
        document.body.appendChild(indicator);
    }

    function hideTypingIndicator() {
        document.getElementById('imessage_typing_indicator')?.remove();
    }

    // Init
    const settings = getSettings();
    addExtensionSettings(settings);

    eventSource.on(event_types.GENERATION_AFTER_COMMANDS, showTypingIndicator);
    eventSource.on(event_types.GENERATION_STARTED, showTypingIndicator);
    eventSource.on(event_types.GENERATION_STOPPED, hideTypingIndicator);
    eventSource.on(event_types.GENERATION_ENDED, hideTypingIndicator);
    eventSource.on(event_types.CHAT_CHANGED, hideTypingIndicator);
    eventSource.on(event_types.MESSAGE_RECEIVED, hideTypingIndicator);

    console.log('%c[iMessage Typing] loaded (dots only)', 'color: #34C759; font-weight: bold');
})();