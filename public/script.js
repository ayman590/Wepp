document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    const uploadBtn = document.getElementById('upload-btn');

    let isDarkMode = true;
    let currentLang = 'ar';

    const translations = {
        ar: {
            logo: "مساعد الأكواد",
            placeholder: "اكتب رسالتك هنا...",
            langToggle: "EN",
            htmlLang: "ar",
            dir: "rtl"
        },
        en: {
            logo: "AI Code Assistant",
            placeholder: "Type your message here...",
            langToggle: "ع",
            htmlLang: "en",
            dir: "ltr"
        }
    };

    // --- LANGUAGE TOGGLE ---
    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        updateUIForLanguage();
    });

    function updateUIForLanguage() {
        const lang = translations[currentLang];
        document.documentElement.lang = lang.htmlLang;
        document.documentElement.dir = lang.dir;
        document.querySelector('.logo').textContent = lang.logo;
        messageInput.placeholder = lang.placeholder;
        languageToggle.textContent = lang.langToggle;
    }


    // --- THEME TOGGLE ---
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        isDarkMode = !isDarkMode;
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });

    // --- CHAT FORM SUBMISSION ---
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        // 1. Add user's message to chat
        addMessage(messageText, 'user');

        // 2. Clear input and reset height
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // 3. Scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // 4. Send message to backend and display response
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        })
        .then(response => response.json())
        .then(data => {
            displayAiResponse(data);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong.', 'ai');
        });
    });

    function displayAiResponse(response) {
        response.messages.forEach(msg => {
            if (msg.type === 'code') {
                addMessage(msg.content, 'ai', true);
            } else {
                addMessage(msg.content, 'ai');
            }
        });
        // Add the download button after the messages
        addMessageWithButton('Click here to download the project files.', 'ai', 'Download Project', () => {
            window.location.href = '/api/download';
        });
    }

    function addMessage(text, sender, isCode = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        if (isCode) {
            messageElement.innerHTML = `
                <div class="code-header">
                    <button class="copy-btn">Copy</button>
                </div>
                <pre><code>${text}</code></pre>
            `;
            // Add event listener for the new copy button
            messageElement.querySelector('.copy-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(text);
            });
        } else {
            messageElement.textContent = text;
        }

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addMessageWithButton(text, sender, buttonText, onClick) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const textElement = document.createElement('p');
        textElement.textContent = text;

        const buttonElement = document.createElement('button');
        buttonElement.textContent = buttonText;
        buttonElement.className = 'download-btn'; // Add a class for styling
        buttonElement.addEventListener('click', onClick);

        messageElement.appendChild(textElement);
        messageElement.appendChild(buttonElement);
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- Auto-resize textarea ---
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = `${messageInput.scrollHeight}px`;
    });

    // --- Set initial theme ---
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️'; // Sun icon for switching to light

    // --- UPLOAD BUTTON Functiionality (Mock) ---
    uploadBtn.addEventListener('click', () => {
        alert('File upload functionality is not implemented yet.');
    });
