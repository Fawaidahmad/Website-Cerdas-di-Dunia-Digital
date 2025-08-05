// ========================================
// ENHANCED DIGITAL WISDOM WEBSITE SCRIPT
// ========================================

// Global Variables
let currentPage = 'home';
let gameQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let gameScore = 0;
let quizScore = 0;
let gameAnswered = false;
let quizAnswered = false;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupAccordion();
    setupGameData();
    setupQuizData();
    setupEventListeners();
    setupIntersectionObserver();
}

// ========================================
// NAVIGATION SYSTEM
// ========================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
            updateActiveNavLink(this);
        });
    });
}

function navigateToPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page with animation
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
            targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    currentPage = pageId;
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// ========================================
// ACCORDION FUNCTIONALITY
// ========================================
function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other accordions in the same container
            const parentAccordion = this.closest('.accordion');
            const allHeaders = parentAccordion.querySelectorAll('.accordion-header');
            const allPanels = parentAccordion.querySelectorAll('.accordion-panel');
            
            allHeaders.forEach(h => h.classList.remove('active'));
            allPanels.forEach(p => p.classList.remove('active'));
            
            // Toggle current accordion
            if (!isActive) {
                this.classList.add('active');
                panel.classList.add('active');
                
                // Add scroll to view with offset
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    });
}

// ========================================
// GAME DATA AND FUNCTIONALITY
// ========================================
function setupGameData() {
    gameQuestions = [
        {
            situation: "Temanmu mengirim foto yang memalukan tentang teman lain di grup chat. Apa yang kamu lakukan?",
            choices: [
                { text: "Ikut menertawakan foto tersebut", correct: false },
                { text: "Meminta temanmu untuk menghapus foto itu", correct: true },
                { text: "Menyimpan foto itu untuk dirimu sendiri", correct: false },
                { text: "Mengabaikannya saja", correct: false }
            ],
            explanation: "Meminta menghapus foto yang memalukan adalah tindakan yang benar untuk melindungi privasi teman."
        },
        {
            situation: "Kamu melihat berita heboh di media sosial tentang sekolahmu. Apa yang harus kamu lakukan?",
            choices: [
                { text: "Langsung membagikan ke semua temanmu", correct: false },
                { text: "Mengecek kebenaran berita dulu", correct: true },
                { text: "Menambahkan komentar pedas", correct: false },
                { text: "Membuat berita versi sendiri", correct: false }
            ],
            explanation: "Selalu cek kebenaran berita sebelum membagikannya untuk menghindari penyebaran hoaks."
        },
        {
            situation: "Seseorang di internet terus mengejek penampilanmu. Apa respons terbaik?",
            choices: [
                { text: "Membalas dengan ejekan yang lebih keras", correct: false },
                { text: "Blokir dan laporkan akun tersebut", correct: true },
                { text: "Menangis dan menutup semua akun media sosial", correct: false },
                { text: "Mengajak teman-teman untuk menyerang balik", correct: false }
            ],
            explanation: "Blokir dan laporkan adalah cara terbaik mengatasi cyberbullying tanpa memperburuk situasi."
        },
        {
            situation: "Temanmu meminta password media sosialmu untuk 'membantu' mengelola akun. Apa yang kamu lakukan?",
            choices: [
                { text: "Memberikan password karena dia teman baik", correct: false },
                { text: "Menolak dengan sopan dan menjelaskan pentingnya privasi", correct: true },
                { text: "Memberikan password tapi memintanya berjanji", correct: false },
                { text: "Mengubah password menjadi yang mudah ditebak", correct: false }
            ],
            explanation: "Password adalah rahasia pribadi. Tidak boleh dibagikan kepada siapa pun, termasuk teman dekat."
        },
        {
            situation: "Kamu melihat teman sekelasmu dibully di grup online. Apa yang sebaiknya kamu lakukan?",
            choices: [
                { text: "Ikut membully karena takut jadi target", correct: false },
                { text: "Membela temanmu dan melaporkan ke guru", correct: true },
                { text: "Keluar dari grup untuk menghindari masalah", correct: false },
                { text: "Menonton saja tanpa ikut campur", correct: false }
            ],
            explanation: "Menjadi upstander dengan membela korban dan melaporkan bullying adalah tindakan heroik yang benar."
        }
    ];
}

function setupGameEventListeners() {
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
}

