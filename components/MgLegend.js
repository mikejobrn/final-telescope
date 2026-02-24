class MgLegend extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <section class="legend-section" id="legendSection" style="display: none;">
        <h3 class="legend-title">Legenda</h3>
        <div class="legend">
          <span class="legend-item"><span class="le">🔒</span> Imperdível</span>
          <span class="legend-item"><span class="le">🟡</span> Flexível</span>
          <span class="legend-item"><span class="le">⏰</span> Horário fixo</span>
          <span class="legend-item"><span class="le">🌧️</span> Chuva</span>
        </div>
      </section>
    `;
    }
}

customElements.define('mg-legend', MgLegend);
