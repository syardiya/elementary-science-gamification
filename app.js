// SOUND EFFECTS GENERATOR (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (type === 'click' || type === 'star') return; // Disable click and star sounds
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
            osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        } else if (type === 'star') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'wheel') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        }
    } catch (e) {
        console.log("AudioContext blocked or not supported yet.");
    }
}

let currentLevel = 1;
let earnedStars = 0;
let selectedAvatarId = '';
let selectedAvatarName = '';
let studentName = '';
let studentNo = '';
let studentClass = '4-A';
let isAttendanceChecked = false;

// Mini Game State
let selectedMiniGame = 'siram';
let waterClicks = 0;
let matchPairs = { source: '', benefit: '' };
let completedMatches = 0;
let correctMatches = {
    'matahari': 'fotosintesis',
    'air': 'pltu',
    'angin': 'turbin',
    'listrik': 'elektronik'
};

// Spin wheel state
let hasSpunWheel = false;

// Discussion Board State
let currentPemantikIndex = 1;
let pemantikAnswers = [];
let pemantikTimer;
let pemantikTimerValue = 30;
const questionsPemantikList = [
    "Mengapa kipas angin bisa berputar ketika dicolokkan ke listrik?",
    "Mengapa setrika listrik berubah menjadi sangat panas saat dipakai?",
    "Mengapa kita membutuhkan energi makanan setiap hari?"
];

// Quiz State
let currentQuizIndex = 0;
let quizScore = 0;
let selectedQuizAnswer = '';
const quizQuestions = [
    {
        question: "Sumber energi utama dan terbesar di planet Bumi adalah...",
        options: ["A. Batubara", "B. Minyak Bumi", "C. Angin", "D. Matahari"],
        answer: "D. Matahari"
    },
    {
        question: "Saat kipas angin digunakan, terjadi perubahan energi dari energi listrik menjadi energi...",
        options: ["A. Panas", "B. Gerak", "C. Bunyi", "D. Kimia"],
        answer: "B. Gerak"
    },
    {
        question: "Makanan yang dimakan manusia mengandung jenis energi...",
        options: ["A. Kimia", "B. Listrik", "C. Cahaya", "D. Bunyi"],
        answer: "A. Kimia"
    },
    {
        question: "Berikut ini cara menghemat energi di rumah yang benar adalah...",
        options: ["A. Menghidupkan lampu di siang hari", "B. Membiarkan air keran meluap", "C. Mematikan televisi bila tidak ditonton", "D. Menyeterika baju setiap jam"],
        answer: "C. Mematikan televisi bila tidak ditonton"
    },
    {
        question: "Pembangkit Listrik Tenaga Air (PLTA) memanfaatkan aliran air yang mengalir deras untuk memutar...",
        options: ["A. Panel Surya", "B. Kincir / Turbin", "C. Setrika", "D. Baterai"],
        answer: "B. Kincir / Turbin"
    }
];

let reflectEmotionSelected = 'senang';
let reflectStarsValue = 0;

