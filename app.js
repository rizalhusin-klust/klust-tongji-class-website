// app.js - Core Logic, Video Sync, Local Storage, and AI Integration

// Global State
let currentLanguage = 'en';
let activeSessionId = 'session-1';
let completedSessions = [];
let localNotes = {}; // Format: { "session-1": [{ time: 10, text: "note", chapterName: "Intro" }] }
let qaThreads = [];
let coffeeBreakTimerId = null;

// DOM Elements
const videoEl = document.getElementById('classVideoPlayer');
const coffeeBreakOverlay = document.getElementById('coffeeBreakOverlay');
const breakCountdown = document.getElementById('breakCountdown');
const activeTimeBadge = document.getElementById('currentVideoTimestamp');
const noteInput = document.getElementById('noteInputField');
const qaTitleInput = document.getElementById('qaTitleInput');
const qaBodyInput = document.getElementById('qaBodyInput');


// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  // Load Local Storage values
  const storedLang = localStorage.getItem('klust_lang');
  if (storedLang) currentLanguage = storedLang;

  const storedCompleted = localStorage.getItem('klust_completed');
  if (storedCompleted) {
    completedSessions = JSON.parse(storedCompleted);
  } else {
    completedSessions = [];
    localStorage.setItem('klust_completed', JSON.stringify(completedSessions));
  }

  const storedNotes = localStorage.getItem('klust_notes');
  if (storedNotes) localNotes = JSON.parse(storedNotes);

  const storedQA = localStorage.getItem('klust_qa');
  if (storedQA) {
    qaThreads = JSON.parse(storedQA);
  } else {
    // Populate default seed Q&A threads
    qaThreads = getSeedQA();
    localStorage.setItem('klust_qa', JSON.stringify(qaThreads));
  }



  // Set initial layouts and bindings
  initLanguage();
  initCourseOutline();
  loadSession(activeSessionId);
  setupVideoListeners();
  
  // Render tabs initial state
  renderNotes();
  renderQA();
});

// Setup Video Listeners
function setupVideoListeners() {
  // Update timestamp badge in notebook tab during play
  videoEl.addEventListener('timeupdate', () => {
    const currTime = videoEl.currentTime;
    activeTimeBadge.textContent = formatTime(currTime);
    syncTranscriptHighlight(currTime);
  });

  // Track completion
  videoEl.addEventListener('ended', () => {
    markActiveSessionComplete();
  });
}

// Format seconds into MM:SS
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Format absolute date strings
function getRelativeTimeString(lang) {
  return lang === 'zh' ? '刚刚' : 'just now';
}

// -------------------------------------------------------------
// INTERNATIONALIZATION (i18n)
// -------------------------------------------------------------
function initLanguage() {
  updateLanguageUI();
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
  localStorage.setItem('klust_lang', currentLanguage);
  updateLanguageUI();
  
  // Re-render components that have text content
  initCourseOutline();
  const activeSession = courseData.sessions.find(s => s.id === activeSessionId);
  renderSessionInfo(activeSession);
  renderInstructors();
  renderResources(activeSession);
  renderTranscript(activeSession);
  renderNotes();
  renderQA();
}

function updateLanguageUI() {
  const dict = courseData.translations[currentLanguage];
  
  // Update all standard translation targets
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;

    // Check if placeholder should be translated instead
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.setAttribute('placeholder', dict[key]);
    } else {
      el.innerHTML = dict[key];
    }
  });
}

