class MgLegend extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar">
            <span class="flex-none flex items-center gap-1 bg-white border border-slate-100 rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"><span class="material-symbols-rounded text-[14px]">lock</span> Imperdível</span>
            <span class="flex-none flex items-center gap-1 bg-white border border-slate-100 rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"><span class="material-symbols-rounded text-[14px] text-yellow-500">radio_button_checked</span> Flexível</span>
            <span class="flex-none flex items-center gap-1 bg-white border border-slate-100 rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"><span class="material-symbols-rounded text-[14px]">schedule</span> Fixo</span>
            <span class="flex-none flex items-center gap-1 bg-white border border-slate-100 rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"><span class="material-symbols-rounded text-[14px]">rainy</span> Chuva</span>
        </div>
        `;
  }
}

customElements.define('mg-legend', MgLegend);