const svgCircle = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>`;
const svgCheckCircle = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

window.onload = function () {
    lucide.createIcons();
    // loadSavedProgress();
    localStorage.removeItem('sahabat_ipa_progress_v1');
    updateAdventureMapNodes();

    // Attempt to autoplay and listen for first user interaction to start BGM
    playBGMOnInteraction();
    const startBGMOnAction = () => {
        playBGMOnInteraction();
        document.removeEventListener('click', startBGMOnAction);
        document.removeEventListener('touchstart', startBGMOnAction);
    };
    document.addEventListener('click', startBGMOnAction);
    document.addEventListener('touchstart', startBGMOnAction);
};

let bgmPlaying = false;
let wasBGMPlayingBeforeVideo = false;
function toggleBGM() {
    const bgMusic = document.getElementById('bg-music');
    const bgmIcon = document.getElementById('bgm-icon');
    if (!bgMusic || !bgmIcon) return;
    if (bgmPlaying) {
        bgMusic.pause();
        bgmIcon.setAttribute('data-lucide', 'volume-x');
        bgmPlaying = false;
    } else {
        bgMusic.play().then(() => {
            bgmIcon.setAttribute('data-lucide', 'volume-2');
            bgmPlaying = true;
        }).catch(e => {
            console.log("Autoplay blocked or URL error: ", e);
        });
    }
    lucide.createIcons();
}

function playBGMOnInteraction() {
    const bgMusic = document.getElementById('bg-music');
    const bgmIcon = document.getElementById('bgm-icon');
    if (bgMusic && !bgmPlaying) {
        bgMusic.play().then(() => {
            bgmPlaying = true;
            if (bgmIcon) {
                bgmIcon.setAttribute('data-lucide', 'volume-2');
                lucide.createIcons();
            }
        }).catch(e => {
            console.log("BGM play deferred: ", e);
        });
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeIcon.setAttribute('data-lucide', 'moon');
    } else {
        html.classList.add('dark');
        themeIcon.setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();
    playSound('click');
}

function saveProgress() {
    const state = {
        currentLevel,
        earnedStars,
        selectedAvatarId,
        selectedAvatarName,
        studentName,
        studentNo,
        studentClass,
        isAttendanceChecked,
        hasSpunWheel
    };
    localStorage.setItem('sahabat_ipa_progress_v1', JSON.stringify(state));
}

function loadSavedProgress() {
    try {
        const saved = localStorage.getItem('sahabat_ipa_progress_v1');
        if (saved) {
            const state = JSON.parse(saved);
            currentLevel = state.currentLevel || 1;
            earnedStars = state.earnedStars || 0;
            selectedAvatarId = state.selectedAvatarId || '';
            selectedAvatarName = state.selectedAvatarName || '';
            studentName = state.studentName || '';
            studentNo = state.studentNo || '';
            studentClass = state.studentClass || '4-A';
            isAttendanceChecked = state.isAttendanceChecked || false;
            hasSpunWheel = state.hasSpunWheel || false;

            updateGlobalStats();
        }
    } catch (e) {
        console.log("No progress loaded.");
    }
}

function updateGlobalStats() {
    document.getElementById('global-stars').innerText = earnedStars;
    document.getElementById('global-level').innerText = currentLevel;
}

// Update progress bar
function updateProgressBar(pageNumber) {
    const percentage = Math.round((pageNumber / 14) * 100);
    document.getElementById('main-progress-bar').style.width = percentage + '%';
    document.getElementById('progress-percentage').innerText = percentage;
}

function goToPage(pageNumber) {
    if (pageNumber !== 8) {
        playBGMOnInteraction();
    }
    playSound('click');

    // Pause BGM if entering Page 8 (Video Page)
    if (pageNumber === 8) {
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic && bgmPlaying) {
            wasBGMPlayingBeforeVideo = true;
            bgMusic.pause();
            bgmPlaying = false;
            const bgmIcon = document.getElementById('bgm-icon');
            if (bgmIcon) bgmIcon.setAttribute('data-lucide', 'volume-x');
            lucide.createIcons();
        }
    } else {
        // Resume BGM if leaving Page 8 and BGM was previously playing
        if (wasBGMPlayingBeforeVideo) {
            const bgMusic = document.getElementById('bg-music');
            if (bgMusic) {
                bgMusic.play().then(() => {
                    bgmPlaying = true;
                    const bgmIcon = document.getElementById('bgm-icon');
                    if (bgmIcon) bgmIcon.setAttribute('data-lucide', 'volume-2');
                    lucide.createIcons();
                }).catch(e => console.log("BGM resume deferred: ", e));
            }
            wasBGMPlayingBeforeVideo = false;
        }
    }

    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('flex');
    });

    const activeSection = document.getElementById('page-' + pageNumber);
    if (activeSection) {
        activeSection.classList.remove('hidden');
        activeSection.classList.add('flex');
    }

    updateProgressBar(pageNumber);

    if (pageNumber === 3) {
        updateAdventureMapNodes();
    } else if (pageNumber === 4) {
        setupMiniGame();
    } else if (pageNumber === 7) {
        startPemantikQuiz();
    } else if (pageNumber === 10) {
        loadQuizQuestion();
    }
}

// PAGE 1: Avatar Selection
function selectAvatar(id, name) {
    playBGMOnInteraction();
    playSound('star');
    selectedAvatarId = id;
    selectedAvatarName = name;

    document.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.classList.remove('border-brandBlue', 'border-brandYellow', 'border-brandGreen', 'border-brandOrange', 'bg-sky-50', 'dark:bg-sky-950/20');
        btn.classList.add('border-slate-200', 'dark:border-slate-700');
    });

    const feedback = document.getElementById('avatar-selection-feedback');
    feedback.classList.remove('hidden');
    document.getElementById('selected-avatar-name').innerText = name;

    document.getElementById('start-adventure-btn').removeAttribute('disabled');

    confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 }
    });
}

// PAGE 2: Absensi
function submitAttendance(event) {
    event.preventDefault();

    studentName = document.getElementById('student-name').value;
    studentNo = document.getElementById('student-number').value;
    studentClass = document.getElementById('student-class').value;
    isAttendanceChecked = true;

    stopCamera();
    addStars(1);
    playSound('success');

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    saveProgress();
    goToPage(3);
}

function addStars(num) {
    earnedStars += num;
    currentLevel = Math.floor(earnedStars / 5) + 1;
    updateGlobalStats();
}

// Camera Simulation
let streamReference = null;
function startCamera() {
    const video = document.getElementById('video-feed');
    const placeholder = document.getElementById('upload-placeholder');
    const btnCamera = document.getElementById('btn-camera');
    const btnSnap = document.getElementById('btn-snap');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            streamReference = stream;
            video.srcObject = stream;
            video.classList.remove('hidden');
            video.play();
            placeholder.classList.add('hidden');

            btnCamera.classList.add('hidden');
            btnSnap.classList.remove('hidden');
            btnSnap.classList.add('flex');
        })
        .catch(function (err) {
            video.classList.add('hidden');
            alert("Kamera tidak terdeteksi. Namun, kamu masih bisa mengunggah file foto atau melanjutkan!");
        });
}

function takeSnapshot() {
    const video = document.getElementById('video-feed');
    const canvas = document.getElementById('photo-canvas');
    const preview = document.getElementById('photo-preview');
    const sticker = document.getElementById('sticker-overlay');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    preview.src = dataUrl;
    preview.classList.remove('hidden');
    sticker.classList.remove('hidden');

    stopCamera();
    playSound('success');
}

function stopCamera() {
    if (streamReference) {
        streamReference.getTracks().forEach(track => track.stop());
        streamReference = null;
    }
    document.getElementById('video-feed').classList.add('hidden');
    document.getElementById('btn-camera').classList.remove('hidden');
    document.getElementById('btn-snap').classList.add('hidden');
}

function previewUploadedFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('photo-preview');
            const sticker = document.getElementById('sticker-overlay');
            const placeholder = document.getElementById('upload-placeholder');

            preview.src = e.target.result;
            preview.classList.remove('hidden');
            sticker.classList.remove('hidden');
            placeholder.classList.add('hidden');

            playSound('success');
        };
        reader.readAsDataURL(file);
    }
}

// PAGE 3: Adventure Map
function updateAdventureMapNodes() {
    const gameNode = document.getElementById('node-minigame');
    const wheelNode = document.getElementById('node-spinwheel');
    const apersepsiNode = document.getElementById('node-apersepsi');
    const videoNode = document.getElementById('node-video');
    const materiNode = document.getElementById('node-materi');
    const kuisNode = document.getElementById('node-kuis');
    const certNode = document.getElementById('node-sertifikat');

    if (isAttendanceChecked) {
        unlockNode(gameNode, 'Siap Main');
    }
    if (earnedStars >= 2) {
        unlockNode(wheelNode, 'Siap Putar');
    }
    if (earnedStars >= 5) {
        unlockNode(apersepsiNode, 'Siap Jawab');
    }
    if (earnedStars >= 6) {
        unlockNode(videoNode, 'Siap Tonton');
    }
    if (earnedStars >= 7) {
        unlockNode(materiNode, 'Eksplorasi');
    }
    if (earnedStars >= 8) {
        unlockNode(kuisNode, 'Tantangan');
    }
    if (earnedStars >= 13) {
        unlockNode(certNode, 'Klaim');
    }
}

function unlockNode(nodeElement, text) {
    if (!nodeElement) return;
    nodeElement.classList.remove('border-slate-300', 'dark:border-slate-700');
    nodeElement.classList.add('border-brandGreen');

    const iconBg = nodeElement.querySelector('.node-icon-bg');
    if (iconBg) {
        iconBg.classList.remove('bg-slate-300', 'text-slate-600');
        iconBg.classList.add('bg-brandGreen', 'text-white');
    }

    const status = nodeElement.querySelector('.node-status');
    if (status) {
        status.classList.remove('bg-slate-100', 'text-slate-500');
        status.classList.add('bg-brandGreen/10', 'text-brandGreen');
        status.innerText = text;
    }
}

function startNextQuest() {
    if (earnedStars < 2) {
        goToPage(4);
    } else if (!hasSpunWheel) {
        goToPage(5);
    } else if (earnedStars < 5) {
        goToPage(6);
    } else {
        goToPage(7);
    }
}

// PAGE 4: Mini Game
function setupMiniGame() {
    const randomSeed = Math.random() > 0.5;
    const gameSiram = document.getElementById('game-siram-tanaman');
    const gameJodohkan = document.getElementById('game-jodohkan-energi');
    const overlay = document.getElementById('game-success-overlay');

    overlay.classList.add('hidden');
    waterClicks = 0;
    completedMatches = 0;
    document.getElementById('water-progress').style.width = '0%';
    document.getElementById('water-click-count').innerText = '0';
    document.getElementById('match-score-text').innerText = '0';

    document.querySelectorAll('.matching-btn').forEach(btn => {
        btn.classList.remove('bg-brandGreen/20', 'border-brandGreen', 'opacity-50', 'pointer-events-none');
        btn.classList.add('bg-white', 'dark:bg-slate-800', 'border-slate-300');
    });

    if (randomSeed) {
        selectedMiniGame = 'siram';
        gameSiram.classList.remove('hidden');
        gameJodohkan.classList.add('hidden');
    } else {
        selectedMiniGame = 'jodohkan';
        gameSiram.classList.add('hidden');
        gameJodohkan.classList.remove('hidden');
    }
}

function pourWater() {
    waterClicks++;
    playSound('click');

    const percentage = (waterClicks / 5) * 100;
    document.getElementById('water-progress').style.width = percentage + '%';
    document.getElementById('water-click-count').innerText = waterClicks;

    const scale = 50 + (waterClicks * 10);
    const plantStage = document.getElementById('plant-stage');
    plantStage.style.transform = `scale(${scale / 100})`;

    const drops = document.getElementById('water-drops');
    drops.classList.remove('hidden');
    drops.classList.add('opacity-100');

    setTimeout(() => {
        drops.classList.add('hidden');
        drops.classList.remove('opacity-100');
    }, 500);

    if (waterClicks >= 5) {
        document.getElementById('flower-petals').classList.remove('opacity-0');
        document.getElementById('flower-petals').classList.add('opacity-100');

        setTimeout(() => {
            showGameSuccess();
        }, 800);
    }
}

function selectMatchingItem(type, itemId) {
    playSound('click');

    const btns = document.querySelectorAll(type === 'source' ? '[id^="match-src-"]' : '[id^="match-ben-"]');
    btns.forEach(btn => {
        if (!btn.classList.contains('bg-brandGreen/20')) {
            btn.classList.remove('border-brandBlue', 'border-brandOrange', 'border-brandGreen', 'border-brandYellow');
        }
    });

    const activeBtn = document.getElementById(type === 'source' ? `match-src-${itemId}` : `match-ben-${itemId}`);
    if (activeBtn) {
        activeBtn.classList.add('border-brandBlue');
    }

    matchPairs[type] = itemId;

    if (matchPairs.source && matchPairs.benefit) {
        checkCurrentMatch();
    }
}

function checkCurrentMatch() {
    const src = matchPairs.source;
    const ben = matchPairs.benefit;

    if (correctMatches[src] === ben) {
        playSound('success');

        const srcBtn = document.getElementById(`match-src-${src}`);
        const benBtn = document.getElementById(`match-ben-${ben}`);

        [srcBtn, benBtn].forEach(btn => {
            btn.classList.remove('border-brandBlue');
            btn.classList.add('bg-brandGreen/20', 'border-brandGreen', 'opacity-50', 'pointer-events-none');
        });

        completedMatches++;
        document.getElementById('match-score-text').innerText = completedMatches;

        if (completedMatches >= 4) {
            setTimeout(() => {
                showGameSuccess();
            }, 800);
        }
    } else {
        playSound('error');
        const srcBtn = document.getElementById(`match-src-${src}`);
        const benBtn = document.getElementById(`match-ben-${ben}`);
        if (srcBtn) srcBtn.classList.remove('border-brandBlue');
        if (benBtn) benBtn.classList.remove('border-brandBlue');
    }

    matchPairs.source = '';
    matchPairs.benefit = '';
}

function showGameSuccess() {
    playSound('success');
    document.getElementById('game-success-overlay').classList.remove('hidden');
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    setTimeout(() => {
        completeMiniGame();
    }, 2000);
}

function completeMiniGame() {
    addStars(2);
    saveProgress();
    goToPage(5);
}

// PAGE 5: SPIN THE WHEEL ENERGI
function spinTheWheel() {
    if (hasSpunWheel) return;
    playSound('click');

    const wheel = document.getElementById('spin-wheel-svg');
    const btn = document.getElementById('btn-spin-wheel');

    const randomRotationCount = 6 + Math.floor(Math.random() * 4);
    const targetSegment = Math.floor(Math.random() * 6);

    const targetDegree = (randomRotationCount * 360) - (targetSegment * 60) - 30;

    wheel.style.transform = `rotate(${targetDegree}deg)`;
    btn.setAttribute('disabled', 'true');

    let ticks = 0;
    const interval = setInterval(() => {
        playSound('wheel');
        ticks++;
        if (ticks > 28) clearInterval(interval);
    }, 150);

    setTimeout(() => {
        const results = [
            { title: "Dapat +1 Bintang! ⭐", desc: "Keberuntungan berpihak padamu, energimu bertambah kencang!", stars: 1 },
            { title: "Dapat +2 Bintang! ⭐⭐", desc: "Luar biasa! Tambahan energi bintang yang melimpah.", stars: 2 },
            { title: "Dapat +3 Bintang! ⭐⭐⭐", desc: "Super Beruntung! Kamu mendapatkan jackpot bintang hari ini!", stars: 3 },
            { title: "Pertanyaan Bonus! 🎯", desc: "Wah, bersiaplah untuk tantangan seru dari Ibu Guru.", stars: 0 },
            { title: "Tepuk Semangat! 👏", desc: "Mari lakukan Tepuk IPA: Tepuk-Tepuk IPA, Hebat!", stars: 0 },
            { title: "Tantangan Cepat! ⚡", desc: "Berdiri dan lakukan gerakan berputar seperti kincir angin 3 kali!", stars: 0 }
        ];

        const matchResult = results[targetSegment];
        document.getElementById('wheel-result-text').innerText = matchResult.title;
        document.getElementById('wheel-result-subtext').innerText = matchResult.desc;
        document.getElementById('wheel-result-box').classList.remove('hidden');

        if (matchResult.stars > 0) {
            addStars(matchResult.stars);
        }

        playSound('success');
        confetti({
            particleCount: 55,
            spread: 45
        });

        hasSpunWheel = true;
        saveProgress();

        setTimeout(() => {
            completeWheelQuest();
        }, 2500);
    }, 4500);
}

function completeWheelQuest() {
    goToPage(6);
}

// PAGE 7: APERSEPSI & DISCUSSION
function startPemantikQuiz() {
    currentPemantikIndex = 1;
    pemantikAnswers = [];
    showCurrentPemantikQuestion();
}

function showCurrentPemantikQuestion() {
    document.getElementById('pemantik-index-text').innerText = currentPemantikIndex;
    document.getElementById('pemantik-question').innerText = questionsPemantikList[currentPemantikIndex - 1];
    document.getElementById('pemantik-answer-input').value = '';

    clearInterval(pemantikTimer);
    pemantikTimerValue = 30;
    document.getElementById('pemantik-timer-text').innerText = pemantikTimerValue;

    pemantikTimer = setInterval(() => {
        pemantikTimerValue--;
        document.getElementById('pemantik-timer-text').innerText = pemantikTimerValue;
        if (pemantikTimerValue <= 0) {
            clearInterval(pemantikTimer);
            submitPemantikAnswer(true);
        }
    }, 1000);
}

function submitPemantikAnswer(isTimeout = false) {
    if (!isTimeout) {
        const input = document.getElementById('pemantik-answer-input').value.trim();
        if (input === '') {
            alert("Ayo tulis jawabanmu dulu, tidak boleh kosong! 😊");
            return;
        }
    }
    clearInterval(pemantikTimer);
    const input = document.getElementById('pemantik-answer-input').value.trim();
    const answerText = isTimeout ? "(Waktu habis - Belum menjawab)" : input;

    pemantikAnswers.push(answerText);

    const board = document.getElementById('sticky-notes-container');
    const randomRot = (Math.random() * 4 - 2).toFixed(1);
    const noteHtml = `