// -------------------------------------------------------------
// COURSE AGENDA & OUTLINE
// -------------------------------------------------------------
function initCourseOutline() {
  const container = document.getElementById('agendaItemsContainer');
  container.innerHTML = '';

  let completedCount = 0;
  courseData.sessions.forEach((session) => {
    const isCompleted = completedSessions.includes(session.id);
    const isActive = session.id === activeSessionId;
    if (isCompleted) completedCount++;

    const item = document.createElement('div');
    item.className = `agenda-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    item.onclick = () => selectSession(session.id);

    // Dynamic Title & Tag based on active language
    const title = currentLanguage === 'en' ? session.titleEn : session.titleZh;
    const durationText = formatTime(session.duration);
    
    let statusIcon = '<i class="fa-regular fa-circle"></i>';
    if (isCompleted) {
      statusIcon = '<i class="fa-solid fa-check"></i>';
    } else if (isActive) {
      statusIcon = '<i class="fa-solid fa-play"></i>';
    }

    item.innerHTML = `
      <button class="agenda-status-icon" title="${isCompleted ? 'Mark as incomplete' : 'Mark as completed'}">${statusIcon}</button>
      <div class="agenda-details">
        <span class="agenda-tag">${session.tag}</span>
        <span class="agenda-title">${title}</span>
        <div class="agenda-meta">
          <span><i class="fa-regular fa-clock"></i> <span class="agenda-duration">${durationText}</span></span>
        </div>
      </div>
    `;

    // Attach click listener to status button
    const btn = item.querySelector('.agenda-status-icon');
    btn.onclick = (e) => {
      e.stopPropagation(); // Avoid triggering session switch
      toggleSessionComplete(session.id);
    };

    container.appendChild(item);
  });

  // Calculate & Update Progress Bar
  const total = courseData.sessions.length;
  const percent = Math.round((completedCount / total) * 100);
  document.getElementById('courseProgressBar').style.width = `${percent}%`;
  document.getElementById('courseProgressText').textContent = `${percent}%`;
}

function toggleSessionComplete(id) {
  const index = completedSessions.indexOf(id);
  if (index > -1) {
    completedSessions.splice(index, 1);
  } else {
    completedSessions.push(id);
  }
  localStorage.setItem('klust_completed', JSON.stringify(completedSessions));
  initCourseOutline();
}

function selectSession(id) {
  activeSessionId = id;
  loadSession(id, true); // Trigger autoplay when user clicks outline
  initCourseOutline();
}

function loadSession(id, triggerPlay = false) {
  const session = courseData.sessions.find(s => s.id === id);
  if (!session) return;

  // Clear running countdown timers if any
  if (coffeeBreakTimerId) {
    clearInterval(coffeeBreakTimerId);
    coffeeBreakTimerId = null;
  }

  // Handle Video VS Break screen VS Google Drive Embeds
  let iframeEl = document.getElementById('classIframePlayer');
  
  if (session.videoUrl) {
    coffeeBreakOverlay.classList.add('hidden');
    
    // Check if URL is a Google Drive/Workspace video link
    const isDrive = session.videoUrl.includes('drive.google.com') || session.videoUrl.includes('docs.google.com');
    
    if (isDrive) {
      // Hide standard video player
      videoEl.classList.add('hidden');
      videoEl.pause();
      
      // Lazily create iframe player if not exists
      if (!iframeEl) {
        iframeEl = document.createElement('iframe');
        iframeEl.id = 'classIframePlayer';
        iframeEl.style.width = '100%';
        iframeEl.style.height = '100%';
        iframeEl.style.border = 'none';
        iframeEl.allow = 'autoplay; encrypted-media';
        iframeEl.setAttribute('allowfullscreen', 'true');
        videoEl.parentNode.insertBefore(iframeEl, videoEl);
      }
      
      iframeEl.classList.remove('hidden');
      
      // Extract Google Drive File ID and force universal preview URL format
      const idMatch = session.videoUrl.match(/\/d\/([a-zA-Z0-9_\-]+)/);
      let embedUrl = "";
      if (idMatch && idMatch[1]) {
        embedUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      } else {
        embedUrl = session.videoUrl.replace('/play', '/preview').replace('/view', '/preview');
      }
      
      // Add autoplay parameter if requested
      if (triggerPlay) {
        embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      
      iframeEl.src = embedUrl;
    } else {
      // Direct file / local file player
      if (iframeEl) {
        iframeEl.classList.add('hidden');
        iframeEl.src = '';
      }
      videoEl.classList.remove('hidden');
      videoEl.src = session.videoUrl;
      videoEl.load();
      videoEl.currentTime = 0;
      
      if (triggerPlay) {
        videoEl.play().catch(e => console.log("Autoplay prevented:", e));
      }
    }
  } else {
    // It's a Coffee Break!
    videoEl.classList.add('hidden');
    if (iframeEl) {
      iframeEl.classList.add('hidden');
      iframeEl.src = '';
    }
    coffeeBreakOverlay.classList.remove('hidden');
    startCoffeeBreakCountdown(session.duration);
  }

  // Render Session Meta Information
  renderSessionInfo(session);
  renderInstructors();
  renderResources(session);
  renderTranscript(session);
  renderNotes(); // Reload notes list for this session
}

function renderSessionInfo(session) {
  const title = currentLanguage === 'en' ? session.titleEn : session.titleZh;
  const durationText = formatTime(session.duration);
  const overview = currentLanguage === 'en' ? session.overviewEn : session.overviewZh;

  document.getElementById('sessionDetailTitle').textContent = title;
  document.getElementById('sessionDetailDuration').textContent = `${durationText}`;
  document.getElementById('sessionDetailTag').textContent = session.tag;
  document.getElementById('sessionDetailOverview').textContent = overview;
}

function renderInstructors() {
  const container = document.getElementById('facilitatorsList');
  container.innerHTML = '';

  courseData.instructors.forEach(inst => {
    const card = document.createElement('div');
    card.className = 'instructor-card';

    const role = currentLanguage === 'en' ? inst.roleEn : inst.roleZh;
    const bio = currentLanguage === 'en' ? inst.bioEn : inst.bioZh;

    // Support rendering images as avatar if reference ends in common image extension
    let avatarHtml = inst.avatar;
    if (inst.avatar.endsWith('.png') || inst.avatar.endsWith('.jpg') || inst.avatar.endsWith('.jpeg')) {
      avatarHtml = `<img src="${inst.avatar}" alt="${inst.name}">`;
    }

    card.innerHTML = `
      <div class="instructor-avatar">${avatarHtml}</div>
      <div class="instructor-info">
        <h4>${inst.name}</h4>
        <p style="color: var(--accent-brand); font-weight: 500; margin-bottom: 0.25rem;">${role}</p>
        <p style="color: var(--text-muted); font-size: 0.8rem; line-height: 1.4;">${bio}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderResources(session) {
  const container = document.getElementById('resourcesContainer');
  container.innerHTML = '';

  session.resources.forEach(res => {
    const card = document.createElement('a');
    card.className = 'resource-card';
    card.href = res.url;
    card.target = '_blank';

    let icon = '<i class="fa-solid fa-link"></i>';
    if (res.type === 'pdf') {
      icon = '<i class="fa-solid fa-file-pdf"></i>';
    } else if (res.type === 'file') {
      icon = '<i class="fa-solid fa-file-arrow-down"></i>';
    }

    card.innerHTML = `
      <div class="resource-icon">${icon}</div>
      <div class="resource-info">
        <h4>${res.name}</h4>
        <p data-i18n="unlocked">Unlocked reference material</p>
      </div>
    `;
    container.appendChild(card);
  });
  updateLanguageUI();
}

function startCoffeeBreakCountdown(duration) {
  let remaining = duration;
  breakCountdown.textContent = formatTime(remaining);

  coffeeBreakTimerId = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(coffeeBreakTimerId);
      breakCountdown.textContent = "00:00";
      markActiveSessionComplete();
    } else {
      breakCountdown.textContent = formatTime(remaining);
    }
  }, 1000);
}

