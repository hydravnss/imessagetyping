/* iMessage Typing - hydravnss/imessagetyping */

.imessage-typing-indicator {
    position: sticky;
    bottom: 16px;
    margin: 6px 14px 10px;
    order: 9999;
    z-index: 50;
    display: flex;
    justify-content: flex-start;
    pointer-events: none;
    animation: fadeInBubble 0.25s ease-out;
}

@keyframes fadeInBubble {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}

.imessage-bubble {
    background-color: #E5E5EA;
    border-radius: 18px;
    padding: 11px 15px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* Queue propre (sans ligne bizarre) */
.imessage-bubble::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -5px;
    width: 14px;
    height: 14px;
    background: #E5E5EA;
    border-radius: 0 0 0 12px;
    transform: rotate(45deg);
    transform-origin: bottom left;
}

/* Points */
.imessage-dot {
    width: 9px;
    height: 9px;
    background-color: #8E8E93;
    border-radius: 50%;
    opacity: 0.35;
    animation: imessage-bounce 1.35s infinite ease-in-out both;
}

.imessage-dot:nth-child(1) { animation-delay: 0s; }
.imessage-dot:nth-child(2) { animation-delay: 0.18s; }
.imessage-dot:nth-child(3) { animation-delay: 0.36s; }

@keyframes imessage-bounce {
    0%, 60%, 100% {
        transform: translateY(0) scale(0.92);
        opacity: 0.35;
    }
    30% {
        transform: translateY(-5px) scale(1.18);
        opacity: 1;
    }
}

/* Dark mode */
body.dark-theme .imessage-bubble,
html[data-theme*="dark"] .imessage-bubble,
body[data-theme*="dark"] .imessage-bubble {
    background-color: #3A3A3C;
}
body.dark-theme .imessage-bubble::before,
html[data-theme*="dark"] .imessage-bubble::before,
body[data-theme*="dark"] .imessage-bubble::before {
    background-color: #3A3A3C;
}
body.dark-theme .imessage-dot,
html[data-theme*="dark"] .imessage-dot,
body[data-theme*="dark"] .imessage-dot {
    background-color: #AEAEB2;
}

/* ========== CACHE TOUT L’INDICATEUR NATIF ========== */
#typing_indicator,
.typing_indicator,
[id*="typing_indicator"],
.mes_block .typing,
.last_mes .typing,
.mes[is_typing],
.mes .typing_indicator,