<div class="bg-yellow-200 dark:bg-amber-900/60 p-3 rounded-xl shadow-md border-l-4 border-brandOrange transform rotate-[${randomRot}deg] animate-bounce-slow">
  <p class="text-xs font-bold text-slate-800 dark:text-slate-100">"${answerText}"</p>
  <span class="block text-[9px] text-slate-500 dark:text-slate-400 mt-2 text-right font-bold">— ${studentName || "Petualang"} (Absen ${studentNo || "00"})</span>
</div>
`;
    board.insertAdjacentHTML('afterbegin', noteHtml);

    playSound('success');

    if (currentPemantikIndex < 3) {
        currentPemantikIndex++;
        setTimeout(() => {
            showCurrentPemantikQuestion();
        }, 1000);
    } else {
        addStars(1);
        confetti({
            particleCount: 50,
            spread: 60
        });
        setTimeout(() => {
            goToPage(8);
        }, 2000);
    }
}

// PAGE 8: VIDEO PEMBELAJARAN
function handleVideoEnded() {
    addStars(1);
    playSound('success');
    confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 }
    });
    setTimeout(() => {
        goToPage(9);
    }, 2000);
}

// PAGE 9: TAB MATERI
function switchMateriTab(tabIndex) {
    playSound('click');

    document.querySelectorAll('.materi-tab-btn').forEach(btn => {
        btn.className = "materi-tab-btn py-2.5 px-4 rounded-xl font-extrabold text-xs whitespace-nowrap border-2 bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 hover:border-brandGreen transition-all";
    });

    const activeBtn = document.getElementById('tab-materi-' + tabIndex);
    if (activeBtn) {
        activeBtn.className = "materi-tab-btn py-2.5 px-4 rounded-xl font-extrabold text-xs whitespace-nowrap border-2 bg-brandGreen text-white border-brandGreen transition-all";
    }

    document.querySelectorAll('.materi-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById('content-materi-' + tabIndex).classList.remove('hidden');
}

// PAGE 10: QUIZ
function loadQuizQuestion() {
    const q = quizQuestions[currentQuizIndex];
    document.getElementById('quiz-idx').innerText = currentQuizIndex + 1;
    document.getElementById('quiz-question-text').innerText = q.question;

    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = "quiz-opt-btn w-full text-left p-4 bg-white dark:bg-slate-800 hover:bg-brandOrange/5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm transition-all flex items-center justify-between";
        optionBtn.innerHTML = `<span>${opt}</span><span class="quiz-icon text-slate-400">${svgCircle}</span>`;
        optionBtn.onclick = () => selectQuizOption(optionBtn, opt);
        container.appendChild(optionBtn);
    });

    const fb = document.getElementById('quiz-feedback-box');
    fb.classList.add('hidden');

    document.getElementById('btn-next-quiz').setAttribute('disabled', 'true');

    lucide.createIcons();
}

function selectQuizOption(btn, textVal) {
    playSound('click');
    selectedQuizAnswer = textVal;

    document.querySelectorAll('.quiz-opt-btn').forEach(b => {
        b.className = "quiz-opt-btn w-full text-left p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm transition-all flex items-center justify-between";
        const iconSpan = b.querySelector('.quiz-icon');
        if (iconSpan) {
            iconSpan.className = "quiz-icon text-slate-400";
            iconSpan.innerHTML = svgCircle;
        }
    });

    btn.className = "quiz-opt-btn w-full text-left p-4 bg-brandOrange/10 dark:bg-brandOrange/20 rounded-2xl border-2 border-brandOrange font-bold text-sm transition-all flex items-center justify-between";
    const btnIconSpan = btn.querySelector('.quiz-icon');
    if (btnIconSpan) {
        btnIconSpan.className = "quiz-icon text-brandOrange";
        btnIconSpan.innerHTML = svgCheckCircle;
    }

    const correctAns = quizQuestions[currentQuizIndex].answer;
    const fb = document.getElementById('quiz-feedback-box');
    fb.classList.remove('hidden');

    if (selectedQuizAnswer === correctAns) {
        fb.className = "mt-4 p-4 rounded-xl text-center font-bold text-sm bg-brandGreen/15 text-brandGreen";
        fb.innerHTML = `⭐ Hebat! Jawabanmu Benar! +2 Bintang`;
        playSound('success');
        addStars(2);
        confetti({
            particleCount: 30,
            spread: 40
        });
        quizScore += 20;
    } else {
        fb.className = "mt-4 p-4 rounded-xl text-center font-bold text-sm bg-red-100 text-red-600";
        fb.innerHTML = `💡 Belum tepat. Jawabannya adalah: ${correctAns}. Yuk perhatikan lagi materi berikutnya!`;
        playSound('error');
    }

    document.querySelectorAll('.quiz-opt-btn').forEach(b => {
        b.setAttribute('disabled', 'true');
        b.classList.add('pointer-events-none');
    });

    document.getElementById('quiz-earned-stars').innerText = earnedStars;

    setTimeout(() => {
        nextQuizQuestion();
    }, 3000);
}

function nextQuizQuestion() {
    if (currentQuizIndex < quizQuestions.length - 1) {
        currentQuizIndex++;
        loadQuizQuestion();
    } else {
        evaluateFinalStats();
        goToPage(11);
    }
}

// PAGE 11: EVALUATION
function evaluateFinalStats() {
    const correctCount = quizScore / 20;
    const wrongCount = quizQuestions.length - correctCount;

    document.getElementById('result-student-name').innerText = studentName || "Petualang Hebat";
    document.getElementById('result-student-no').innerText = studentNo || "00";
    document.getElementById('result-student-class').innerText = `Kelas ${studentClass}`;
    document.getElementById('result-score').innerText = quizScore;

    const catBadge = document.getElementById('result-category-badge');
    if (quizScore >= 80) {
        catBadge.className = "text-xs font-bold text-brandGreen mt-1 uppercase tracking-wider";
        catBadge.innerText = "🏆 SANGAT BAIK";
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.5 }
        });
    } else if (quizScore >= 60) {
        catBadge.className = "text-xs font-bold text-brandYellow-dark mt-1 uppercase tracking-wider";
        catBadge.innerText = "🌟 BAIK";
    } else {
        catBadge.className = "text-xs font-bold text-brandOrange mt-1 uppercase tracking-wider";
        catBadge.innerText = "💪 TERUS SEMANGAT BELAJAR";
    }

    document.getElementById('result-correct-count').innerText = `${correctCount} Soal`;
    document.getElementById('result-wrong-count').innerText = `${wrongCount} Soal`;
    document.getElementById('result-stars').innerText = earnedStars;
    document.getElementById('result-level').innerText = currentLevel;

    const emojis = { bumi: '🌍', bintang: '⭐', bulan: '🌙', matahari: '☀️', roket: '🚀', saturnus: '🪐', petir: '⚡', robot: '🔬' };
    document.getElementById('result-avatar-display').innerText = emojis[selectedAvatarId] || '🌍';

    document.getElementById('cert-student-name').innerText = studentName || "Petualang Hebat";
    document.getElementById('cert-student-no').innerText = studentNo || "00";
    document.getElementById('cert-student-class').innerText = studentClass;
    document.getElementById('cert-score').innerText = quizScore;
    document.getElementById('cert-stars').innerText = earnedStars;
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('finish-stars').innerText = earnedStars;

    saveProgress();
}

// PAGE 12: PRINT CERTIFICATE
function printCertificate() {
    const printContents = document.getElementById('certificate-canvas').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
<div style="font-family: 'Fredoka', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; background: white;">
  ${printContents}
</div>
`;
    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
}