function markActiveSessionComplete() {
  if (!completedSessions.includes(activeSessionId)) {
    completedSessions.push(activeSessionId);
    localStorage.setItem('klust_completed', JSON.stringify(completedSessions));
    initCourseOutline(); // Redraw outline
    
    // Auto-advance to next session if exists
    const currIndex = courseData.sessions.findIndex(s => s.id === activeSessionId);
    if (currIndex < courseData.sessions.length - 1) {
      setTimeout(() => {
        selectSession(courseData.sessions[currIndex + 1].id);
      }, 1500);
    }
  }
}

// -------------------------------------------------------------
// INTERACTIVE TRANSCRIPT
// -------------------------------------------------------------
function renderTranscript(session) {
  const container = document.getElementById('transcriptContainer');
  container.innerHTML = '';

  if (!session.transcript || session.transcript.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 2rem;" data-i18n="no_transcript">No transcript available for this segment.</div>`;
    updateLanguageUI();
    return;
  }

  session.transcript.forEach((line, index) => {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'transcript-line';
    lineDiv.id = `tline-${index}`;
    lineDiv.dataset.time = line.time;
    lineDiv.onclick = () => {
      seekVideoTo(line.time);
    };

    const text = currentLanguage === 'en' ? line.textEn : line.textZh;

    lineDiv.innerHTML = `
      <div class="transcript-time">${formatTime(line.time)}</div>
      <div class="transcript-text">${text}</div>
    `;
    container.appendChild(lineDiv);
  });
}

