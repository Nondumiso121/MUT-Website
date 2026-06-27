// ========== MOBILE/DESKTOP VIEW TOGGLE (UNIVERSAL) ==========
function toggleMobileView() {
    const isCurrentlyMobile = document.body.classList.contains('mobile-view-active');
    
    if (isCurrentlyMobile) {
        // Switch to DESKTOP mode
        document.body.classList.remove('mobile-view-active');
        localStorage.setItem('preferredView', 'desktop');
        
        // Update all toggle buttons on the page
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.innerHTML = '📱 Switch to Mobile View';
            btn.style.background = '#0055a5';
        });
        
        console.log('Switched to Desktop View');
    } else {
        // Switch to MOBILE mode
        document.body.classList.add('mobile-view-active');
        localStorage.setItem('preferredView', 'mobile');
        
        // Update all toggle buttons on the page
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.innerHTML = '💻 Switch to Desktop View';
            btn.style.background = '#28a745';
        });
        
        console.log('Switched to Mobile View');
    }
}

// Load saved view preference on page load
function loadViewPreference() {
    const savedView = localStorage.getItem('preferredView');
    
    if (savedView === 'mobile') {
        document.body.classList.add('mobile-view-active');
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.innerHTML = '💻 Switch to Desktop View';
            btn.style.background = '#28a745';
        });
    } else if (savedView === 'desktop') {
        document.body.classList.remove('mobile-view-active');
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.innerHTML = '📱 Switch to Mobile View';
            btn.style.background = '#0055a5';
        });
    } else {
        // Auto-detect based on screen width
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile-view-active');
            document.querySelectorAll('.view-toggle-btn').forEach(btn => {
                btn.innerHTML = '💻 Switch to Desktop View';
                btn.style.background = '#28a745';
            });
            localStorage.setItem('preferredView', 'mobile');
        }
    }
}

// ---------- MOBILE MENU TOGGLE ----------
function toggleMobileMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.getElementById('navLinks');
    const toggle = document.querySelector('.menu-toggle');
    if (nav && nav.classList.contains('active') && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('active');
    }
});

// ---------- FAQ ----------
function toggleFAQ() {
    const popup = document.getElementById('faqPopup');
    if (popup) {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }
}

// ---------- CHATBOT ----------
function addMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.innerText = message;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(userMsg) {
    let msg = userMsg.toLowerCase();

    if (msg.includes('apply') || msg.includes('cao')) return "Applications are done through the CAO system. Visit www.cao.ac.za for MUT applications.";
    if (msg.includes('bursary') || msg.includes('bursaries')) return "Check the Bursaries page for NSFAS, Merit Bursaries, Motsepe Foundation, and INSETA sponsorships.";
    if (msg.includes('requirements') || msg.includes('points')) return "Entry requirements differ per program: For Dip IT Extended: English L3, Maths L2 or Maths Lit L3. For Dip IT: Maths L3 or Maths Lit L5, English L3.";
    if (msg.includes('timetable')) return "Visit the Timetables page to see Year1, Year2 CN, Year3 CN & SD schedules.";
    if (msg.includes('event')) return "Upcoming events: Registration (Jan), Freshers Party (Feb), Tech Innovation Day (Mar), Career Fair (June), Hackathon (Aug), Graduation (Nov).";
    if (msg.includes('hello') || msg.includes('hi')) return "Hello! How can I assist you today?";
    if (msg.includes('contact') || msg.includes('email')) return "Email: ict@mut.ac.za | Phone: +27 31 123 45678";
    if (msg.includes('advanced diploma') || msg.includes('cyber')) return "Advanced Diploma in IT focuses on Cybersecurity, Ethical Hacking, Digital Forensics, and Risk Management.";
    if (msg.includes('diploma in it extended')) return "Dip IT Extended is a 4-year program covering programming, networking, and databases with foundational support.";
    if (msg.includes('software') || msg.includes('developer')) return "Software Development offers practical labs in Java, Python, and web development.";
    
    return "I can help with information about programs, applications, bursaries, events, timetables, and contact details. What would you like to know?";
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    if (!userInput) return;

    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    addMessage(getBotReply(message), 'bot');
    userInput.value = "";
}

