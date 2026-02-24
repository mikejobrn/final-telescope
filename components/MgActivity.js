class MgActivity extends HTMLElement {
    connectedCallback() {
        const time = this.getAttribute('time') || '';
        const desc = this.getAttribute('desc') || '';
        const subDesc = this.getAttribute('sub-desc') || '';
        let tags = this.getAttribute('tags') || '';

        if (tags) {
            tags = tags.split(',').map(tag => `<span>${tag.trim()}</span>`).join('');
        }

        this.innerHTML = `
      <div class="activity">
        <div class="time">${time}</div>
        <div class="desc">
          <b>${desc}</b>
          ${subDesc ? `<small>${subDesc}</small>` : ''}
        </div>
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </div>
    `;
    }
}

customElements.define('mg-activity', MgActivity);