function syncTranscriptHighlight(currentTime) {
  const lines = document.querySelectorAll('.transcript-line');
  if (lines.length === 0) return;

  let activeIndex = -1;
  
  // Find which line corresponds to the current playback time
  for (let i = 0; i < lines.length; i++) {
    const lineTime = parseFloat(lines[i].dataset.time);
    const nextLineTime = i < lines.length - 1 ? parseFloat(lines[i+1].dataset.time) : Infinity;

    if (currentTime >= lineTime && currentTime < nextLineTime) {
      activeIndex = i;
      break;
    }
  }

  if (activeIndex !== -1) {
    // Remove active state from all lines
    lines.forEach(line => line.classList.remove('active'));
    
    // Highlight current line
    const activeLine = document.getElementById(`tline-${activeIndex}`);
    if (activeLine && !activeLine.classList.contains('active')) {
      activeLine.classList.add('active');
      
      // Auto-scroll inside container smoothly
      const container = document.getElementById('transcriptContainer');
      const offsetTop = activeLine.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeLine.clientHeight / 2);
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// -------------------------------------------------------------
// SMART NOTEBOOK
// -------------------------------------------------------------
function handleNoteInputKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    saveNote();
  }
}

function saveNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const currentSession = courseData.sessions.find(s => s.id === activeSessionId);
  const sessionTitle = currentLanguage === 'en' ? currentSession.titleEn : currentSession.titleZh;

  const timestamp = videoEl.currentTime || 0;

  if (!localNotes[activeSessionId]) {
    localNotes[activeSessionId] = [];
  }

  localNotes[activeSessionId].push({
    time: timestamp,
    text: text,
    chapterName: sessionTitle
  });

  // Sort notes by timestamp
  localNotes[activeSessionId].sort((a, b) => a.time - b.time);

  localStorage.setItem('klust_notes', JSON.stringify(localNotes));
  noteInput.value = ''; // Clear textarea
  renderNotes();
}

function deleteNote(sessionId, noteIndex) {
  if (localNotes[sessionId]) {
    localNotes[sessionId].splice(noteIndex, 1);
    if (localNotes[sessionId].length === 0) {
      delete localNotes[sessionId];
    }
    localStorage.setItem('klust_notes', JSON.stringify(localNotes));
    renderNotes();
  }
}

