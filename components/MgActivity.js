class MgActivity extends HTMLElement {
    static get observedAttributes() {
        return ['is-past', 'is-active', 'time', 'desc', 'sub-desc', 'tags'];
    }

    connectedCallback() {
        // Wait briefly for parent attributes to resolve if newly inserted
        setTimeout(() => this.render(), 0);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const time = this.getAttribute('time') || '';
        const desc = this.getAttribute('desc') || '';
        const subDesc = this.getAttribute('sub-desc') || '';
        let tags = this.getAttribute('tags') || '';
        const isPast = this.hasAttribute('is-past');
        const isActive = this.hasAttribute('is-active');

        // Parse tags
        let tagHtml = '';
        if (tags) {
            tagHtml = `<div class="flex gap-1">` + tags.split(',').map(tag => `<span class="text-[10px]">${tag.trim()}</span>`).join('') + `</div>`;
        } else {
            tagHtml = `<span></span>`; // empty spacer
        }

        // Inherit theme from parent DayCard (defaults to primary)
        const parentCard = this.closest('mg-day-card');
        const theme = parentCard ? parentCard.getAttribute('theme') : 'primary';

        // Define Theme Tokens
        let themeTextColor = 'text-primary';
        let themeBgColorObj = 'bg-primary';
        let themeCardBg = 'bg-sky-glow';
        let themeRing = 'ring-primary/20';
        let themeBorder = 'border-primary/10';
        let themeShadow = 'shadow-[0_0_20px_2px_rgba(43,140,238,0.15)]';
        let themeTimeMarkerObj = 'bg-coral'; // Global standard for "Agora", let's keep it Coral or use theme? The user said: "As cores primárias dos cards do itinerário também devem corresponder à mesma cor" which implies the blue card needs to match the theme!

        if (theme === 'coral') {
            themeTextColor = 'text-coral';
            themeBgColorObj = 'bg-coral';
            themeCardBg = 'bg-coral/10';
            themeRing = 'ring-coral/20';
            themeBorder = 'border-coral/10';
            themeShadow = 'shadow-[0_0_20px_2px_rgba(255,126,103,0.15)]';
        } else if (theme === 'mint') {
            themeTextColor = 'text-mint';
            themeBgColorObj = 'bg-mint';
            themeCardBg = 'bg-mint/10';
            themeRing = 'ring-mint/20';
            themeBorder = 'border-mint/10';
            themeShadow = 'shadow-[0_0_20px_2px_rgba(80,200,120,0.15)]';
        }

        let contentObj = ``;

        if (isActive) {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Active current marker + Active Item
            contentObj = `
            <div class="relative h-8 -ml-2 mb-2 flex items-center">
                <div class="absolute left-[-10px] right-[-20px] h-[2px] ${themeBgColorObj} z-20"></div>
                <div class="absolute left-1/2 -translate-x-1/2 ${themeBgColorObj} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-30 flex items-center gap-1">
                    <span class="material-symbols-rounded text-[12px]">schedule</span> ${formattedTime}
                </div>
            </div>
            
            <div class="relative flex gap-5 items-start">
                <div class="mt-1 size-4 rounded-full ${themeBgColorObj} ring-4 ${themeRing} z-10 shrink-0"></div>
                <div class="flex-1 ${themeCardBg} active-glow ${themeShadow} p-4 rounded-2xl -mt-3 border ${themeBorder}">
                    <div class="flex items-center justify-between mb-1">
                        <span class="${themeTextColor} font-bold text-xs tracking-wider uppercase">Atividade Atual</span>
                        <div class="flex items-center gap-2">
                             <span class="${themeTextColor} font-bold text-xs">${time}</span>
                             ${tagHtml}
                        </div>
                    </div>
                    <p class="text-slate-900 font-bold text-lg leading-tight mt-2">${desc}</p>
                    ${subDesc ? `<p class="text-xs ${themeTextColor} opacity-80 mt-1 font-medium flex items-center gap-1">${subDesc}</p>` : ''}
                </div>
            </div>`;
        } else if (isPast) {
            // Past item
            contentObj = `
            <div class="relative flex gap-5 items-start opacity-50 transition-opacity duration-300">
                <div class="mt-1 size-4 rounded-full bg-slate-400 flex items-center justify-center z-10 shrink-0">
                    <span class="material-symbols-rounded text-white text-[10px] font-bold">check</span>
                </div>
                <div class="flex-1 pb-4">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-slate-500 font-bold text-xs">${time}</span>
                        ${tagHtml}
                    </div>
                    <p class="text-slate-700 font-bold text-base leading-tight">${desc}</p>
                    ${subDesc ? `<p class="text-[10px] text-slate-500 italic mt-1">${subDesc}</p>` : ''}
                </div>
            </div>`;
        } else {
            // Future item
            contentObj = `
            <div class="relative flex gap-5 items-start">
                <div class="mt-1 size-4 rounded-full border-2 border-slate-200 bg-white z-10 shrink-0"></div>
                <div class="flex-1 pb-4">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-slate-400 font-bold text-xs">${time}</span>
                        ${tagHtml}
                    </div>
                    <p class="text-slate-700 font-bold text-base">${desc}</p>
                    ${subDesc ? `<p class="text-[10px] text-slate-400 mt-1">${subDesc}</p>` : ''}
                </div>
            </div>`;
        }

        this.innerHTML = contentObj;
    }
}

customElements.define('mg-activity', MgActivity);
