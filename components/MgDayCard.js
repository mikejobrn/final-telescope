class MgDayCard extends HTMLElement {
    connectedCallback() {
        const dayNum = this.getAttribute('day-num');
        const date = this.getAttribute('date');
        const desc = this.getAttribute('desc');
        const note = this.getAttribute('note');
        const isExpanded = this.hasAttribute('expanded');
        const cardId = this.getAttribute('id');

        if (this.querySelector('.day-card')) return;

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

        const header = this.querySelector('.day-header');
        header.addEventListener('click', () => {
            const card = this.querySelector('.day-card');
            const isOpen = card.classList.contains('open');

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

customElements.define('mg-day-card', MgDayCard);