function startGame() {
    currentQuestionIndex = 0;
    gameScore = 0;
    gameAnswered = false;
    
    const startBtn = document.getElementById('start-game-btn');
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    startBtn.classList.add('hidden');
    gameArea.classList.remove('hidden');
    gameResult.classList.add('hidden');
    
    displayGameQuestion();
}

function displayGameQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        showGameResult();
        return;
    }
    
    const question = gameQuestions[currentQuestionIndex];
    const situationEl = document.getElementById('game-situation');
    const choicesEl = document.getElementById('game-choices');
    
    situationEl.textContent = question.situation;
    choicesEl.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.addEventListener('click', () => handleGameAnswer(index));
        choicesEl.appendChild(button);
    });
    
    gameAnswered = false;
}

function handleGameAnswer(selectedIndex) {
    if (gameAnswered) return;
    
    gameAnswered = true;
    const question = gameQuestions[currentQuestionIndex];
    const choiceButtons = document.querySelectorAll('#game-choices .choice-btn');
    
    choiceButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === selectedIndex) {
            if (question.choices[index].correct) {
                btn.classList.add('correct');
                gameScore++;
                playSound('correct');
            } else {
                btn.classList.add('wrong');
                playSound('wrong');
            }
        }
        if (question.choices[index].correct && index !== selectedIndex) {
            btn.classList.add('correct');
        }
    });
    
    // Show explanation and next button
    setTimeout(() => {
        showGameExplanation(question.explanation);
    }, 1500);
}

function showGameExplanation(explanation) {
    const situationEl = document.getElementById('game-situation');
    situationEl.innerHTML = `
        <div style="background: linear-gradient(135deg, #e0f2fe, #bae6fd); padding: 1.5rem; border-radius: 15px; margin-top: 1rem;">
            <strong>Penjelasan:</strong><br>
            ${explanation}
        </div>
        <button class="btn" onclick="nextGameQuestion()" style="margin-top: 1.5rem;">
            ${currentQuestionIndex < gameQuestions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil'}
        </button>
    `;
}

function nextGameQuestion() {
    currentQuestionIndex++;
    displayGameQuestion();
}

function showGameResult() {
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    gameArea.classList.add('hidden');
    gameResult.classList.remove('hidden');
    
    const percentage = Math.round((gameScore / gameQuestions.length) * 100);
    let message, emoji;
    
    if (percentage >= 80) {
        message = "Luar biasa! Kamu sudah sangat paham tentang etika digital!";
        emoji = "🌟";
    } else if (percentage >= 60) {
        message = "Bagus! Terus belajar untuk menjadi lebih bijak di dunia digital!";
        emoji = "👍";
    } else {
        message = "Jangan menyerah! Baca lagi materi dan coba lagi ya!";
        emoji = "💪";
    }
    
    gameResult.innerHTML = `
        <h3>${emoji} Hasil Game</h3>
        <p>Skor: ${gameScore} dari ${gameQuestions.length} (${percentage}%)</p>
        <p>${message}</p>
        <button class="btn" onclick="restartGame()">Main Lagi</button>
        <button class="btn" onclick="navigateToPage('materi')" style="margin-left: 1rem; background: linear-gradient(135deg, #10b981, #34d399);">
            Pelajari Materi
        </button>
    `;
}

function restartGame() {
    const startBtn = document.getElementById('start-game-btn');
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    gameArea.classList.add('hidden');
    gameResult.classList.add('hidden');
    startBtn.classList.remove('hidden');
}

