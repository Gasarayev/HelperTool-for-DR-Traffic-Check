const form = document.getElementById('websiteForm');
const textarea = document.getElementById('textarea');
const result = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');
const STORAGE_KEY = "ahref_sites";

window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        textarea.value = savedData;
        generateLinks(savedData);
    }
});


form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = textarea.value.trim();
    if (!input) return;

    localStorage.setItem(STORAGE_KEY, input);
    generateLinks(input);
});


clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    textarea.value = '';
    result.innerHTML = '';
});


function generateLinks(data) {
    const websites = data
        .split('\n')
        .map(site => site.trim())
        .filter(site => site);

    let html = '<div class="site-list">';
    websites.forEach(site => {
        const trafficURL = `https://ahrefs.com/traffic-checker/?input=${encodeURIComponent(site)}&mode=subdomains`;
        const backlinkURL = `https://ahrefs.com/backlink-checker/?input=${encodeURIComponent(site)}&mode=subdomains`;

        html += `
            <div class="site-box">
                <div class="site-header">
                    <strong>${site}</strong>
                    <button class="copy-btn" data-domain="${site}" title="Copy domain">📋</button>
                </div>
                <a href="${trafficURL}" target="_blank">🔗 Traffic</a>
                <a href="${backlinkURL}" target="_blank">🔗 Backlink</a>
            </div>
        `;
    });
    html += '</div>';
    result.innerHTML = html;

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const domain = this.getAttribute('data-domain');
            navigator.clipboard.writeText(domain)
                .then(() => {
                    this.textContent = '✅';
                    setTimeout(() => this.textContent = '📋', 1500);
                })
                .catch(err => {
                    alert('Copy failed: ' + err);
                });
        });
    });
}
