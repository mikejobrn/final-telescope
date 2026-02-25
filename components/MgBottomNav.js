class MgBottomNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-safe flex justify-between items-center z-[200] max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto rounded-t-3xl md:pl-8 md:pr-8">
            <a class="bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5" data-target="days">
                <div class="w-10 h-10 transition-colors rounded-full flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl">calendar_today</span>
                </div>
                <span class="text-[10px] font-medium bn-label">Dias</span>
            </a>
            
            <a class="bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5" data-target="checkins">
                <div class="w-10 h-10 transition-colors rounded-full flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl">bed</span>
                </div>
                <span class="text-[10px] font-medium bn-label">Hotel</span>
            </a>
            
            <a class="bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5 group" data-target="tasks">
                <div class="w-10 h-10 transition-colors rounded-full flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl">checklist</span>
                </div>
                <span class="text-[10px] font-medium bn-label">Checklist</span>
            </a>
            
            <a class="bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5" data-target="budget">
                <div class="w-10 h-10 transition-colors rounded-full flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl">payments</span>
                </div>
                <span class="text-[10px] font-medium bn-label">Grana</span>
            </a>
            
            <a class="bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5" data-target="food">
                <div class="w-10 h-10 transition-colors rounded-full flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl">restaurant</span>
                </div>
                <span class="text-[10px] font-medium bn-label">Comida</span>
            </a>
        </div>
        `;

        // Add event listeners for navigation logic
        const navBtns = this.querySelectorAll('.bn-btn');
        const sections = document.querySelectorAll('.section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;

                navBtns.forEach(b => {
                    b.classList.remove('active');
                    // Reset to inactive state (slate-400, unfilled icon, transparent bg)
                    b.className = `bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5 ${b.classList.contains('group') ? 'group' : ''}`;
                    const iconBox = b.querySelector('div');
                    iconBox.className = "w-10 h-10 transition-colors rounded-full flex items-center justify-center text-slate-400";
                    const icon = b.querySelector('.material-symbols-rounded');
                    icon.classList.remove('filled');
                    icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
                    b.querySelector('.bn-label').className = "text-[10px] font-medium bn-label";
                });

                btn.classList.add('active');

                // Active state (primary color, filled icon, light bg)
                btn.className = `bn-btn flex flex-col items-center gap-1 text-slate-400 cursor-pointer w-1/5 active ${btn.classList.contains('group') ? 'group' : ''}`;
                const activeIconBox = btn.querySelector('div');
                activeIconBox.className = "w-10 h-10 transition-colors rounded-full flex items-center justify-center bg-primary/10 text-primary";
                const activeIcon = btn.querySelector('.material-symbols-rounded');
                activeIcon.classList.add('filled');
                activeIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24";
                btn.querySelector('.bn-label').className = "text-[10px] font-bold text-primary bn-label";

                sections.forEach(s => {
                    s.classList.toggle('hidden', s.id !== target);
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Show Today FAB only on the days (itinerary) section
                const todayFab = document.getElementById('todayFab');
                if (todayFab && todayFab.dataset.showOnDays === 'true') {
                    todayFab.style.display = target === 'days' ? 'block' : 'none';
                }
            });
        });

        // Trigger click on first active btn or default to 'days'
        const initialActive = this.querySelector('.bn-btn[data-target="days"]');
        if (initialActive) initialActive.click();
    }
}

customElements.define('mg-bottom-nav', MgBottomNav);
