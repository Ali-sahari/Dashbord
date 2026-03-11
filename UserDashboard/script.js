// Global Currency Configuration
const currencyMap = {
    'USD': { symbol: '$', rate: 1.0, label: 'USD' },
    'AED': { symbol: 'AED', rate: 3.67, label: 'درهم اماراتي' },
    'EGP': { symbol: 'EGP', rate: 30.90, label: 'جنيه مصري' },
    'IQD': { symbol: 'IQD', rate: 1310, label: 'دينار عراقي' },
    'JOD': { symbol: 'JOD', rate: 0.71, label: 'دينار أردني' },
    'SAR': { symbol: 'SAR', rate: 3.75, label: 'ريال سعودي' },
    'SYP': { symbol: 'SYP', rate: 2500, label: 'ليرة سورية' },
    'TRY': { symbol: 'TRY', rate: 30.0, label: 'ليرة تركية' },
    'YER': { symbol: 'YER', rate: 250, label: 'الريال اليمني' }
};

// Check for saved states before DOMContentLoaded to minimize flash
(function() {
    const savedSidebarState = localStorage.getItem('sidebar-state');
    if (savedSidebarState === 'open') {
        document.body.classList.add('sidebar-open');
        document.body.classList.add('no-transition');
    }
    
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Apply currency immediately if possible (will refine in DOMContentLoaded for specific elements)
    const savedCurrency = localStorage.getItem('selected-currency') || 'USD';
    document.documentElement.setAttribute('data-currency', savedCurrency);

    // Remove no-transition after a tiny delay so future toggles are animated
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);
})();

/**
 * Converts a base USD value to the currently selected currency and formats it.
 * @param {number} baseValue - The value in USD.
 * @returns {string} - Formatted string (e.g., "$ 1.00" or "SAR 3.75").
 */
function formatCurrency(baseValue) {
    const currentCode = localStorage.getItem('selected-currency') || 'USD';
    const currency = currencyMap[currentCode] || currencyMap['USD'];
    const converted = (baseValue * currency.rate).toFixed(2);
    return `${currency.symbol} ${converted}`;
}

/**
 * Updates all currency-sensitive elements (balances, prices) 
 * across the entire dashboard based on the selected currency.
 */
