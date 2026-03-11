const fs = require('fs');

const sourceFile = 'protection.html';
const targetFile = 'VIP1.html';

const protectionContent = fs.readFileSync(sourceFile, 'utf8');

// Extract parts
// 1. Header and Navbar (up to <!-- ===== PAGE CONTENT ===== -->)
const headerEnd = protectionContent.indexOf('<!-- ===== PAGE CONTENT ===== -->');
let header = protectionContent.substring(0, headerEnd);

// 2. Footer and Sidebar (from <!-- Floating WhatsApp Speed Dial --> to end)
const footerStart = protectionContent.indexOf('<!-- Floating WhatsApp Speed Dial -->');
let footer = protectionContent.substring(footerStart);

// Modify title in header
header = header.replace('<title>حماية الحساب</title>', '<title>VIP1</title>');

// New VIP1 Page Content
const vipContent = `        <!-- ===== PAGE CONTENT ===== -->
        <div class="min-vh-100 pt-5 pb-5" style="background:var(--bg-color); margin-top:64px;" dir="rtl">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-sm-12 col-md-10 col-lg-8">

                        <!-- Main VIP Card -->
                        <div class="card border-0 rounded-4 shadow-sm p-4 mb-4" style="background:var(--card-color); min-height: 400px; padding: 2rem !important;">
                            
                            <!-- Top Right Badges -->
                            <div class="d-flex justify-content-start align-items-center gap-2 mb-3" id="vip-header-badges" style="flex-direction: row-reverse;">
                                <div id="vip-box" class="fw-bold d-flex align-items-center justify-content-center" style="background:#2563EB; color:white; padding:4px 12px; font-size:1.15rem; width: 62px; height: 38px;">
                                    VIP1
                                </div>
                                <div id="vip-logo" class="fw-bold fs-4 ms-2" style="line-height:1;">
                                    <span style="color:#E11D48;">V</span><span style="color:#111827; margin-right: 1px;">IP1</span>
                                </div>
                            </div>

                            <!-- Divider -->
                            <hr class="border-secondary-subtle mb-4">

                            <!-- Text Description -->
                            <div class="text-end mb-5">
                                <p id="vip-desc-text" class="mb-0" style="color:var(--text-color); font-size: 1.1rem; font-weight: 500; line-height: 1.8;">
                                    شريحتك الحالية : <span class="fw-bold">VIP1</span> إذا كنت ترغب بترقية حسابك إلى شريحة أعلى والحصول على حسومات مميزة ما عليك إلا زيادة مبيعاتك
                                </p>
                            </div>

                            <!-- Progress Section -->
                            <div class="progress-section position-relative" style="margin-top: 80px;">
                                
                                <div class="d-flex justify-content-between align-items-end mb-2 position-relative">
                                    <div style="font-size:14px; font-weight:600; color:#9CA3AF;" id="vip-next-tier-label">VIP1</div>
                                    <div class="fw-bold position-absolute" style="line-height:1; right: -5px; bottom: 0px;" id="vip-current-tier-logo">
                                        <span style="color:#E11D48; font-size: 14px;">V</span><span style="color:#111827; font-size: 14px; margin-right: 1px;">IP1</span>
                                    </div>
                                </div>

                                <!-- Progress Bar RTL -->
                                <div class="progress rounded-pill mb-2 position-relative" style="height: 14px; background-color: #E6E8EB; overflow: visible; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
                                    <div id="vip-progress-bar" class="progress-bar rounded-pill" role="progressbar" style="width: 0%; background-color: #005685; margin-right: 0;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>

                                <!-- Values below progress bar -->
                                <div class="d-flex justify-content-between text-muted mt-2" style="font-size: 13px; font-weight: 600;">
                                    <span id="vip-target-sales" style="color:#6B7280;">$ 100</span>
                                    <span id="vip-percentage" style="color:#6B7280;">% 0.000</span>
                                    <span id="vip-current-sales" style="color:#6B7280;">$ 0.000</span>
                                </div>
                            </div>

                        </div>
                        
                        <!-- Footer -->
                        <p class="text-center text-muted mt-3 mb-0" style="font-size:13px;">
                            ©2025 <span class="fw-semibold" style="color:#005685;">Ahminix</span>
                        </p>

                    </div>
                </div>
            </div>
        </div><!-- /page content -->

`;

const scriptStart = footer.indexOf('<script>\n    // ===');
let footerNoScript = scriptStart !== -1 ? footer.substring(0, scriptStart) : footer;

