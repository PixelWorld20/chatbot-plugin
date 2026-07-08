(function () {
  'use strict';

  /* ── Config from WordPress ── */
  const CFG = window.PGAI_CONFIG || {};
  const COLOR   = CFG.primaryColor  || '#0066cc';
  const BOT     = CFG.botName       || 'Pixel Global AI';
  const HOLDER  = CFG.placeholder   || 'Ask about seo...';
  const WELCOME = CFG.welcomeMsg    || 'Namaste!';
  const POS     = CFG.position      || 'bottom-right';
  const MODE    = CFG.mode          || 'floating';
  const PROXY   = CFG.proxyUrl      || '';
  const NONCE   = CFG.nonce         || '';

  /* ── Build Chat HTML ── */
  function buildChatHTML(isInline) {
    return `
      <div class="pgai-chat-window-inner" style="display:flex;flex-direction:column;">
        <div class="pgai-header" style="background:${COLOR};">
          <div class="pgai-header-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div class="pgai-header-info">
            <div class="pgai-header-name">${escHtml(BOT)}</div>
            <div class="pgai-header-status">
              <span class="pgai-status-dot"></span> Online — Ready to help
            </div>
          </div>
          ${isInline ? '' : '<button class="pgai-header-close" id="pgai-close-btn" aria-label="Close chat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'}
        </div>

        <div class="pgai-messages" id="pgai-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

        <div class="pgai-input-area">
          <input
            type="text"
            id="pgai-input"
            placeholder="${escHtml(HOLDER)}"
            autocomplete="off"
            maxlength="500"
            aria-label="Type your message"
          />
          <button class="pgai-send-btn" id="pgai-send-btn" aria-label="Send message" style="background:${COLOR};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div class="pgai-footer">
          Powered by <a href="https://www.linkedin.com/in/abhishek-kumar-19aa47360/" target="_blank" rel="noopener">Pixel Global IT</a>
        </div>
      </div>
    `;
  }

  /* ── Escape HTML ── */
  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Format bot response (markdown-lite) ── */
  function formatResponse(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:13px;">$1</code>')
      .replace(/\n\n/g, '</p><p style="margin:6px 0;">')
      .replace(/\n/g, '<br>');
  }

  /* ── Add message to chat ── */
  function addMessage(role, text, messagesEl) {
    const avatarBg = role === 'bot' ? `background:${COLOR};` : '';
    const avatarTxt = role === 'bot'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`
      : '👤';

    const bubble = role === 'bot'
      ? `<div class="pgai-msg-bubble"><p style="margin:0;">${formatResponse(text)}</p></div>`
      : `<div class="pgai-msg-bubble" style="background:${COLOR};">${escHtml(text)}</div>`;

    const div = document.createElement('div');
    div.className = `pgai-msg ${role}`;
    div.innerHTML = `
      <div class="pgai-msg-avatar" style="${avatarBg}">${avatarTxt}</div>
      ${bubble}
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  /* ── Typing indicator ── */
  function showTyping(messagesEl) {
    const div = document.createElement('div');
    div.className = 'pgai-msg bot pgai-typing';
    div.innerHTML = `
      <div class="pgai-msg-avatar" style="background:${COLOR};">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      </div>
      <div class="pgai-msg-bubble">
        <span class="pgai-typing-dot"></span>
        <span class="pgai-typing-dot"></span>
        <span class="pgai-typing-dot"></span>
      </div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  /* ── Send message to WP proxy ── */
  async function sendMessage(message, messagesEl, inputEl, sendBtn) {
    if (!message.trim() || !PROXY) return;

    inputEl.value = '';
    sendBtn.disabled = true;

    addMessage('user', message, messagesEl);
    const typingEl = showTyping(messagesEl);

    try {
      const res = await fetch(PROXY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': NONCE,
        },
        body: JSON.stringify({ message }),
      });

      typingEl.remove();

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const reply = data.response || 'Koi response nahi mila.';
      addMessage('bot', reply, messagesEl);

    } catch (err) {
      typingEl.remove();
      addMessage('bot', '⚠️ Server is not connect.', messagesEl);
      console.error('[PGAI]', err);
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  /* ── Bind input events ── */
  function bindEvents(container, messagesEl) {
    const inputEl = container.querySelector('#pgai-input');
    const sendBtn = container.querySelector('#pgai-send-btn');

    sendBtn.addEventListener('click', () => {
      sendMessage(inputEl.value.trim(), messagesEl, inputEl, sendBtn);
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value.trim(), messagesEl, inputEl, sendBtn);
      }
    });
  }

  /* ── FLOATING MODE ── */
  function initFloating() {
    // Inject CSS color variable
    document.documentElement.style.setProperty('--pgai-color', COLOR);

    // Toggle button
    const btn = document.createElement('button');
    btn.id = 'pgai-toggle-btn';
    btn.className = `pgai-pos-${POS === 'bottom-left' ? 'left' : 'right'}`;
    btn.setAttribute('aria-label', 'Open Pixel Global AI Chat');
    btn.style.background = COLOR;
    btn.innerHTML = `
      <span id="pgai-badge"></span>
      <svg class="icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="icon-close" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" style="display:none;">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    document.body.appendChild(btn);

    // Chat window
    const win = document.createElement('div');
    win.id = 'pgai-chat-window';
    win.className = `pgai-pos-${POS === 'bottom-left' ? 'left' : 'right'}`;
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Chat with ' + BOT);
    win.innerHTML = buildChatHTML(false);
    document.body.appendChild(win);

    const messagesEl = win.querySelector('#pgai-messages');
    const closeBtn   = win.querySelector('#pgai-close-btn');

    // Welcome message
    addMessage('bot', WELCOME, messagesEl);

    // Show notification badge
    const badge = document.getElementById('pgai-badge');
    badge.style.display = 'flex';
    badge.textContent = '1';

    // Toggle open/close
    btn.addEventListener('click', () => {
      const isOpen = win.classList.contains('open');
      if (isOpen) {
        win.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-label', 'Open chat');
      } else {
        win.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-label', 'Close chat');
        badge.style.display = 'none';
        badge.textContent = '0';
        win.querySelector('#pgai-input')?.focus();
      }
    });

    if (closeBtn) {
      closeBtn.style.display = 'flex';
      closeBtn.addEventListener('click', () => {
        win.classList.remove('open');
        btn.classList.remove('open');
      });
    }

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && win.classList.contains('open')) {
        win.classList.remove('open');
        btn.classList.remove('open');
        btn.focus();
      }
    });

    bindEvents(win, messagesEl);
  }

  /* ── INLINE MODE ── */
  function initInline() {
    const container = document.getElementById('pgai-inline-widget');
    if (!container) return;

    document.documentElement.style.setProperty('--pgai-color', COLOR);
    container.innerHTML = buildChatHTML(true);

    const messagesEl = container.querySelector('#pgai-messages');
    addMessage('bot', WELCOME, messagesEl);
    bindEvents(container, messagesEl);
  }

  /* ── Init on DOM Ready ── */
  function init() {
    if (!PROXY) {
      console.warn('[PGAI] proxyUrl not set — chatbot will not load.');
      return;
    }
    if (MODE === 'inline') {
      initInline();
    } else {
      initFloating();
      // Also init inline if shortcode is present on same page
      if (document.getElementById('pgai-inline-widget')) initInline();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
