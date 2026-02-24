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

customElements.define('mg-bottom-nav', MgBottomNav);
