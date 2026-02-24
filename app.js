// === WEB COMPONENTS ===

// 1. Hero Component
class MgHero extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';

    this.innerHTML = `
      <header class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <span class="hero-badge">🔺 Minas Gerais</span>
          <h1>${title}</h1>
          <p class="hero-sub"><span class="material-symbols-rounded" style="vertical-align: text-bottom; font-size: 1.1em;">calendar_month</span> ${subtitle}</p>
        </div>
      </header>
    `;
  }
}

// 2. Legend Component
class MgLegend extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="legend-section" id="legendSection" style="display: none;">
        <h3 class="legend-title">Legenda</h3>
        <div class="legend">
          <span class="legend-item"><span class="le">🔒</span> Imperdível</span>
          <span class="legend-item"><span class="le">🟡</span> Flexível</span>
          <span class="legend-item"><span class="le">⏰</span> Horário fixo</span>
          <span class="legend-item"><span class="le">🌧️</span> Chuva</span>
        </div>
      </section>
    `;
  }
}

// 3. Bottom Nav Component
class MgBottomNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="bottom-nav" id="quickNav">
        <button class="bn-btn active" data-target="days">
            <span class="material-symbols-rounded bn-icon">calendar_today</span>
            <span class="bn-label">Dias</span>
        </button>
        <button class="bn-btn" data-target="checkins">
            <span class="material-symbols-rounded bn-icon">bed</span>
            <span class="bn-label">Hotel</span>
        </button>
        <button class="bn-btn" data-target="tasks">
            <span class="material-symbols-rounded bn-icon">checklist</span>
            <span class="bn-label">Tarefas</span>
        </button>
        <button class="bn-btn" data-target="budget">
            <span class="material-symbols-rounded bn-icon">payments</span>
            <span class="bn-label">Grana</span>
        </button>
        <button class="bn-btn" data-target="packing">
            <span class="material-symbols-rounded bn-icon">luggage</span>
            <span class="bn-label">Mala</span>
        </button>
        <button class="bn-btn" data-target="food">
            <span class="material-symbols-rounded bn-icon">restaurant</span>
            <span class="bn-label">Comida</span>
        </button>
      </nav>
    `;

    // Add event listeners for navigation logic
    const navBtns = this.querySelectorAll('.bn-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        navBtns.forEach(b => {
          b.classList.remove('active');
          b.querySelector('.bn-icon').style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
        });
        btn.classList.add('active');
        btn.querySelector('.bn-icon').style.fontVariationSettings = "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24";
        sections.forEach(s => {
          s.classList.toggle('hidden', s.id !== target);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
}

// 4. Day Card Component
class MgDayCard extends HTMLElement {
  connectedCallback() {
    const dayNum = this.getAttribute('day-num');
    const date = this.getAttribute('date');
    const desc = this.getAttribute('desc');
    const note = this.getAttribute('note');
    const isExpanded = this.hasAttribute('expanded');
    const cardId = this.getAttribute('id');

    // Check if the component has already been initialized (prevents double wrapping)
    if (this.querySelector('.day-card')) return;

    // Store innerHTML (activities) before replacing
    const activitiesHTML = this.innerHTML;

    let noteHTML = '';
    if (note) {
      noteHTML = `<div class="day-note">${note}</div>`;
    }

    this.innerHTML = `
      <div class="day-card ${isExpanded ? 'open' : ''}" id="card-${cardId}">
        <button class="day-header" aria-expanded="${isExpanded}">
          <div class="day-num">${dayNum}</div>
          <div class="day-info">
            <h2>${date}</h2>
            <p>${desc}</p>
          </div>
          <span class="material-symbols-rounded chevron">expand_more</span>
        </button>
        <div class="day-body">
          ${noteHTML}
          ${activitiesHTML}
        </div>
      </div>
    `;

    // Add toggle logic
    const header = this.querySelector('.day-header');
    header.addEventListener('click', () => {
      const card = this.querySelector('.day-card');
      const isOpen = card.classList.contains('open');

      // Close all other day cards
      document.querySelectorAll('mg-day-card .day-card.open').forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      card.classList.toggle('open', !isOpen);
      if (!isOpen) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  }
}

// 5. Activity Component
class MgActivity extends HTMLElement {
  connectedCallback() {
    const time = this.getAttribute('time') || '';
    const desc = this.getAttribute('desc') || '';
    const subDesc = this.getAttribute('sub-desc') || '';
    let tags = this.getAttribute('tags') || '';

    if (tags) {
      tags = tags.split(',').map(tag => `<span>${tag.trim()}</span>`).join('');
    }

    this.innerHTML = `
      <div class="activity">
        <div class="time">${time}</div>
        <div class="desc">
          <b>${desc}</b>
          ${subDesc ? `<small>${subDesc}</small>` : ''}
        </div>
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </div>
    `;
  }
}

// Register components
customElements.define('mg-hero', MgHero);
customElements.define('mg-legend', MgLegend);
customElements.define('mg-bottom-nav', MgBottomNav);
customElements.define('mg-day-card', MgDayCard);
customElements.define('mg-activity', MgActivity);

// === INITIALIZATION & EXTRA LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
  // === Timeline & Today Logic ===
  // Note: Local tests using user's simulated date "2026-02-24"
  const today = new Date();

  // Find all activities across all days to set their past/active/future states
  document.querySelectorAll('mg-day-card').forEach(dayCard => {
    const cardDateStr = dayCard.getAttribute('date-iso') || '';
    if (!cardDateStr) return; // Skip if no iso date

    // Example: "2026-02-24"
    const cardDate = new Date(cardDateStr + 'T00:00:00'); // Local time bounds

    const isPastDay = today.getTime() > cardDate.getTime() + 86400000;
    const isToday = today.toDateString() === cardDate.toDateString();

    dayCard.querySelectorAll('mg-activity').forEach(activity => {
      const timeStr = activity.getAttribute('time');
      const actEl = activity.querySelector('.activity');

      if (!actEl) return;

      if (isPastDay) {
        actEl.classList.add('is-past');
      } else if (isToday) {
        // Check time block
        if (timeStr && timeStr.includes(':')) {
          const parts = timeStr.split(':');
          const activityTime = new Date(today);
          activityTime.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);

          // If it's more than 1 hour in the past (example threshold)
          if (today.getTime() > activityTime.getTime() + 3600000) {
            actEl.classList.add('is-past');
          } else if (today.getTime() >= activityTime.getTime() && today.getTime() <= activityTime.getTime() + 3600000) {
            // Active right now
            actEl.classList.add('is-active');
          }
        } else {
          // For activities without explicit time ("Manhã", "Tarde"), assume past if late enough
          actEl.classList.add('is-past'); // Simply dummy fallback for text-based times for now
        }
      }
    });

    // Today FAB & Auto-Open Logic
    if (isToday) {
      const fab = document.getElementById('todayFab');
      const legendSection = document.getElementById('legendSection');

      if (legendSection) legendSection.style.display = 'block'; // Show Legend on today

      if (fab) {
        fab.style.display = 'block';
        fab.querySelector('button').addEventListener('click', () => {
          // Switch to days tab
          const navBtns = document.querySelectorAll('.bn-btn');
          const sections = document.querySelectorAll('.section');

          navBtns.forEach(b => {
            b.classList.remove('active');
            b.querySelector('.bn-icon').style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
          });
          navBtns[0].classList.add('active');
          navBtns[0].querySelector('.bn-icon').style.fontVariationSettings = "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24";
          sections.forEach(s => s.classList.toggle('hidden', s.id !== 'days'));

          // Open today's card
          const internalCard = dayCard.querySelector('.day-card');
          document.querySelectorAll('mg-day-card .day-card.open').forEach(c => c.classList.remove('open'));
          if (internalCard) internalCard.classList.add('open');

          setTimeout(() => dayCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        });

        // Auto-open today
        setTimeout(() => {
          const internalCard = dayCard.querySelector('.day-card');
          if (internalCard) internalCard.classList.add('open');
        }, 500);
      }
    }
  });

  // === Persist checkbox state ===
  const checkboxes = document.querySelectorAll('.todo input[type="checkbox"]');
  checkboxes.forEach((cb, i) => {
    const key = 'mg-todo-' + i;
    cb.checked = localStorage.getItem(key) === 'true';
    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked);
    });
  });
});
