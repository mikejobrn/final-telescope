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

        const isPastDay = this.hasAttribute('is-past');
        const providedTheme = this.getAttribute('theme');
        const num = parseInt(dayNum.replace(/[^0-9]/g, ''), 10) || 1;

        let themeTextColor = 'text-primary';
        let activeBarColor = 'bg-primary';

        if (providedTheme === 'coral') {
            themeTextColor = 'text-coral';
            activeBarColor = 'bg-coral';
        } else if (providedTheme === 'mint') {
            themeTextColor = 'text-mint';
            activeBarColor = 'bg-mint';
        } else if (providedTheme) {
            themeTextColor = 'text-primary';
            activeBarColor = 'bg-primary';
        } else {
            const themesText = ['text-primary', 'text-mint', 'text-coral'];
            const themesBg = ['bg-primary', 'bg-mint', 'bg-coral'];
            themeTextColor = themesText[(num - 1) % themesText.length];
            activeBarColor = themesBg[(num - 1) % themesBg.length];
        }

        let containerBase = "bg-white rounded-xl p-4 border border-slate-50 shadow-sm relative overflow-hidden transition-opacity mb-5";

        if (isPastDay) {
            themeTextColor = "text-slate-500";
            activeBarColor = "bg-slate-400";
            containerBase += " opacity-60";
        } else if (!isExpanded) {
            containerBase += " opacity-85";
        }

        this.innerHTML = `
      <div class="day-card ${isExpanded ? 'open' : ''} ${containerBase}" id="card-${cardId}">
        <!-- Active indicator bar (hidden if not expanded) -->
        <div class="active-bar absolute top-0 left-0 w-1.5 h-full ${activeBarColor} ${isExpanded ? 'block' : 'hidden'}"></div>
        
        <div class="day-header flex justify-between items-center cursor-pointer" aria-expanded="${isExpanded}">
            <div class="flex items-center gap-4">
                <div>
                    <span class="text-[10px] font-bold ${themeTextColor} uppercase tracking-[0.2em] mb-1 block">Dia ${dayNum}</span>
                    <h3 class="text-slate-900 text-base font-bold">${date}</h3>
                    <p class="text-slate-500 text-xs font-medium">${desc}</p>
                </div>
            </div>
            <span class="material-symbols-rounded chevron text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}">expand_more</span>
        </div>

        <div class="day-body ${isExpanded ? 'block' : 'hidden'} mt-4">
          ${noteHTML}
          <div class="space-y-6 relative ml-2 mt-4 pb-2">
            <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
            ${activitiesHTML}
          </div>
        </div>
      </div>
    `;

        const header = this.querySelector('.day-header');
        header.addEventListener('click', () => {
            const card = this.querySelector('.day-card');
            const isOpen = card.classList.contains('open');

            document.querySelectorAll('mg-day-card .day-card.open').forEach(c => {
                if (c !== card) {
                    c.classList.remove('open');
                    const cBody = c.querySelector('.day-body');
                    const cBar = c.querySelector('.active-bar');
                    const cChevron = c.querySelector('.chevron');
                    if (cBody) { cBody.classList.remove('block'); cBody.classList.add('hidden'); }
                    if (cBar) { cBar.classList.remove('block'); cBar.classList.add('hidden'); }
                    if (cChevron) { cChevron.classList.remove('rotate-180'); }
                }
            });

            card.classList.toggle('open', !isOpen);
            const body = card.querySelector('.day-body');
            const bar = card.querySelector('.active-bar');
            const chevron = card.querySelector('.chevron');

            if (!isOpen) {
                if (body) { body.classList.remove('hidden'); body.classList.add('block'); }
                if (bar) { bar.classList.remove('hidden'); bar.classList.add('block'); }
                if (chevron) { chevron.classList.add('rotate-180'); }
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            } else {
                if (body) { body.classList.remove('block'); body.classList.add('hidden'); }
                if (bar) { bar.classList.remove('block'); bar.classList.add('hidden'); }
                if (chevron) { chevron.classList.remove('rotate-180'); }
            }
        });
    }
}

customElements.define('mg-day-card', MgDayCard);
