// === INITIALIZATION & EXTRA LOGIC ===

// === INITIALIZATION & EXTRA LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
  // === Timeline & Today Logic ===
  const today = new Date();

  // Find all activities across all days to set their past/active/future states
  document.querySelectorAll('mg-day-card').forEach(dayCard => {
    const cardDateStr = dayCard.getAttribute('date-iso') || '';
    if (!cardDateStr) return; // Skip if no iso date

    // Example: "2026-02-24"
    const cardDate = new Date(cardDateStr + 'T00:00:00'); // Local time bounds

    const isPastDay = today.getTime() > cardDate.getTime() + 86400000;
    const isToday = today.toDateString() === cardDate.toDateString();

    let lastPastMgActivity = null;
    let firstUpcomingMgActivity = null;

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

          // If the activity time is strictly in the past
          if (today.getTime() >= activityTime.getTime() + 600000) { // Add 10 mins grace margin so it doesn't immediately become gray
            actEl.classList.add('is-past');
            lastPastMgActivity = activity;
          } else {
            if (!firstUpcomingMgActivity) firstUpcomingMgActivity = activity;
          }
        } else {
          // If no specific time, we assume past if there is already a past activity (heuristic)
          if (firstUpcomingMgActivity) {
            // It's ahead
          } else {
            // Not sure, treat as past for now if afternoon
            if (today.getHours() > 18) {
              actEl.classList.add('is-past');
              lastPastMgActivity = activity;
            } else {
              if (!firstUpcomingMgActivity) firstUpcomingMgActivity = activity;
            }
          }
        }
      }
    });

    if (isToday) {
      // Automatically highlight the next upcoming attraction
      if (firstUpcomingMgActivity) {
        const upcEl = firstUpcomingMgActivity.querySelector('.activity');
        if (upcEl) upcEl.classList.add('is-active');
      }

      // Insert horizontal current time line
      const indicator = document.createElement('div');
      indicator.className = 'current-time-indicator';

      if (lastPastMgActivity && firstUpcomingMgActivity) {
        // Insert between the past and upcoming
        firstUpcomingMgActivity.parentNode.insertBefore(indicator, firstUpcomingMgActivity);
      } else if (lastPastMgActivity) {
        // All activities in the past
        lastPastMgActivity.parentNode.appendChild(indicator);
      } else if (firstUpcomingMgActivity) {
        // All activities in the future
        firstUpcomingMgActivity.parentNode.insertBefore(indicator, firstUpcomingMgActivity);
      }

      // Today FAB & Auto-Open Logic
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