const newScript = `<script>
    // ============================================================
    // DATA CONFIG — VIP1 Page Data
    // ============================================================
    const pageData = {
        user: {
            name:    'Demo Demo',
            id:      '#1',
            vip:     'VIP1',
            balance: '$ 1.00',
            photo:   null          // null = show placeholder
        },
        vipDetails: {
            currentTier: "VIP1",
            nextTier: "VIP1", // In this demo, visually text matches "VIP1"
            description: "شريحتك الحالية : <span class='fw-bold'>VIP1</span> إذا كنت ترغب بترقية حسابك إلى شريحة أعلى والحصول على حسومات مميزة ما عليك إلا زيادة مبيعاتك",
            currentSales: 0.000,
            targetSales: 100,
            salesCurrency: "$",
        },
        whatsapp: [
            { label: '1', href: '#' },
            { label: '2', href: '#' }
        ],
        currentPage: 'VIP1.html'
    };

    // ============================================================
    // BOOTSTRAP (render everything from data)
    // ============================================================
    document.addEventListener('DOMContentLoaded', () => {
        renderNavbar();
        renderSidebarUser();
        renderVIPInfo();
        highlightActiveNav();
    });

    // ---- Navbar ----
    function renderNavbar() {
        const u = pageData.user;
        const vipEl = document.querySelector('.nav-vip-badge');
        const balEl = document.querySelector('.nav-balance');
        if (vipEl) vipEl.textContent = u.vip;
        if (balEl) balEl.textContent = u.balance;
    }

    // ---- Sidebar user info ----
    function renderSidebarUser() {
        const u = pageData.user;
        const nameEl = document.querySelector('.user-name');
        if (nameEl) nameEl.textContent = u.name;
        const idEl = document.querySelector('.user-id');
        if (idEl) idEl.textContent = u.id;
        const vipEl = document.querySelector('.sidebar-vip-badge');
        if (vipEl) vipEl.innerHTML = \`\${u.vip} <i class="bi bi-star-fill ms-1" style="color:#FBBF24;font-size:12px;"></i>\`;
        const balEl = document.querySelector('.sidebar-balance');
        if (balEl) balEl.textContent = u.balance;
    }

    // ---- Active nav highlight ----
    function highlightActiveNav() {
        document.querySelectorAll('.nav-item').forEach(a => {
            const href = a.getAttribute('href') || '';
            if (href.includes(pageData.currentPage)) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    // ---- VIP Page Info & Progress ----
    function renderVIPInfo() {
        const v = pageData.vipDetails;
        
        // Description
        const descEl = document.getElementById('vip-desc-text');
        if (descEl) descEl.innerHTML = v.description;
        
        // Progress Logic
        const currentSales = v.currentSales;
        const targetSales = v.targetSales;
        const percentage = targetSales > 0 ? (currentSales / targetSales) * 100 : 0;
        
        // Format numbers to 3 decimal places if they have decimals, else keep whole
        const formatNumber = (num, decimals=3) => {
            if (num === 0) return "0.000";
            if (num % 1 === 0 && num !== 0) return num.toString();
            return num.toFixed(decimals);
        }

        const formattedCurrent = formatNumber(currentSales);
        const formattedTarget = formatNumber(targetSales, 0); // 100
        const formattedPercentage = formatNumber(percentage);

        // Progress bar width
        const progressBar = document.getElementById('vip-progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        }

        // Texts
        document.getElementById('vip-current-sales').innerText = \`\${v.salesCurrency} \${formattedCurrent}\`;
        document.getElementById('vip-percentage').innerText = \`% \${formattedPercentage}\`;
        document.getElementById('vip-target-sales').innerText = \`\${v.salesCurrency} \${formattedTarget}\`;
        
        // Tier labels
        document.getElementById('vip-next-tier-label').innerText = v.nextTier;
        
        // Make sure logos map correctly just in case
        const tierToLogo = (tierName) => {
            const numPart = tierName.replace(/\\D/g, '') || '1';
            return \`<span style="color:#E11D48;">V</span><span style="color:#111827; margin-right: 1px;">IP\${numPart}</span>\`;
        };
        
        document.getElementById('vip-logo').innerHTML = tierToLogo(v.currentTier);
        document.getElementById('vip-current-tier-logo').innerHTML = tierToLogo(v.currentTier);
        document.getElementById('vip-box').innerText = v.currentTier;
    }

</script>
</body>
</html>
`;

const finalContent = header + vipContent + footerNoScript + newScript;

fs.writeFileSync(targetFile, finalContent, 'utf8');

console.log('Successfully generated ' + targetFile);
