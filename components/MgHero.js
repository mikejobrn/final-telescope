class MgHero extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const subtitle = this.getAttribute('subtitle') || '';

        this.innerHTML = `
      <header class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <span class="hero-badge">🔺 Minas Gerais</span>
          <h1>${title}</h1>
          <p class="hero-sub"><span class="material-symbols-rounded" style="vertical-align: text-bottom; font-size: 1.1em;">calendar_month</span> ${subtitle}</p>
        </div>
      </header>
    `;
    }
}

customElements.define('mg-hero', MgHero);
