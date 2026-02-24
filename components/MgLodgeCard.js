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
      <div class="lodge-card theme-${theme}">
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
          <div class="lodge-time-box">
            <p class="lodge-time-label">Check-in</p>
            <p class="lodge-time-val">${checkin}</p>
          </div>
          <div class="lodge-time-box">
            <p class="lodge-time-label">Check-out</p>
            <p class="lodge-time-val">${checkout}</p>
          </div>
        </div>
        <div class="lodge-address">
          <span class="material-symbols-rounded">map</span>
          <p>${address}</p>
        </div>
        <div class="lodge-footer">
          <a class="lodge-voucher" href="${finalMapLink}" target="_blank">
            <span class="material-symbols-rounded">map</span>
            Abrir no Maps
          </a>
        </div>
      </div>
    `;
    }
}

customElements.define('mg-lodge-card', MgLodgeCard);