function seekVideoTo(time) {
  if (videoEl.classList.contains('hidden')) {
    alert(currentLanguage === 'en'
      ? "Interactive playback control is not supported for external Google Drive players. For full features like transcript syncing & note timestamps, please download the video and place it in the local project's 'videos/' directory."
      : "外部 Google Drive 播放器不支持交互式播放控制。若要启用完整字幕同步与笔记时间戳，请下载视频并保存至本地项目的 'videos/' 文件夹。");
    return;
  }
  videoEl.currentTime = parseFloat(time);
  videoEl.play();
}

function renderNotes() {
  const container = document.getElementById('notesListContainer');
  container.innerHTML = '';

  const sessionNotes = localNotes[activeSessionId] || [];

  if (sessionNotes.length === 0) {
    container.innerHTML = `
      <div class="notes-placeholder">
        <i class="fa-solid fa-pen-fancy"></i>
        <p data-i18n="no_notes">No notes taken yet. Type in the box above to add a timestamped note.</p>
      </div>
    `;
    updateLanguageUI();
    return;
  }

  sessionNotes.forEach((note, index) => {
    const card = document.createElement('div');
    card.className = 'note-card';

    card.innerHTML = `
      <div class="note-content-area">
        <div class="note-header">
          <a class="note-time-link" onclick="seekVideoTo(${note.time})">
            <i class="fa-solid fa-circle-play"></i> ${formatTime(note.time)}
          </a>
          <span class="note-chapter-name">${note.chapterName}</span>
        </div>
        <div class="note-text">${escapeHtml(note.text)}</div>
      </div>
      <button class="note-delete-btn" onclick="deleteNote('${activeSessionId}', ${index})" title="Delete note">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    container.appendChild(card);
  });
}

function exportNotes() {
  let markdown = `# KLUST-Tongji Masterclass Notes\n\n`;
  let hasNotes = false;

  courseData.sessions.forEach(session => {
    const notes = localNotes[session.id] || [];
    if (notes.length > 0) {
      hasNotes = true;
      const title = currentLanguage === 'en' ? session.titleEn : session.titleZh;
      markdown += `## ${session.tag}: ${title}\n\n`;
      notes.forEach(note => {
        markdown += `- **[${formatTime(note.time)}]** ${note.text}\n`;
      });
      markdown += `\n`;
    }
  });

  if (!hasNotes) {
    alert(currentLanguage === 'en' ? "You have not taken any notes yet." : "您尚未记录任何笔记。");
    return;
  }

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'KLUST_Pedagogy_Notes.md');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// -------------------------------------------------------------
// INTERACTIVE Q&A FORUM
// -------------------------------------------------------------
function getSeedQA() {
  return [
    {
      id: "qa-1",
      title: "NotebookLM source upload size limits",
      body: "Does anybody know the maximum file limit for NotebookLM source uploads? I tried to upload a large PDF textbook and it gave an error.",
      user: "Zhang Wei (Postgrad)",
      time: "2 hours ago",
      upvotes: 3,
      replies: [
        {
          user: "Rizal Husin (Facilitator)",
          time: "1 hour ago",
          body: "NotebookLM currently supports up to 50 sources per notebook, and each source can be up to 500,000 words. If you have a massive textbook, I recommend splitting it into chapters or compression before uploading."
        }
      ]
    },
    {
      id: "qa-2",
      title: "Best prompt framework for Socratic tutors",
      body: "How do I prompt my Gem to prevent it from giving direct math answers? It always starts explaining the code/steps directly instead of guiding the student.",
      user: "Alex Lim",
      time: "4 hours ago",
      upvotes: 5,
      replies: [
        {
          user: "Li Na",
          time: "3 hours ago",
          body: "Try placing a system constraint like: 'Under no circumstances output the final numerical answer. If the student asks for it, reply with a hint pointing to the next step.'"
        }
      ]
    }
  ];
}

function postQuestion() {
  const title = qaTitleInput.value.trim();
  const body = qaBodyInput.value.trim();
  
  if (!title || !body) {
    alert(currentLanguage === 'en' ? "Please fill in both title and body." : "请填写真实的主题和内容。");
    return;
  }

  const newQuestion = {
    id: `qa-${Date.now()}`,
    title: title,
    body: body,
    user: currentLanguage === 'en' ? "You (Student)" : "您 (学生)",
    time: getRelativeTimeString(currentLanguage),
    upvotes: 0,
    replies: []
  };

  qaThreads.unshift(newQuestion);
  localStorage.setItem('klust_qa', JSON.stringify(qaThreads));
  
  qaTitleInput.value = '';
  qaBodyInput.value = '';
  renderQA();
}

function postReply(questionId) {
  const replyInput = document.getElementById(`reply-input-${questionId}`);
  const text = replyInput.value.trim();
  if (!text) return;

  const thread = qaThreads.find(q => q.id === questionId);
  if (thread) {
    thread.replies.push({
      user: currentLanguage === 'en' ? "You (Student)" : "您 (学生)",
      time: getRelativeTimeString(currentLanguage),
      body: text
    });
    localStorage.setItem('klust_qa', JSON.stringify(qaThreads));
    renderQA();
  }
}

function upvoteQuestion(questionId, e) {
  e.stopPropagation();
  const thread = qaThreads.find(q => q.id === questionId);
  if (thread) {
    thread.upvotes++;
    localStorage.setItem('klust_qa', JSON.stringify(qaThreads));
    renderQA();
  }
}

function renderQA() {
  const container = document.getElementById('qaListContainer');
  container.innerHTML = '';

  if (qaThreads.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); padding: 2rem;" data-i18n="no_questions">
        No questions asked yet. Be the first to start a thread!
      </div>
    `;
    updateLanguageUI();
    return;
  }

  const btnReplyText = currentLanguage === 'en' ? 'Reply' : '回复';
  const replyPlaceholder = currentLanguage === 'en' ? 'Write a reply...' : '编写回复...';

  qaThreads.forEach(q => {
    const card = document.createElement('div');
    card.className = 'qa-card';

    let repliesHtml = '';
    q.replies.forEach(r => {
      repliesHtml += `
        <div class="qa-reply">
          <div class="qa-reply-header">
            <span class="qa-reply-user">${r.user}</span>
            <span>${r.time}</span>
          </div>
          <div class="qa-reply-body">${escapeHtml(r.body)}</div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="qa-card-header">
        <div class="qa-user">
          <div class="qa-user-avatar">${q.user.charAt(0)}</div>
          <div>
            <span class="qa-user-name">${q.user}</span>
            <span class="qa-time" style="margin-left: 0.5rem;">${q.time}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="upvoteQuestion('${q.id}', event)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
          <i class="fa-solid fa-thumbs-up text-indigo-400"></i> ${q.upvotes}
        </button>
      </div>
      <div class="qa-title">${escapeHtml(q.title)}</div>
      <div class="qa-body">${escapeHtml(q.body)}</div>
      
      <div class="qa-replies">
        ${repliesHtml}
      </div>

      <div class="qa-reply-form">
        <input type="text" id="reply-input-${q.id}" placeholder="${replyPlaceholder}">
        <button class="btn btn-primary" onclick="postReply('${q.id}')">${btnReplyText}</button>
      </div>
    `;
    container.appendChild(card);
  });
}



// -------------------------------------------------------------
// TABS HANDLING
// -------------------------------------------------------------
function switchTab(event, panelId) {
  // Deactivate all tab buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  // Activate clicked button
  event.currentTarget.classList.add('active');
  event.currentTarget.setAttribute('aria-selected', 'true');

  // Hide all panels
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(panel => panel.classList.remove('active'));

  // Show target panel
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Perform tab-specific initializations
  if (panelId === 'panel-notebook') {
    renderNotes();
  } else if (panelId === 'panel-qa') {
    renderQA();
  }
}



// Helper to escape HTML and prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
