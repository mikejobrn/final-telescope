class MgHero extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';

    this.innerHTML = `
        <div class="px-4 pt-4 pb-2">
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-sunny via-primary to-primary/80 p-5 text-white shadow-lg shadow-primary/20">
                <div class="flex flex-col gap-2 relative z-10">
                    <div class="flex">
                        <span class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/30 uppercase tracking-wider">
                            🇧🇷 Minas Gerais
                        </span>
                    </div>
                    <h1 class="text-2xl font-bold leading-none tracking-tight">${title}</h1>
                    <p class="text-xs font-medium opacity-90 flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs">group</span> Mike & Alan
                        <span class="mx-1">•</span>
                        <span class="material-symbols-rounded text-xs">calendar_month</span> ${subtitle}
                    </p>
                </div>
            </div>
        </div>
        `;
  }
}

customElements.define('mg-hero', MgHero);
