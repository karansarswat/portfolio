document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Handle theme toggle
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const chatBotToggle = document.getElementById('chatBotToggle');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Check if all elements exist
    if (!chatBotToggle || !chatBox || !closeChat || !sendMessage || !userInput || !chatMessages) {
        console.error('Some chat elements are missing');
        return;
    }

    // Toggle chat box
    chatBotToggle.addEventListener('click', () => {
        chatBox.classList.add('active');
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });

    // Send message function
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `
            <i class="${isUser ? 'fas fa-user' : 'fas fa-robot'}"></i>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle send message
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            userInput.value = '';
            
            // Get bot response
            handleBotResponse(message);
        }
    }

    sendMessage.addEventListener('click', () => {
        console.log('Send button clicked');
        handleSendMessage();
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            handleSendMessage();
        }
    });

    // Mobile Navigation
    const navToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-list');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

    function toggleMenu() {
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Chat suggestions
    const suggestions = document.querySelectorAll('.suggestion-btn');
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.textContent;
            addMessage(message, true);
            handleBotResponse(message);
        });
    });

    // Enhanced bot response
    const botResponses = {
        english: {
            greeting: "Hello! I'm Karan Saraswat's AI assistant. How can I help you today?",
            help: "I can help you learn more about Karan's web development skills, projects, and experience. What would you like to know?",
            services: "Karan offers web development, UI/UX design, and technical consulting services. He specializes in creating responsive and modern websites. Would you like to know more about any specific service?",
            experience: "Karan has extensive experience in HTML, CSS, JavaScript, and modern web frameworks. He's worked on various projects including the Aquafin International School website and Netflix UI clone.",
            default: "I'm Karan's AI assistant. I can tell you about his work, skills, or help you get in touch with him!"
        },
        hindi: {
            greeting: "नमस्ते! मैं करण सारस्वत का AI सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
            help: "मैं आपको करण के वेब डेवलपमेंट कौशल, प्रोजेक्ट्स और अनुभव के बारे में बता सकता हूं। आप क्या जानना चाहेंगे?",
            services: "करण वेब डेवलपमेंट, UI/UX डिजाइन और तकनीकी परामर्श सेवाएं प्रदान करते हैं। क्या आप किसी विशेष सेवा के बारे में और जानना चाहेंगे?",
            experience: "करण को HTML, CSS, JavaScript और आधुनिक वेब फ्रेमवर्क में व्यापक अनुभव है। उन्होंने एक्वाफिन इंटरनेशनल स्कूल वेबसाइट और नेटफ्लिक्स UI क्लोन जैसे विभिन्न प्रोजेक्ट्स पर काम किया है।",
            default: "मैं करण का AI सहायक हूं। मैं आपको उनके काम, कौशल के बारे में बता सकता हूं या उनसे संपर्क करने में मदद कर सकता हूं!"
        },
        spanish: {
            greeting: "¡Hola! Soy el asistente AI de Karan Saraswat. ¿Cómo puedo ayudarte hoy?",
            help: "Puedo informarte sobre las habilidades de desarrollo web de Karan, sus proyectos y experiencia. ¿Qué te gustaría saber?",
            services: "Karan ofrece servicios de desarrollo web, diseño UI/UX y consultoría técnica. ¿Te gustaría saber más sobre algún servicio específico?",
            experience: "Karan tiene amplia experiencia en HTML, CSS, JavaScript y frameworks web modernos. Ha trabajado en varios proyectos, incluyendo el sitio web de Aquafin International School y el clon de UI de Netflix.",
            default: "¡Soy el asistente AI de Karan! Puedo contarte sobre su trabajo, habilidades o ayudarte a contactar con él."
        }
    };

    function handleBotResponse(userMessage) {
        try {
            // Show typing indicator
            const typingMessage = document.createElement('div');
            typingMessage.className = 'message bot typing';
            typingMessage.innerHTML = `
                <i class="fas fa-robot"></i>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Generate response based on keywords
            let response;
            const message = userMessage.toLowerCase();

            if (message.includes('help')) {
                response = "I can help you with information about Karan's web development skills, projects, and experience. What would you like to know?";
            } else if (message.includes('services')) {
                response = "Karan offers web development, UI/UX design, and technical consulting services. Would you like to know more about any specific service?";
            } else if (message.includes('experience')) {
                response = "Karan has extensive experience in HTML, CSS, JavaScript, and modern web frameworks. He's worked on various projects including websites and web applications.";
            } else if (message.includes('contact')) {
                response = "You can contact Karan at:\nEmail: sarswatkaran037@gmail.com\nPhone: +91 8949595848";
            } else if (message.includes('hello') || message.includes('hi')) {
                response = "Hello! I'm Karan's AI assistant. How can I help you today?";
            } else {
                response = "I'm here to help! You can ask me about Karan's services, experience, or how to contact him.";
            }

            // Show response after a short delay
            setTimeout(() => {
                typingMessage.remove();
                
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message bot';
                messageDiv.innerHTML = `
                    <i class="fas fa-robot"></i>
                    <div class="message-content">
                        <p>${response}</p>
                        <span class="message-time">Just now</span>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);

        } catch (error) {
            console.error('Error in handleBotResponse:', error);
        }
    }

    // Update the chat suggestions to be multilingual
    const chatSuggestions = {
        english: [
            "Tell me about Karan's experience",
            "What services does Karan offer?",
            "How can I contact Karan?"
        ],
        hindi: [
            "करण के अनुभव के बारे में बताएं",
            "करण कौन सी सेवाएं प्रदान करते हैं?",
            "मैं करण से कैसे संपर्क कर सकता हूं?"
        ],
        spanish: [
            "Cuéntame sobre la experiencia de Karan",
            "¿Qué servicios ofrece Karan?",
            "¿Cómo puedo contactar a Karan?"
        ]
    };

    // Update the initial greeting
    document.querySelector('.message.bot p').textContent = botResponses.english.greeting;

    // Add language switcher buttons
    const languageSwitcher = `
        <div class="language-switcher">
            <button class="lang-btn" data-lang="english">EN</button>
            <button class="lang-btn" data-lang="hindi">हि</button>
            <button class="lang-btn" data-lang="spanish">ES</button>
        </div>
    `;

    // Insert language switcher after chat header
    document.querySelector('.chat-header').insertAdjacentHTML('afterend', languageSwitcher);

    // Add this CSS for language switcher
    const style = document.createElement('style');
    style.textContent = `
        .language-switcher {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 10px;
            background-color: var(--section-bg);
            border-bottom: 1px solid rgba(241, 182, 0, 0.2);
        }

        .lang-btn {
            padding: 5px 10px;
            border: 1px solid rgba(241, 182, 0, 0.3);
            border-radius: 5px;
            background: none;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--text-color);
        }

        .lang-btn:hover {
            background-color: #f1b600;
            color: white;
        }

        .lang-btn.active {
            background-color: #f1b600;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Add language switching functionality
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update suggestions
            const suggestionsContainer = document.querySelector('.chat-suggestions');
            suggestionsContainer.innerHTML = chatSuggestions[lang]
                .map(text => `<button class="suggestion-btn">${text}</button>`)
                .join('');
            
            // Add new greeting message
            chatMessages.innerHTML = `
                <div class="message bot">
                    <i class="fas fa-robot"></i>
                    <div class="message-content">
                        <p>${botResponses[lang].greeting}</p>
                        <span class="message-time">Just now</span>
                    </div>
                </div>
            `;
        });
    });

    let lastScrollPosition = window.pageYOffset;
    const chatBotContainer = document.querySelector('.chat-bot-container');

    // Hide chat bot initially if not at top
    if (window.pageYOffset > 100) {
        chatBotContainer.style.transform = 'translateY(150px)';
    }

    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        
        // Scrolling down
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
            chatBotContainer.style.transform = 'translateY(150px)';
            chatBotContainer.style.transition = 'transform 0.3s ease';
            
            // Also hide chat box if it's open
            chatBox.classList.remove('active');
        }
        // Scrolling up
        else {
            chatBotContainer.style.transform = 'translateY(0)';
            chatBotContainer.style.transition = 'transform 0.3s ease';
        }
        
        lastScrollPosition = currentScrollPosition;
    });

    let prevScrollPos = window.pageYOffset;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScrollPos = window.pageYOffset;
        
        // Scrolling down
        if (prevScrollPos < currentScrollPos) {
            navbar.style.transform = 'translateY(-100%)';
        }
        // Scrolling up
        else {
            navbar.style.transform = 'translateY(0)';
        }
        
        prevScrollPos = currentScrollPos;
    });

    // Mobile dropdown menu functionality
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = link.parentElement;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const statusDiv = document.querySelector('.form-status');
            const submitBtn = document.querySelector('.submit-btn');
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            fetch('process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                statusDiv.innerHTML = `
                    <div class="alert ${data.status}">
                        <i class="fas ${data.status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                        ${data.message}
                    </div>`;
                
                if (data.status === 'success') {
                    contactForm.reset();
                }
            })
            .catch(error => {
                statusDiv.innerHTML = `
                    <div class="alert error">
                        <i class="fas fa-exclamation-circle"></i>
                        Sorry, there was an error. Please try again or email directly.
                    </div>`;
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
                
                // Clear status message after 5 seconds if it was successful
                if (statusDiv.querySelector('.alert.success')) {
                    setTimeout(() => {
                        statusDiv.innerHTML = '';
                    }, 5000);
                }
            });
        });
    }

    document.getElementById('mobile-menu').addEventListener('click', function() {
        document.querySelector('.nav-list').classList.toggle('active');
    });
});