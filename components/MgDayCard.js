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
        let closedBadgeColor = 'bg-primary/10';
        let themeTextClass = 'text-primary';
        let innerBadgeTextClass = 'text-primary';

        if (providedTheme && providedTheme.includes('-')) {
            const [t1, t2] = providedTheme.split('-');
            themeTextColor = `text-${t1}`;
            themeTextClass = `bg-gradient-to-b from-${t1} to-${t2} bg-clip-text text-transparent inline-block font-extrabold`;
            activeBarColor = `bg-gradient-to-b from-${t1} to-${t2}`;
            closedBadgeColor = `bg-gradient-to-b from-${t1}/15 to-${t2}/15`;
            innerBadgeTextClass = `bg-gradient-to-b from-${t1} to-${t2} bg-clip-text text-transparent font-extrabold`;
        } else if (providedTheme === 'coral') {
            themeTextColor = 'text-coral';
            themeTextClass = 'text-coral';
            activeBarColor = 'bg-coral';
            closedBadgeColor = 'bg-coral/10';
            innerBadgeTextClass = 'text-coral';
        } else if (providedTheme === 'mint') {
            themeTextColor = 'text-mint';
            themeTextClass = 'text-mint';
            activeBarColor = 'bg-mint';
            closedBadgeColor = 'bg-mint/10';
            innerBadgeTextClass = 'text-mint';
        } else if (providedTheme) {
            themeTextColor = 'text-primary';
            themeTextClass = 'text-primary';
            activeBarColor = 'bg-primary';
            closedBadgeColor = 'bg-primary/10';
            innerBadgeTextClass = 'text-primary';
        } else {
            const themesText = ['text-primary', 'text-mint', 'text-coral'];
            const themesBg = ['bg-primary', 'bg-mint', 'bg-coral'];
            const themesBadge = ['bg-primary/10', 'bg-mint/10', 'bg-coral/10'];
            themeTextColor = themesText[(num - 1) % themesText.length];
            themeTextClass = themeTextColor;
            activeBarColor = themesBg[(num - 1) % themesBg.length];
            closedBadgeColor = themesBadge[(num - 1) % themesBadge.length];
            innerBadgeTextClass = themeTextColor;
        }

        let containerOpen = "bg-white rounded-2xl p-6 shadow-xl border border-primary/5 relative overflow-hidden transition-opacity mb-5";
        let containerClosed = "bg-white rounded-xl p-5 shadow-sm border border-slate-50 flex justify-between items-center opacity-80 cursor-pointer transition-opacity mb-5 day-header"; // Added day-header for app.js compat

        if (isPastDay) {
            themeTextColor = "text-slate-500";
            themeTextClass = "text-slate-500";
            activeBarColor = "bg-slate-400";
            closedBadgeColor = "bg-slate-200";
            innerBadgeTextClass = "text-slate-500";
            containerOpen += " opacity-60 grayscale";
            containerClosed += " opacity-60 grayscale";
        }

        this.innerHTML = `
      <div class="day-card ${isExpanded ? 'open' : ''}" id="card-${cardId}">
        
        <!-- OPEN STATE -->
        <div class="day-view-open ${isExpanded ? 'block' : 'hidden'} ${containerOpen}">
            <div class="absolute top-0 left-0 w-2 h-full ${activeBarColor}"></div>
            <div class="day-header-open flex justify-between items-start mb-8 cursor-pointer w-full day-header" aria-expanded="true">
                <div>
                    <h4 class="${themeTextClass} text-xs uppercase tracking-widest mb-1">Dia ${dayNum}</h4>
                    <h3 class="text-slate-900 text-2xl font-bold">${date}</h3>
                    <p class="text-slate-500 text-sm font-medium mt-1">${desc}</p>
                </div>
                <span class="material-symbols-rounded text-slate-400">expand_less</span>
            </div>

            <div class="day-body block mt-4">
              ${noteHTML}
              <div class="space-y-8 relative ml-2 mt-4 pb-2">
                <div class="timeline-line absolute left-[7px] top-4 bottom-4 w-[2px] bg-slate-100"></div>
                ${activitiesHTML}
              </div>
            </div>
        </div>

        <!-- CLOSED STATE -->
        <div class="day-view-closed ${isExpanded ? 'hidden' : 'flex'} ${containerClosed}" aria-expanded="false">
            <div class="flex items-center gap-4">
                <div class="size-10 rounded-full ${closedBadgeColor} flex items-center justify-center font-bold text-xs"><span class="${innerBadgeTextClass}">D${dayNum}</span></div>
                <div>
                    <h3 class="${isPastDay ? 'text-slate-500' : 'text-slate-900'} text-base font-bold">${date}</h3>
                    <p class="text-slate-500 text-xs font-medium">${desc}</p>
                </div>
            </div>
            <span class="material-symbols-rounded text-slate-300">expand_more</span>
        </div>
      </div>
    `;

        const attachToggle = (el) => {
            if (!el) return;
            el.addEventListener('click', () => {
                const card = this.querySelector('.day-card');
                const isOpen = card.classList.contains('open');

                document.querySelectorAll('mg-day-card .day-card.open').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('open');
                        const cOpenView = c.querySelector('.day-view-open');
                        const cClosedView = c.querySelector('.day-view-closed');
                        if (cOpenView) { cOpenView.classList.remove('block'); cOpenView.classList.add('hidden'); }
                        if (cClosedView) { cClosedView.classList.remove('hidden'); cClosedView.classList.add('flex'); }
                    }
                });

                card.classList.toggle('open', !isOpen);
                const openView = card.querySelector('.day-view-open');
                const closedView = card.querySelector('.day-view-closed');

                if (!isOpen) {
                    if (openView) { openView.classList.remove('hidden'); openView.classList.add('block'); }
                    if (closedView) { closedView.classList.remove('flex'); closedView.classList.add('hidden'); }
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                } else {
                    if (openView) { openView.classList.remove('block'); openView.classList.add('hidden'); }
                    if (closedView) { closedView.classList.remove('hidden'); closedView.classList.add('flex'); }
                }
            });
        };

        attachToggle(this.querySelector('.day-header-open'));
        attachToggle(this.querySelector('.day-view-closed'));
    }
}

customElements.define('mg-day-card', MgDayCard);
