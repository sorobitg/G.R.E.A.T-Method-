/* ===== app.js — G.R.E.A.T. Method Coaching Dashboard ===== */
(function () {
  'use strict';

  const STORAGE_KEY = 'great_method_data';

  // ── Stage definitions ──────────────────────────────────────────────────────
  const STAGES = [
    {
      id: 'goal',
      letter: 'G',
      icon: '🎯',
      title: 'Goal',
      subtitle: 'Define what you want to achieve',
      description:
        'Clarify your desired outcome. A well-formed goal is specific, meaningful, '
        + 'and describes a positive result — something you move *toward*, not away from.',
      textareaLabel: 'My Goal',
      placeholder: 'Describe your goal in clear, positive language…',
      prompts: [
        'What exactly do you want to achieve?',
        'How will you know when you have reached this goal?',
        'Why is this goal important to you right now?',
        'Is this goal in your control to achieve?',
      ],
    },
    {
      id: 'reality',
      letter: 'R',
      icon: '🔍',
      title: 'Reality',
      subtitle: 'Assess your current situation',
      description:
        'Explore what is happening right now — honestly and without judgment. '
        + 'Understanding the gap between where you are and where you want to be is the foundation of growth.',
      textareaLabel: 'Current Reality',
      placeholder: 'Describe your current situation objectively…',
      prompts: [
        'Where are you right now in relation to your goal?',
        'What resources, skills, or support do you already have?',
        'What obstacles or challenges are present?',
        'What have you tried so far, and what happened?',
      ],
    },
    {
      id: 'explore',
      letter: 'E',
      icon: '💡',
      title: 'Explore',
      subtitle: 'Generate options and possibilities',
      description:
        'Brainstorm all possible paths forward without filtering or judging. '
        + 'The more options you surface, the more empowered your eventual choices will be.',
      textareaLabel: 'Options & Ideas',
      placeholder: 'List every option you can think of — no idea is too bold or too small…',
      prompts: [
        'What could you do to move toward your goal?',
        'What would you do if you knew you could not fail?',
        'Who else has faced this challenge, and what did they do?',
        'What small step could you take today?',
      ],
    },
    {
      id: 'action',
      letter: 'A',
      icon: '🚀',
      title: 'Action',
      subtitle: 'Choose and commit to your next steps',
      description:
        'Select the most effective options from your exploration and turn them into '
        + 'concrete, committed action steps. Specificity drives accountability.',
      textareaLabel: 'My Action Plan',
      placeholder: 'List your specific, committed next steps…',
      prompts: [
        'Which options will you act on?',
        'What is your very first action, and when will you do it?',
        'What support or resources do you need?',
        'On a scale of 1–10, how committed are you to these actions?',
      ],
    },
    {
      id: 'track',
      letter: 'T',
      icon: '📈',
      title: 'Track',
      subtitle: 'Measure progress and stay accountable',
      description:
        'Define how you will monitor your progress, celebrate milestones, '
        + 'and adapt when things don\'t go as planned. Accountability keeps momentum alive.',
      textareaLabel: 'Progress & Accountability',
      placeholder: 'Describe how you will measure success and stay on track…',
      prompts: [
        'How and when will you review your progress?',
        'Who will hold you accountable?',
        'What milestones will you celebrate along the way?',
        'How will you handle setbacks or obstacles?',
      ],
    },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) { /* ignore */ }
    return { stages: {} };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function getStageData(id) {
    return state.stages[id] || { text: '', completed: false };
  }

  // ── Build DOM ──────────────────────────────────────────────────────────────
  function buildDashboard() {
    document.getElementById('dashboard-heading').textContent = 'Your Coaching Dashboard';
    document.getElementById('dashboard-subheading').textContent =
      'Progress through each stage of the G.R.E.A.T. Method™';

    buildStageBadges();
    buildStageCards();
    buildCelebration();
    renderAll();
  }

  function buildStageBadges() {
    const strip = document.getElementById('stage-strip');
    STAGES.forEach((s) => {
      const badge = document.createElement('div');
      badge.className = 'stage-badge';
      badge.id = `badge-${s.id}`;
      badge.setAttribute('role', 'button');
      badge.setAttribute('aria-label', `Go to ${s.title} stage`);
      badge.tabIndex = 0;
      badge.innerHTML = `
        <div class="circle">${s.icon}</div>
        <span class="label">${s.letter}</span>
      `;
      badge.addEventListener('click', () => scrollToCard(s.id));
      badge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') scrollToCard(s.id);
      });
      strip.appendChild(badge);
    });
  }

  function buildStageCards() {
    const main = document.getElementById('stages-container');
    STAGES.forEach((s, idx) => {
      const card = document.createElement('article');
      card.className = 'stage-card';
      card.id = `card-${s.id}`;
      card.setAttribute('aria-label', `${s.title} stage`);

      const promptsHtml = s.prompts
        .map((p) => `<li>${escHtml(p)}</li>`)
        .join('');

      card.innerHTML = `
        <div class="card-header" role="button" tabindex="0"
             aria-expanded="false" aria-controls="body-${s.id}">
          <span class="card-icon" aria-hidden="true">${s.icon}</span>
          <div class="card-title-block">
            <div class="card-letter">${s.letter} — Stage ${idx + 1} of ${STAGES.length}</div>
            <div class="card-title">${escHtml(s.title)}</div>
            <div class="card-subtitle">${escHtml(s.subtitle)}</div>
          </div>
          <span class="card-status" aria-hidden="true" id="status-${s.id}"></span>
          <span class="card-chevron" aria-hidden="true">▾</span>
        </div>
        <div class="card-body" id="body-${s.id}" role="region" aria-label="${escHtml(s.title)} details">
          <p class="card-description">${escHtml(s.description)}</p>
          <label class="card-textarea-label" for="textarea-${s.id}">${escHtml(s.textareaLabel)}</label>
          <textarea class="card-textarea" id="textarea-${s.id}"
                    placeholder="${escHtml(s.placeholder)}"
                    aria-label="${escHtml(s.textareaLabel)}"></textarea>
          <p class="card-textarea-label" style="margin-top:16px">Coaching Prompts</p>
          <ul class="prompts-list">${promptsHtml}</ul>
          <div class="card-actions">
            <button class="btn btn-primary" id="complete-btn-${s.id}">Mark as Complete ✓</button>
            <button class="btn btn-danger" id="reset-btn-${s.id}">Reset Stage</button>
          </div>
          <div class="completed-banner" id="banner-${s.id}" role="status">
            ✅ Stage complete — great work!
          </div>
        </div>
      `;

      main.appendChild(card);

      // Toggle open/close
      const header = card.querySelector('.card-header');
      header.addEventListener('click', () => toggleCard(s.id));
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleCard(s.id);
      });

      // Auto-save textarea
      const ta = card.querySelector(`#textarea-${s.id}`);
      ta.addEventListener('input', () => {
        state.stages[s.id] = state.stages[s.id] || {};
        state.stages[s.id].text = ta.value;
        saveState();
      });

      // Mark complete
      card.querySelector(`#complete-btn-${s.id}`).addEventListener('click', () => {
        markComplete(s.id, true);
      });

      // Reset stage
      card.querySelector(`#reset-btn-${s.id}`).addEventListener('click', () => {
        markComplete(s.id, false);
        ta.value = '';
        state.stages[s.id] = { text: '', completed: false };
        saveState();
        renderAll();
      });
    });
  }

  function buildCelebration() {
    const el = document.getElementById('celebration');
    el.innerHTML = `
      <div class="celebrate-inner">
        <h2>🎉 You've completed all 5 stages!</h2>
        <p>Congratulations on working through the full G.R.E.A.T. Method™. <br>
           Review your notes, share your plan, and take your first action today.</p>
      </div>
    `;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function renderAll() {
    const completedCount = STAGES.filter((s) => getStageData(s.id).completed).length;
    const pct = Math.round((completedCount / STAGES.length) * 100);

    // Progress bar
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent =
      `${completedCount} / ${STAGES.length} stages complete (${pct}%)`;

    STAGES.forEach((s) => {
      const data = getStageData(s.id);
      const card   = document.getElementById(`card-${s.id}`);
      const badge  = document.getElementById(`badge-${s.id}`);
      const status = document.getElementById(`status-${s.id}`);
      const ta     = document.getElementById(`textarea-${s.id}`);
      const btn    = document.getElementById(`complete-btn-${s.id}`);

      // Restore saved text
      ta.value = data.text || '';

      // Badge state
      badge.classList.toggle('completed', data.completed);
      badge.classList.toggle('active', !data.completed);

      // Card state
      card.classList.toggle('completed', data.completed);

      // Status icon
      status.textContent = data.completed ? '✅' : '';

      // Button text
      btn.textContent = data.completed ? 'Completed ✓' : 'Mark as Complete ✓';
      btn.disabled = data.completed;
      btn.style.opacity = data.completed ? '.5' : '1';
    });

    // Celebration
    const cel = document.getElementById('celebration');
    cel.style.display = completedCount === STAGES.length ? 'block' : 'none';
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function toggleCard(id) {
    const card   = document.getElementById(`card-${id}`);
    const header = card.querySelector('.card-header');
    const isOpen = card.classList.contains('open');
    card.classList.toggle('open', !isOpen);
    header.setAttribute('aria-expanded', String(!isOpen));
  }

  function scrollToCard(id) {
    const card = document.getElementById(`card-${id}`);
    if (!card.classList.contains('open')) toggleCard(id);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function markComplete(id, completed) {
    state.stages[id] = state.stages[id] || {};
    const ta = document.getElementById(`textarea-${id}`);
    state.stages[id].text = ta.value;
    state.stages[id].completed = completed;
    saveState();
    renderAll();
  }

  // ── Reset all ─────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildDashboard();

    document.getElementById('reset-all-btn').addEventListener('click', () => {
      if (!confirm('Reset all stages? Your notes will be cleared.')) return;
      state = { stages: {} };
      saveState();
      renderAll();
    });
  });

  // ── Utility ───────────────────────────────────────────────────────────────
  function escHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, (c) => map[c]);
  }
})();
