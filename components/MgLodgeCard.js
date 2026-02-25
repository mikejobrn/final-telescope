class MgLodgeCard extends HTMLElement {
  connectedCallback() {
    const city = this.getAttribute('city') || '';
    const hotel = this.getAttribute('hotel') || '';
    const dates = this.getAttribute('dates') || '';
    const checkin = this.getAttribute('checkin') || '14:00';
    const checkout = this.getAttribute('checkout') || '12:00';
    const address = this.getAttribute('address') || '';
    const mapLink = this.getAttribute('map-link') || '#';
    const theme = this.getAttribute('theme') || 'primary';

    // Set the map link directly pointing to Google Maps search if just a string is provided
    const encodedAddress = encodeURIComponent(address);
    const finalMapLink = mapLink !== '#' ? mapLink : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    this.innerHTML = `
      <div class="lodge-card theme-${theme} shadow-md hover:shadow-lg transition-shadow">
        <div class="lodge-card-bg"></div>
        <div class="lodge-header">
          <div>
            <span class="lodge-city">${city}</span>
            <h3 class="lodge-title">${hotel}</h3>
          </div>
          <div class="lodge-dates">
            ${dates}
          </div>
        </div>
        <div class="lodge-times">
          <div class="lodge-time-box cursor-pointer select-none transition-colors">
            <p class="lodge-time-label transition-colors">Check-in</p>
            <p class="lodge-time-val transition-colors">${checkin}</p>
          </div>
          <div class="lodge-time-box cursor-pointer select-none transition-colors">
            <p class="lodge-time-label transition-colors">Check-out</p>
            <p class="lodge-time-val transition-colors">${checkout}</p>
          </div>
        </div>
        <div class="lodge-address flex items-start gap-2 relative z-10 w-full">
          <span class="material-symbols-rounded text-slate-400 mt-0.5" style="font-size: 1.125rem;">map</span>
          <p class="text-[0.75rem] text-slate-500 leading-relaxed flex-1 m-0">${address}</p>
          <button class="copy-btn shrink-0 p-1.5 -mt-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors cursor-pointer border-0 outline-none bg-transparent flex items-center justify-center" title="Copiar endereço" data-address="${address}">
            <span class="material-symbols-rounded" style="font-size: 1rem;">content_copy</span>
          </button>
        </div>
        <div class="lodge-footer">
          <a class="lodge-voucher" href="${finalMapLink}" target="_blank">
            <span class="material-symbols-rounded">map</span>
            Abrir no Maps
          </a>
        </div>
      </div>
    `;

    const copyBtn = this.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const addr = copyBtn.getAttribute('data-address');
        navigator.clipboard.writeText(addr).then(() => {
          this.showToast('Endereço copiado!');
        });
      });
    }

    const timeBoxes = this.querySelectorAll('.lodge-time-box');
    timeBoxes.forEach(box => {
      box.addEventListener('click', () => {
        const isDone = box.classList.contains('bg-green-50');
        if (isDone) {
          box.classList.remove('bg-green-50', 'border-green-200');
          const val = box.querySelector('.lodge-time-val');
          const label = box.querySelector('.lodge-time-label');
          if (val) val.classList.remove('text-green-700');
          if (label) label.classList.remove('text-green-600');
        } else {
          box.classList.add('bg-green-50', 'border-green-200');
          const val = box.querySelector('.lodge-time-val');
          const label = box.querySelector('.lodge-time-label');
          if (val) val.classList.add('text-green-700');
          if (label) label.classList.add('text-green-600');
        }
      });
    });
  }

  showToast(msg) {
    let toast = document.getElementById('mg-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mg-toast';
      toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-[999] opacity-0 transition-opacity duration-300 pointer-events-none';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('opacity-0');
    setTimeout(() => toast.classList.add('opacity-0'), 2500);
  }
}

customElements.define('mg-lodge-card', MgLodgeCard);