// ========================================
// QUIZ DATA AND FUNCTIONALITY
// ========================================
function setupQuizData() {
    quizQuestions = [
        {
            question: "Apa kepanjangan dari THINK sebelum posting di media sosial?",
            choices: [
                "True, Helpful, Inspiring, Necessary, Kind",
                "Think, Help, Inspire, Nice, Keep",
                "Time, Happy, Internet, New, Knowledge",
                "Trust, Hope, Include, Never, Kindness"
            ],
            correct: 0,
            explanation: "THINK adalah: True (Benar), Helpful (Membantu), Inspiring (Menginspirasi), Necessary (Penting), Kind (Baik)."
        },
        {
            question: "Apa yang sebaiknya kamu lakukan jika menerima pesan bullying di media sosial?",
            choices: [
                "Membalas dengan kata-kata yang lebih kasar",
                "Blokir dan laporkan akun pelaku",
                "Mengabaikan dan berharap akan berhenti sendiri",
                "Menangis dan menutup akun media sosial"
            ],
            correct: 1,
            explanation: "Blokir dan laporkan adalah cara terbaik mengatasi cyberbullying dengan aman dan efektif."
        },
        {
            question: "Informasi pribadi mana yang TIDAK boleh dibagikan di internet?",
            choices: [
                "Hobi dan minat",
                "Alamat rumah dan nomor telepon",
                "Makanan favorit",
                "Film yang disukai"
            ],
            correct: 1,
            explanation: "Alamat rumah dan nomor telepon adalah informasi pribadi yang bisa membahayakan keamananmu jika dibagikan."
        },
        {
            question: "Apa yang dimaksud dengan hoaks?",
            choices: [
                "Berita yang sangat menarik",
                "Informasi atau berita bohong yang disebarkan",
                "Berita yang memiliki banyak gambar",
                "Informasi yang dibagikan oleh influencer"
            ],
            correct: 1,
            explanation: "Hoaks adalah informasi atau berita bohong yang sengaja disebarkan untuk menyesatkan orang."
        },
        {
            question: "Sikap apa yang harus ditunjukkan saat melihat teman dibully?",
            choices: [
                "Ikut mem-bully agar tidak jadi target",
                "Menjadi upstander dan membela korban",
                "Mengabaikan karena bukan urusan kita",
                "Menertawakan karena itu lucu"
            ],
            correct: 1,
            explanation: "Menjadi upstander berarti berani membela korban bullying dan melaporkan kejadian tersebut."
        },
        {
            question: "Mengapa kita harus menghargai perbedaan di media sosial?",
            choices: [
                "Agar terlihat baik saja",
                "Karena perbedaan membuat dunia lebih berwarna dan kaya",
                "Supaya tidak dikucilkan",
                "Karena itu adalah aturan media sosial"
            ],
            correct: 1,
            explanation: "Menghargai perbedaan penting karena keberagaman membuat dunia lebih indah dan setiap orang berharga."
        }
    ];
}

function setupQuizEventListeners() {
    const startQuizBtn = document.getElementById('start-kuis-btn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    
    const startBtn = document.getElementById('start-kuis-btn');
    const quizArea = document.getElementById('kuis-area');
    const quizResult = document.getElementById('kuis-result');
    const feedback = document.getElementById('kuis-feedback');
    
    startBtn.classList.add('hidden');
    quizArea.classList.remove('hidden');
    quizResult.classList.add('hidden');
    feedback.innerHTML = '';
    
    displayQuizQuestion();
}

function displayQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    const questionEl = document.getElementById('kuis-question');
    const choicesEl = document.getElementById('kuis-choices');
    const feedback = document.getElementById('kuis-feedback');
    
    questionEl.innerHTML = `
        <strong>Pertanyaan ${currentQuestionIndex + 1} dari ${quizQuestions.length}</strong><br>
        ${question.question}
    `;
    
    choicesEl.innerHTML = '';
    feedback.innerHTML = '';
    
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice;
        button.addEventListener('click', () => handleQuizAnswer(index));
        choicesEl.appendChild(button);
    });
    
    quizAnswered = false;
}

function handleQuizAnswer(selectedIndex) {
    if (quizAnswered) return;
    
    quizAnswered = true;
    const question = quizQuestions[currentQuestionIndex];
    const choiceButtons = document.querySelectorAll('#kuis-choices .choice-btn');
    const feedback = document.getElementById('kuis-feedback');
    
    choiceButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === selectedIndex) {
            if (index === question.correct) {
                btn.classList.add('correct');
                quizScore++;
                feedback.innerHTML = `
                    <div class="feedback positive">
                        ✅ Benar! ${question.explanation}
                    </div>
                `;
                playSound('correct');
            } else {
                btn.classList.add('wrong');
                feedback.innerHTML = `
                    <div class="feedback negative">
                        ❌ Kurang tepat. ${question.explanation}
                    </div>
                `;
                playSound('wrong');
            }
        }
        if (index === question.correct && index !== selectedIndex) {
            btn.classList.add('correct');
        }
    });
    
    // Show next button after delay
    setTimeout(() => {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn';
        nextBtn.textContent = currentQuestionIndex < quizQuestions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil';
        nextBtn.style.marginTop = '1rem';
        nextBtn.addEventListener('click', nextQuizQuestion);
        feedback.appendChild(nextBtn);
    }, 2000);
}

function nextQuizQuestion() {
    currentQuestionIndex++;
    displayQuizQuestion();
}

