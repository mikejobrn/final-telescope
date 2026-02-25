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
            noteHTML = `<div class="day-note text-slate-500 text-sm mb-4">${note}</div>`;
        }

        const dateIso = this.getAttribute('date-iso');
        let isPastDay = this.hasAttribute('is-past');
        if (dateIso) {
            const todayD = new Date();
            const cardD = new Date(dateIso + 'T00:00:00');
            if (todayD.getTime() > cardD.getTime() + 86400000) {
                isPastDay = true;
            }
        }

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

        if (isPastDay) {
            themeTextColor = "text-slate-500";
            themeTextClass = "text-slate-500";
            activeBarColor = "bg-slate-400";
            closedBadgeColor = "bg-slate-200";
            innerBadgeTextClass = "text-slate-500";
        }

        const baseCardClasses = "day-card group bg-white border border-slate-200 relative overflow-hidden transition-all duration-500 mb-5";
        const stateClasses = isPastDay ? "opacity-60 grayscale" : "shadow-md hover:shadow-lg";

        this.innerHTML = `
      <div class="${baseCardClasses} ${stateClasses} ${isExpanded ? 'open rounded-2xl shadow-xl' : 'rounded-xl'}" id="card-${cardId}">
        
        <!-- Animated Vertical Bar -->
        <div class="absolute top-0 left-0 w-2 h-full ${activeBarColor} transition-transform ease-in-out duration-500 origin-left scale-x-0 group-[.open]:scale-x-100 opacity-0 group-[.open]:opacity-100 z-0"></div>

        <!-- Header -->
        <div class="day-header relative p-5 group-[.open]:p-6 transition-all duration-500 cursor-pointer z-10 flex justify-between items-start">
            
            <div class="relative w-full h-[40px] group-[.open]:h-[76px] transition-all duration-500">
                
                <!-- Circular Badge -->
                <div class="absolute left-0 top-1/2 -translate-y-1/2 group-[.open]:top-0 group-[.open]:translate-y-0 w-10 h-10 rounded-full ${closedBadgeColor} border border-transparent transition-all duration-500 opacity-100 scale-100 group-[.open]:opacity-0 group-[.open]:scale-50 pointer-events-none flex items-center justify-center">
                    <span class="${innerBadgeTextClass} font-bold text-xs">D${dayNum}</span>
                </div>

                <!-- "Dia N" Text (Open Only) -->
                <h4 class="absolute left-[2px] top-0 ${themeTextClass} text-[13px] uppercase tracking-widest opacity-0 transform -translate-y-2 group-[.open]:opacity-100 group-[.open]:translate-y-0 transition-opacity transition-transform duration-500 pointer-events-none m-0">Dia ${dayNum}</h4>
                
                <!-- Text Block (Title / Desc) -->
                <div class="absolute left-[56px] top-1/2 -translate-y-1/2 group-[.open]:top-[24px] group-[.open]:translate-y-0 group-[.open]:left-[2px] transition-all duration-500">
                    <h3 class="${isPastDay ? 'text-slate-500' : 'text-slate-900'} text-base group-[.open]:text-[26px] font-bold transition-all duration-500 m-0 leading-tight origin-left">${date}</h3>
                    <p class="text-slate-500 text-xs group-[.open]:text-[15px] font-medium transition-all duration-500 m-0 mt-0 group-[.open]:mt-1 leading-tight ${isPastDay ? 'grayscale' : ''}">${desc}</p>
                </div>

            </div>

            <!-- Expand Icon -->
            <span class="material-symbols-rounded text-slate-300 transition-transform duration-500 group-[.open]:rotate-180 flex-shrink-0 mt-2 group-[.open]:mt-0">expand_more</span>
        </div>

        <!-- Expandable Body -->
        <div class="day-body grid transition-all duration-500 grid-rows-[0fr] group-[.open]:grid-rows-[1fr] opacity-0 group-[.open]:opacity-100 pointer-events-none group-[.open]:pointer-events-auto">
            <div class="overflow-hidden">
                <div class="px-6 pb-6 pt-0">
                    ${noteHTML}
                    <div class="space-y-8 relative ml-2 mt-4 pb-2">
                        <div class="timeline-line absolute left-[7px] top-[14px] bottom-0 w-[2px] bg-slate-100"></div>
                        ${activitiesHTML}
                    </div>
                </div>
            </div>
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
                        c.classList.remove('open', 'shadow-xl', 'rounded-2xl');
                        c.classList.add('rounded-xl', 'shadow-sm');
                    }
                });

                if (!isOpen) {
                    card.classList.add('open', 'shadow-xl', 'rounded-2xl');
                    card.classList.remove('rounded-xl', 'shadow-sm');
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 500);
                } else {
                    card.classList.remove('open', 'shadow-xl', 'rounded-2xl');
                    card.classList.add('rounded-xl', 'shadow-sm');
                }
            });
        };

        attachToggle(this.querySelector('.day-header'));
    }
}

customElements.define('mg-day-card', MgDayCard);