// ---------- AUTH UI ----------
async function updateAuthUI() {
    if (typeof supabaseClient === "undefined") return;

    const { data: { user } } = await supabaseClient.auth.getUser();
    const authBtn = document.getElementById("authBtn");

    if (!authBtn) return;

    if (user) {
        authBtn.textContent = "Logout";
        authBtn.onclick = () => {
            if (typeof logout === 'function') logout();
        };
        authBtn.style.background = "#ff4d4d";
    } else {
        authBtn.textContent = "Login";
        authBtn.onclick = () => window.location.href = "login.html";
        authBtn.style.background = "#0055a5";
    }
}

// ---------- AUTO-ADD TOGGLE BUTTON TO ALL PAGES ----------
function ensureToggleButton() {
    // Check if toggle button already exists
    if (document.querySelector('.view-toggle-btn')) return;
    
    // Find the best location for the button (usually footer)
    let targetContainer = null;
    
    // Look for footer
    const footer = document.querySelector('footer');
    if (footer) {
        targetContainer = footer;
    } else {
        // If no footer, look for body
        targetContainer = document.body;
    }
    
    if (targetContainer) {
        // Check if there's a container for the toggle
        let toggleDiv = targetContainer.querySelector('.toggle-container');
        if (!toggleDiv) {
            toggleDiv = document.createElement('div');
            toggleDiv.className = 'toggle-container';
            toggleDiv.style.textAlign = 'center';
            toggleDiv.style.marginTop = '20px';
            toggleDiv.style.padding = '10px';
            targetContainer.appendChild(toggleDiv);
        }
        
        // Create the toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'view-toggle-btn';
        toggleBtn.onclick = toggleMobileView;
        
        // Set initial text based on current mode
        if (document.body.classList.contains('mobile-view-active')) {
            toggleBtn.innerHTML = '💻 Switch to Desktop View';
            toggleBtn.style.background = '#28a745';
        } else {
            toggleBtn.innerHTML = '📱 Switch to Mobile View';
            toggleBtn.style.background = '#0055a5';
        }
        
        toggleDiv.appendChild(toggleBtn);
    }
}

// ---------- MAIN INIT ----------
document.addEventListener("DOMContentLoaded", async () => {
    // Load saved view preference FIRST
    loadViewPreference();
    
    // Ensure toggle button exists on every page
    ensureToggleButton();

    const protectedPages = ["events.html", "timetables.html"];
    const currentPage = window.location.pathname.split("/").pop();

    // Protect only needed pages
    if (protectedPages.includes(currentPage)) {
        if (typeof checkUser === 'function') {
            await checkUser();
        }
    }

    // Update auth button
    updateAuthUI();

    // Close mobile menu when link clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                document.getElementById('navLinks')?.classList.remove('active');
            }
        });
    });

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            document.querySelectorAll('.faq-answer').forEach(ans => {
                if (ans !== answer) ans.style.display = 'none';
            });
            if (answer) {
                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Chatbot buttons
    const chatIcon = document.getElementById('chatbotIconBtn');
    const closeChat = document.getElementById('closeChatbotBtn');
    const chatbotBox = document.getElementById('chatbotBox');

    if (chatIcon && chatbotBox) {
        chatIcon.addEventListener('click', () => {
            chatbotBox.style.display = chatbotBox.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    if (closeChat && chatbotBox) {
        closeChat.addEventListener('click', () => {
            chatbotBox.style.display = 'none';
        });
    }

    const sendBtn = document.getElementById('sendMsgBtn');
    const userInput = document.getElementById('userInput');

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});