// PAGE 13: REFLECTION
function selectReflectEmotion(emoId) {
    playSound('click');
    reflectEmotionSelected = emoId;

    document.querySelectorAll('.reflect-emo-btn').forEach(btn => {
        btn.classList.remove('border-brandGreen', 'bg-brandGreen/15');
    });

    const activeBtn = document.getElementById('btn-emo-' + emoId);
    if (activeBtn) {
        activeBtn.classList.add('border-brandGreen', 'bg-brandGreen/15');
    }
}

function rateReflect(starsCount) {
    playSound('star');
    reflectStarsValue = starsCount;

    const btns = document.querySelectorAll('.reflect-star-btn');
    btns.forEach((btn, index) => {
        if (index < starsCount) {
            btn.classList.remove('text-slate-300');
            btn.classList.add('text-brandYellow');
        } else {
            btn.classList.remove('text-brandYellow');
            btn.classList.add('text-slate-300');
        }
    });

    const submitBtn = document.getElementById('btn-submit-reflection');
    if (submitBtn) {
        if (reflectStarsValue > 0) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'true');
        }
    }
}

function submitReflection() {
    playSound('success');
    confetti({
        particleCount: 100,
        spread: 70
    });
    goToPage(14);
}

function restartAdventure() {
    playSound('click');

    currentLevel = 1;
    earnedStars = 0;
    selectedAvatarId = '';
    selectedAvatarName = '';
    isAttendanceChecked = false;
    hasSpunWheel = false;
    currentQuizIndex = 0;
    quizScore = 0;

    // Reset reflection rating
    reflectStarsValue = 0;
    const submitBtn = document.getElementById('btn-submit-reflection');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');
    const btns = document.querySelectorAll('.reflect-star-btn');
    btns.forEach(btn => {
        btn.classList.remove('text-brandYellow');
        btn.classList.add('text-slate-300');
    });
    document.getElementById('reflect-new-thing').value = '';
    document.getElementById('reflect-teacher-msg').value = '';
    document.querySelectorAll('.reflect-emo-btn').forEach(btn => {
        btn.classList.remove('border-brandGreen', 'bg-brandGreen/15');
    });

    updateGlobalStats();

    document.getElementById('attendance-form').reset();
    document.getElementById('photo-preview').classList.add('hidden');
    document.getElementById('sticker-overlay').classList.add('hidden');
    document.getElementById('upload-placeholder').classList.remove('hidden');

    goToPage(1);
}
