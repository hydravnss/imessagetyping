import {
    name2,
    eventSource,
    event_types,
    isStreamingEnabled,
    saveSettingsDebounced,
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const MODULE = 'imessagetyping';

const defaultSettings = {
    enabled: true,
    streaming: true,   // activé par défaut pour que tu le voies tout de suite
};

function getSettings() {
    if (extension_settings[MODULE] === undefined) {
        extension_settings[MODULE] = structuredClone(defaultSettings);
    }
    for (const key in defaultSettings) {
        if (extension_settings[MODULE][key] === undefined) {
            extension_settings[MODULE][key] = defaultSettings[key];
        }
    }
    return extension_settings[MODULE];
}

function addExtensionSettings(settings) {
    const settingsContainer = document.getElementById('extensions_settings2')
        || document.getElementById('extensions_settings');
    if (!settingsContainer) return;

    const inlineDrawer = document.createElement('div');
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
}

function createBubble() {
    const wrapper = document.createElement('div');
    wrapper.id = 'imessage_typing_indicator';
    wrapper.className = 'imessage-typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'imessage-bubble';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'imessage-dot';
        bubble.appendChild(dot);
    }

    wrapper.appendChild(bubble);
    return wrapper;
}

function showTypingIndicator(type, _args, dryRun) {
    const settings = getSettings();
    const noIndicatorTypes = ['quiet', 'impersonate'];

    if (noIndicatorTypes.includes(type) || dryRun) return;
    if (!settings.enabled) return;
    if (!settings.streaming && isStreamingEnabled()) return;

    // Force show even if name2 is empty (for testing)
    let indicator = document.getElementById('imessage_typing_indicator');
    if (indicator) return;

    indicator = createBubble();
    const chat = document.getElementById('chat');
    if (chat) {
        chat.appendChild(indicator);

        // Scroll to bottom if already at bottom
        const wasScrolledDown = Math.ceil(chat.scrollTop + chat.clientHeight) >= chat.scrollHeight - 20;
        if (wasScrolledDown) {
            setTimeout(() => {
                chat.scrollTop = chat.scrollHeight;
            }, 50);
        }
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('imessage_typing_indicator');
    if (indicator) {
        indicator.remove();
    }
}

(function () {
    const settings = getSettings();
    addExtensionSettings(settings);

    // Events
    eventSource.on(event_types.GENERATION_AFTER_COMMANDS, showTypingIndicator);
    eventSource.on(event_types.GENERATION_STARTED, showTypingIndicator); // extra safety

    eventSource.on(event_types.GENERATION_STOPPED, hideTypingIndicator);
    eventSource.on(event_types.GENERATION_ENDED, hideTypingIndicator);
    eventSource.on(event_types.CHAT_CHANGED, hideTypingIndicator);
    eventSource.on(event_types.MESSAGE_RECEIVED, hideTypingIndicator);

    console.log('[iMessage Typing] Extension loaded');
})();