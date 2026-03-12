/**
 * Ally-Engine Widget v1.0
 * The Ally-Ability Network — Embeddable Accessibility Toolbar
 * 
 * Usage:
 * <script src="https://your-domain.com/widget/ally-engine.js" data-api-key="YOUR_API_KEY"></script>
 */
(function () {
    'use strict';

    var API_BASE = 'http://localhost:4000/v1';
    var scriptTag = document.currentScript;
    var apiKey = scriptTag && scriptTag.getAttribute('data-api-key');
    var partnerId = null;
    var sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);

    // State
    var state = {
        highContrast: false,
        dyslexicFont: false,
        textSize: 'normal' // normal | large | xlarge
    };

    // Load saved state
    try {
        var saved = localStorage.getItem('ally_engine_prefs');
        if (saved) state = JSON.parse(saved);
    } catch (e) { }

    function saveState() {
        try { localStorage.setItem('ally_engine_prefs', JSON.stringify(state)); } catch (e) { }
    }

    function logEvent(eventType) {
        if (!partnerId) return;
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_BASE + '/widget/event', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ partner_id: partnerId, event_type: eventType, session_id: sessionId }));
        } catch (e) { }
    }

    function applyState() {
        var body = document.body;
        body.classList.remove('ally-high-contrast', 'ally-dyslexic', 'ally-text-large', 'ally-text-xlarge');
        if (state.highContrast) body.classList.add('ally-high-contrast');
        if (state.dyslexicFont) body.classList.add('ally-dyslexic');
        if (state.textSize === 'large') body.classList.add('ally-text-large');
        if (state.textSize === 'xlarge') body.classList.add('ally-text-xlarge');
        saveState();
    }

    function injectStyles() {
        var css = [
            '@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap");',
            'body.ally-high-contrast { background-color: #000 !important; color: #ff0 !important; }',
            'body.ally-high-contrast * { background-color: inherit !important; color: inherit !important; border-color: #ff0 !important; }',
            'body.ally-high-contrast a { text-decoration: underline !important; color: #0ff !important; }',
            'body.ally-dyslexic { font-family: "Lexend", "OpenDyslexic", "Comic Sans MS", sans-serif !important; letter-spacing: 0.05em !important; word-spacing: 0.12em !important; line-height: 1.8 !important; }',
            'body.ally-dyslexic * { font-family: inherit !important; }',
            'body.ally-text-large { font-size: 118% !important; }',
            'body.ally-text-xlarge { font-size: 135% !important; }',
            '#ally-engine-toolbar { position: fixed; bottom: 20px; left: 20px; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
            '#ally-engine-toolbar .ally-fab { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(99,102,241,0.4); transition: transform 0.2s, box-shadow 0.2s; font-size: 22px; }',
            '#ally-engine-toolbar .ally-fab:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(99,102,241,0.5); }',
            '#ally-engine-toolbar .ally-panel { position: absolute; bottom: 64px; left: 0; width: 280px; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.14); padding: 20px; display: none; }',
            '#ally-engine-toolbar .ally-panel.open { display: block; }',
            'body.ally-high-contrast #ally-engine-toolbar .ally-panel { background: #111; border: 2px solid #ff0; }',
            '#ally-engine-toolbar .ally-panel h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; color: #1e293b; }',
            'body.ally-high-contrast #ally-engine-toolbar .ally-panel h3 { color: #ff0; }',
            '#ally-engine-toolbar .ally-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc; cursor: pointer; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px; transition: all 0.15s; }',
            '#ally-engine-toolbar .ally-btn:hover { border-color: #6366f1; background: #eef2ff; }',
            '#ally-engine-toolbar .ally-btn.active { border-color: #6366f1; background: #6366f1; color: #fff; }',
            'body.ally-high-contrast #ally-engine-toolbar .ally-btn { background: #222; color: #ff0; border-color: #ff0; }',
            'body.ally-high-contrast #ally-engine-toolbar .ally-btn.active { background: #ff0; color: #000; }',
            '#ally-engine-toolbar .ally-icon { font-size: 18px; width: 24px; text-align: center; }',
            '#ally-engine-toolbar .ally-credit { margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }',
            '#ally-engine-toolbar .ally-credit a { color: #6366f1; text-decoration: none; font-weight: 600; }'
        ].join('\n');

        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createToolbar() {
        var container = document.createElement('div');
        container.id = 'ally-engine-toolbar';

        var fab = document.createElement('button');
        fab.className = 'ally-fab';
        fab.innerHTML = '♿';
        fab.title = 'Accessibility Settings';
        fab.setAttribute('aria-label', 'Open Accessibility Settings');

        var panel = document.createElement('div');
        panel.className = 'ally-panel';
        panel.innerHTML = [
            '<h3>♿ Accessibility</h3>',
            '<button class="ally-btn" data-action="contrast"><span class="ally-icon">🔲</span> High Contrast</button>',
            '<button class="ally-btn" data-action="dyslexia"><span class="ally-icon">🔤</span> Dyslexia Font</button>',
            '<button class="ally-btn" data-action="text-large"><span class="ally-icon">🔍</span> Large Text</button>',
            '<button class="ally-btn" data-action="text-xlarge"><span class="ally-icon">🔎</span> Extra Large Text</button>',
            '<div class="ally-credit">Powered by <a href="https://ally-ability.com" target="_blank">Ally-Ability</a></div>'
        ].join('');

        fab.addEventListener('click', function () {
            panel.classList.toggle('open');
            logEvent('widget_opened');
        });

        // Handle button clicks
        panel.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            var action = btn.getAttribute('data-action');

            if (action === 'contrast') {
                state.highContrast = !state.highContrast;
                logEvent('toggle_contrast');
            } else if (action === 'dyslexia') {
                state.dyslexicFont = !state.dyslexicFont;
                logEvent('toggle_dyslexia');
            } else if (action === 'text-large') {
                state.textSize = state.textSize === 'large' ? 'normal' : 'large';
                logEvent('toggle_text_large');
            } else if (action === 'text-xlarge') {
                state.textSize = state.textSize === 'xlarge' ? 'normal' : 'xlarge';
                logEvent('toggle_text_xlarge');
            }

            applyState();
            updateButtons(panel);
        });

        container.appendChild(panel);
        container.appendChild(fab);
        document.body.appendChild(container);

        updateButtons(panel);
    }

    function updateButtons(panel) {
        var btns = panel.querySelectorAll('[data-action]');
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            var action = btn.getAttribute('data-action');
            var isActive = false;
            if (action === 'contrast') isActive = state.highContrast;
            else if (action === 'dyslexia') isActive = state.dyslexicFont;
            else if (action === 'text-large') isActive = state.textSize === 'large';
            else if (action === 'text-xlarge') isActive = state.textSize === 'xlarge';
            btn.classList.toggle('active', isActive);
        }
    }

    // Init
    function init() {
        injectStyles();

        if (apiKey) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', API_BASE + '/widget/validate?api_key=' + encodeURIComponent(apiKey), true);
            xhr.onload = function () {
                try {
                    var res = JSON.parse(xhr.responseText);
                    if (res.valid) {
                        partnerId = res.partner_id;
                        createToolbar();
                        applyState();
                        logEvent('widget_loaded');
                    } else {
                        console.warn('[Ally-Engine] Invalid API key');
                    }
                } catch (e) {
                    console.warn('[Ally-Engine] Validation failed');
                }
            };
            xhr.onerror = function () {
                // Still show widget in offline/dev mode
                createToolbar();
                applyState();
            };
            xhr.send();
        } else {
            // No API key — demo mode
            createToolbar();
            applyState();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