function refreshCurrencyDisplays() {
    const currentCode = localStorage.getItem('selected-currency') || 'USD';
    const currency = currencyMap[currentCode] || currencyMap['USD'];
    
    // 1. Update Dropdown Button Text
    const dropdownBtn = document.getElementById('currency-dropdown-btn');
    if (dropdownBtn) {
        const span = dropdownBtn.querySelector('span');
        if (span) span.textContent = currentCode;
    }

    // 2. Update Balances (assuming base is USD 1.00)
    const baseBalanceUSD = 1.00; 
    const balanceText = formatCurrency(baseBalanceUSD);

    const sidebarBalance = document.querySelector('.sidebar-balance');
    const navBalance = document.querySelector('.nav-balance');

    if (sidebarBalance) sidebarBalance.textContent = balanceText;
    if (navBalance) navBalance.textContent = balanceText;

    // 3. Update any elements with data-base-value
    document.querySelectorAll('[data-base-value]').forEach(el => {
        const baseVal = parseFloat(el.getAttribute('data-base-value'));
        if (!isNaN(baseVal)) {
            el.textContent = formatCurrency(baseVal);
        }
    });

    // 4. Update any currency labels (e.g. "(USD)" -> "(SAR)")
    document.querySelectorAll('.currency-code-label').forEach(el => {
        el.textContent = currentCode;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const currencyDropdownBtn = document.getElementById('currency-dropdown-btn');
    const currencyMenu = document.getElementById('currency-menu');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    // 1 & 2. Sidebar Toggle and Push Layout (handled by body class sidebar-open)
    const toggleSidebar = (e) => {
        if(e) e.stopPropagation();
        document.body.classList.toggle('sidebar-open');
        
        // Save state to localStorage
        const isNowOpen = document.body.classList.contains('sidebar-open');
        localStorage.setItem('sidebar-state', isNowOpen ? 'open' : 'closed');
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    
    // 5. Sidebar persistence: Sidebar only toggles via hamburgerBtn.
    // Use the toggleSidebar logic above. 
    // Click outside listener removed as per user request to keep sidebar open.

    // 3. Currency Dropdown & Functionality
    if (currencyDropdownBtn && currencyMenu) {
        // Initialize UI on load
        refreshCurrencyDisplays();

        currencyDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currencyMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!currencyMenu.contains(e.target) && e.target !== currencyDropdownBtn) {
                currencyMenu.classList.remove('show');
            }
        });

        // Select currency item
        const currencyItems = currencyMenu.querySelectorAll('.currency-item');
        currencyItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.textContent.trim();
                // Extract 3-letter currency code using word boundaries to avoid partial matches (like ADI from ADIB)
                const matches = text.match(/\b[A-Z]{3}\b/g);
                if (matches) {
                    // Find the first match that exists in our currencyMap
                    const selectedCode = matches.find(code => currencyMap[code]);
                    if (selectedCode) {
                        localStorage.setItem('selected-currency', selectedCode);
                        refreshCurrencyDisplays();
                        currencyMenu.classList.remove('show');
                    }
                }
            });
        });
    }

    // 4. Dark mode toggle via class dark-mode on body
    if (themeToggleBtn) { // theme-toggle-btn is the ID of the wrapper now
        // Initialize theme UI based on current state (applied in IIFE)
        const updateThemeUI = () => {
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('bi-brightness-high');
                themeIcon.classList.add('bi-moon');
                themeText.textContent = 'الوضع الداكن';
            } else {
                themeIcon.classList.remove('bi-moon');
                themeIcon.classList.add('bi-brightness-high');
                themeText.textContent = 'الوضع الفاتح';
            }
        };

        updateThemeUI(); // Set initial UI

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save state to localStorage
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
            
            updateThemeUI();
        });
    }

    // Optional: Interactive Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
        });
    });

    // Floating WhatsApp Speed Dial Toggle
    const waMainBtn = document.getElementById('wa-main-btn');
    const waSubButtons = document.getElementById('wa-sub-buttons');
    const waMainIcon = document.getElementById('wa-main-icon');

    if (waMainBtn && waSubButtons && waMainIcon) {
        waMainBtn.addEventListener('click', () => {
            waSubButtons.classList.toggle('show');
            if (waSubButtons.classList.contains('show')) {
                waMainIcon.classList.remove('bi-chat-dots-fill');
                waMainIcon.classList.add('bi-x-lg');
            } else {
                waMainIcon.classList.remove('bi-x-lg');
                waMainIcon.classList.add('bi-chat-dots-fill');
            }
        });
    }

    // Hero Carousel Mouse Drag Support
    const carouselElement = document.getElementById('heroCarousel');
    if (carouselElement) {
        // Initialize bootstrap carousel instance to call next/prev manually
        const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
        let startX = 0;
        let isDragging = false;

        carouselElement.style.cursor = 'grab';

        carouselElement.addEventListener('mousedown', (e) => {
            startX = e.pageX;
            isDragging = true;
            carouselElement.style.cursor = 'grabbing';
            // Prevent default image drag behavior
            e.preventDefault(); 
        });

        carouselElement.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            let currentX = e.pageX;
            let diffX = startX - currentX;

            // Threshold to trigger slide
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swiped left
                    bsCarousel.next();
                } else {
                    // Swiped right
                    bsCarousel.prev();
                }
            }
            
            isDragging = false;
            carouselElement.style.cursor = 'grab';
        });

        carouselElement.addEventListener('mouseleave', () => {
            isDragging = false;
            carouselElement.style.cursor = 'grab';
        });
    }

    // Category Search Implementation (Home Page)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const categoryCards = document.querySelectorAll('.category-card-link');
            
            categoryCards.forEach(card => {
                const label = card.querySelector('.cat-label') || card.querySelector('.mt-2');
                if (label) {
                    const text = label.textContent.toLowerCase();
                    const colParent = card.closest('.col');
                    if (colParent) {
                        if (text.includes(searchTerm)) {
                            colParent.style.display = 'block';
                        } else {
                            colParent.style.display = 'none';
                        }
                    }
                }
            });
        });
    }

    // Add Balance Page - Form Handlers
    const chargeCodeForm = document.getElementById('chargeCodeForm');
    if (chargeCodeForm) {
        chargeCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const codeInput = document.getElementById('chargeCodeInput').value;
            alert('تم إرسال كود الشحن بنجاح: ' + codeInput + '\n(هذه رسالة محاكاة تفاعلية)');
            const modalElement = document.getElementById('chargeCodeModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if(modalInstance) modalInstance.hide();
            chargeCodeForm.reset();
        });
    }

    const paymentMethodForm = document.getElementById('paymentMethodForm');
    if (paymentMethodForm) {
        paymentMethodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amountInput = document.getElementById('paymentAmountInput').value;
            alert('تم طلب شحن رصيد بقيمة: $' + amountInput + '\nسيتم تحويلك لبوابة الدفع قريباً.\n(هذه رسالة محاكاة تفاعلية)');
            const modalElement = document.getElementById('paymentMethodModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if(modalInstance) modalInstance.hide();
            paymentMethodForm.reset();
        });
    }

    // Global Logout Listener for Sidebar (delegated)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.icon-action') || e.target.closest('#userLogout')) {
            const logoutTrigger = e.target.closest('.icon-action') || e.target.closest('#userLogout');
            // Ensure it's in a relevant context (sidebar)
            if (logoutTrigger) {
                e.preventDefault();
                localStorage.removeItem('user-type');
                // Relative path from UserDashboard folder to root index.html
                window.location.href = "../index.html";
            }
        }
    });
});
