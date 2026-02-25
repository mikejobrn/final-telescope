class MgBottomNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-50">
                <button class="nav-btn w-16 flex flex-col items-center justify-center gap-1 group active" data-target="days">
                    <div class="p-2 transition-colors rounded-xl flex items-center justify-center text-primary bg-primary/10">
                        <span class="material-symbols-rounded text-[22px] group-[.active]:filled">event</span>
                    </div>
                </button>
                <button class="nav-btn w-16 flex flex-col items-center justify-center gap-1 group" data-target="tasks">
                    <div class="p-2 transition-colors rounded-xl flex items-center justify-center text-slate-400">
                        <span class="material-symbols-rounded text-[22px] group-[.active]:filled">fact_check</span>
                    </div>
                </button>
                <button class="nav-btn w-16 flex flex-col items-center justify-center gap-1 group" data-target="checkins">
                    <div class="p-2 transition-colors rounded-xl flex items-center justify-center text-slate-400">
                        <span class="material-symbols-rounded text-[22px] group-[.active]:filled">bed</span>
                    </div>
                </button>
                <button class="nav-btn w-16 flex flex-col items-center justify-center gap-1 group" data-target="food">
                    <div class="p-2 transition-colors rounded-xl flex items-center justify-center text-slate-400">
                        <span class="material-symbols-rounded text-[22px] group-[.active]:filled">restaurant</span>
                    </div>
                </button>
                <button class="nav-btn w-16 flex flex-col items-center justify-center gap-1 group" data-target="budget">
                    <div class="p-2 transition-colors rounded-xl flex items-center justify-center text-slate-400">
                        <span class="material-symbols-rounded text-[22px] group-[.active]:filled">payments</span>
                    </div>
                </button>
            </div>
        `;

        // Add event listeners for navigation logic
        const navBtns = this.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes from all buttons and reset their styles
                navBtns.forEach(b => {
                    b.classList.remove('active');
                    const iconBoxInner = b.querySelector('div');
                    iconBoxInner.className = "p-2 transition-colors rounded-xl flex items-center justify-center text-slate-400";
                    const icon = b.querySelector('.material-symbols-rounded');
                    icon.classList.remove('filled');
                    icon.style.fontVariationSettings = "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
                });

                // Add active to clicked button and apply active styles
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const iconBoxActive = btn.querySelector('div');
                iconBoxActive.className = "p-2 transition-colors rounded-xl flex items-center justify-center text-primary bg-primary/10";
                const activeIcon = btn.querySelector('.material-symbols-rounded');
                activeIcon.classList.add('filled');
                activeIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24";

                sections.forEach(s => {
                    s.classList.toggle('hidden', s.id !== targetId);
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        const initialActive = this.querySelector('.nav-btn[data-target="days"]');
        if (initialActive) initialActive.click();
    }
}

customElements.define('mg-bottom-nav', MgBottomNav);