function showQuizResult() {
    const quizArea = document.getElementById('kuis-area');
    const quizResult = document.getElementById('kuis-result');
    
    quizArea.classList.add('hidden');
    quizResult.classList.remove('hidden');
    
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    let message, emoji, advice;
    
    if (percentage >= 90) {
        message = "Sempurna! Kamu adalah pahlawan digital sejati!";
        emoji = "🏆";
        advice = "Terus bagikan pengetahuanmu kepada teman-teman!";
    } else if (percentage >= 75) {
        message = "Hebat! Kamu sudah sangat memahami etika digital!";
        emoji = "🌟";
        advice = "Sedikit lagi untuk menjadi pahlawan digital sempurna!";
    } else if (percentage >= 60) {
        message = "Bagus! Kamu sudah di jalan yang benar!";
        emoji = "👍";
        advice = "Pelajari lagi materi untuk meningkatkan pemahamanmu!";
    } else {
        message = "Jangan menyerah! Setiap pahlawan perlu latihan!";
        emoji = "💪";
        advice = "Baca materi dengan lebih teliti dan coba lagi!";
    }
    
    quizResult.innerHTML = `
        <div style="text-align: center;">
            <h3>${emoji} Hasil Kuis</h3>
            <div style="font-size: 3rem; margin: 1rem 0;">${percentage}%</div>
            <p><strong>Skor: ${quizScore} dari ${quizQuestions.length}</strong></p>
            <p style="font-size: 1.2rem; margin: 1rem 0;">${message}</p>
            <p style="color: var(--text-light);">${advice}</p>
            <div style="margin-top: 2rem;">
                <button class="btn" onclick="restartQuiz()">Coba Lagi</button>
                <button class="btn" onclick="navigateToPage('materi')" style="margin-left: 1rem; background: linear-gradient(135deg, #10b981, #34d399);">
                    Pelajari Materi
                </button>
            </div>
        </div>
    `;
    
    // Add confetti effect for high scores
    if (percentage >= 80) {
        createConfetti();
    }
}

function restartQuiz() {
    const startBtn = document.getElementById('start-kuis-btn');
    const quizArea = document.getElementById('kuis-area');
    const quizResult = document.getElementById('kuis-result');
    
    quizArea.classList.add('hidden');
    quizResult.classList.add('hidden');
    startBtn.classList.remove('hidden');
}

// ========================================
// SOUND EFFECTS
// ========================================
function playSound(type) {
    try {
        const audio = document.getElementById(type + '-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    } catch (error) {
        console.log('Sound effect not available:', error);
    }
}

// ========================================
// VISUAL EFFECTS
// ========================================
function createConfetti() {
    const colors = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation: confetti-fall 3s linear forwards;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation keyframes
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 3000);
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.materi-column, .accordion-item, .kuis-container');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Add animation keyframes
    if (!document.getElementById('scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================
function setupEventListeners() {
    setupGameEventListeners();
    setupQuizEventListeners();
    setupKeyboardNavigation();
    setupScrollToTop();
}

function setupGameEventListeners() {
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
}

function setupQuizEventListeners() {
    const startQuizBtn = document.getElementById('start-kuis-btn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Navigate pages with number keys
        if (e.key >= '1' && e.key <= '5') {
            const pages = ['home', 'materi', 'game', 'kuis', 'tentang'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                navigateToPage(pages[pageIndex]);
                updateActiveNavLink(document.querySelector(`[data-page="${pages[pageIndex]}"]`));
            }
        }
        
        // ESC to go back to home
        if (e.key === 'Escape') {
            navigateToPage('home');
            updateActiveNavLink(document.querySelector('[data-page="home"]'));
        }
    });
}

// ========================================
// SCROLL TO TOP FUNCTIONALITY
// ========================================
function setupScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could add user-friendly error messages here
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Lazy load images when they come into view
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// ACCESSIBILITY IMPROVEMENTS
// ========================================
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ========================================
// THEME SWITCHING (Optional Enhancement)
// ========================================
function setupThemeSwitch() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--card-bg);
        border: 2px solid var(--primary-color);
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1001;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-theme'));
    });
    
    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
}

// ========================================
// FINAL INITIALIZATION
// ========================================
// Additional setup after DOM is fully loaded
window.addEventListener('load', function() {
    setupLazyLoading();
    setupThemeSwitch();
    
    // Add loading complete class for any final animations
    document.body.classList.add('loaded');
    
    console.log('🚀 Cerdas di Dunia Digital - Website loaded successfully!');
});