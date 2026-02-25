// === INITIALIZATION & EXTRA LOGIC ===

// === INITIALIZATION & EXTRA LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
  // === Timeline & Today Logic ===
  const today = new Date();

  let closestCard = null;
  let minDiff = Infinity;
  let todayCardToOpen = null;

  // Find all activities across all days to set their past/active/future states
  document.querySelectorAll('mg-day-card').forEach(dayCard => {
    const cardDateStr = dayCard.getAttribute('date-iso') || '';
    if (!cardDateStr) return; // Skip if no iso date

    // Example: "2026-02-24"
    const cardDate = new Date(cardDateStr + 'T00:00:00'); // Local time bounds

    const diff = Math.abs(today.getTime() - cardDate.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestCard = dayCard;
    }

    const isPastDay = today.getTime() > cardDate.getTime() + 86400000;
    const isToday = today.toDateString() === cardDate.toDateString();

    let lastPastMgActivity = null;
    let firstUpcomingMgActivity = null;

    dayCard.querySelectorAll('mg-activity').forEach(activity => {
      const timeStr = activity.getAttribute('time');

      if (isPastDay) {
        activity.setAttribute('is-past', '');
      } else if (isToday) {
        // Check time block
        if (timeStr && timeStr.includes(':')) {
          const parts = timeStr.split(':');
          const activityTime = new Date(today);
          activityTime.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);

          // If the activity time is strictly in the past
          if (today.getTime() >= activityTime.getTime() + 600000) { // Add 10 mins grace margin so it doesn't immediately become gray
            activity.setAttribute('is-past', '');
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
              activity.setAttribute('is-past', '');
              lastPastMgActivity = activity;
            } else {
              if (!firstUpcomingMgActivity) firstUpcomingMgActivity = activity;
            }
          }
        }
      }
    });

    if (isToday) {
      todayCardToOpen = dayCard;
      // Automatically highlight the next upcoming attraction
      if (firstUpcomingMgActivity) {
        firstUpcomingMgActivity.setAttribute('is-active', '');
      }

      // Today FAB & Auto-Open Logic
      const fab = document.getElementById('todayFab');
      const legendSection = document.getElementById('legendSection');

      if (legendSection) legendSection.style.display = 'block'; // Show Legend on today

      if (fab) {
        fab.style.display = 'block';

        // Ensure clicking FAB switches section and scrolls smoothly
        const fabBtn = fab.querySelector('button');
        const fabClone = fabBtn.cloneNode(true);
        fabBtn.parentNode.replaceChild(fabClone, fabBtn); // Remove any old listeners

        fabClone.addEventListener('click', () => {
          // Switch to days tab
          const daysBtn = document.querySelector('mg-bottom-nav').querySelector('[data-target="days"]');
          if (daysBtn) daysBtn.click();

          // Open today's card via triggering its header click
          const header = dayCard.querySelector('.day-header');
          const card = dayCard.querySelector('.day-card');
          if (header && card && !card.classList.contains('open')) {
            header.click();
          } else {
            setTimeout(() => dayCard.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
          }
        });
      }
    }
  });

  // Auto-open logic after deciding the card
  setTimeout(() => {
    const cardObjToOpen = todayCardToOpen || closestCard;
    if (cardObjToOpen) {
      const header = cardObjToOpen.querySelector('.day-header');
      const card = cardObjToOpen.querySelector('.day-card');
      if (header && card && !card.classList.contains('open')) {
        header.click();
      }
    }
  }, 500);

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
