document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const toggleBtn = document.getElementById('sidebarCollapse');
    const themeBtn = document.getElementById('themeSwitcher');
    
    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Sidebar Toggle Logic
    toggleBtn.addEventListener('click', function() {
        if (window.innerWidth >= 992) {
            // Desktop behavior: Expand/Collapse
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
        } else {
            // Mobile behavior: Toggle overlay
            sidebar.classList.toggle('active');
            overlay.classList.toggle('show');
        }
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('show');
    });

    // Theme Switcher Logic
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Accordion Logic: Ensure only one collapse is open
    const collapses = document.querySelectorAll('.collapse');
    collapses.forEach(el => {
        el.addEventListener('show.bs.collapse', function() {
            collapses.forEach(other => {
                if (other !== el) {
                    const bsCollapse = bootstrap.Collapse.getInstance(other);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    });

    // --- Modal Texts Page Logic ---
    const fieldSuccess = document.getElementById('field_success');
    const fieldProcessing = document.getElementById('field_processing');
    const fieldFailed = document.getElementById('field_failed');
    const fieldDefaultSuccess = document.getElementById('field_default_success');
    const fieldDefaultRejected = document.getElementById('field_default_rejected');

    const titleSlot = document.getElementById('titleSlot');
    const replySuccessPreview = document.getElementById('replySuccessPreview');
    const replyRejectedPreview = document.getElementById('replyRejectedPreview');

    // Live Sync for titles
    const updateTitle = () => {
        const modalPreview = document.getElementById('modalPreview');
        if (modalPreview.classList.contains('is-success')) titleSlot.innerText = fieldSuccess.value || 'تم تنفيذ طلبك';
        if (modalPreview.classList.contains('is-processing')) titleSlot.innerText = fieldProcessing.value || 'طلبك قيد المعالجة';
        if (modalPreview.classList.contains('is-failed')) titleSlot.innerText = fieldFailed.value || 'تم رفض طلبك';
    };

    [fieldSuccess, fieldProcessing, fieldFailed].forEach(field => {
        if (field) field.addEventListener('input', updateTitle);
    });

    // Live Sync for replies
    if (fieldDefaultSuccess) {
        fieldDefaultSuccess.addEventListener('input', () => {
            replySuccessPreview.innerText = fieldDefaultSuccess.value || 'تم تنفيذ طلبك بنجاح ✅.';
        });
    }
    if (fieldDefaultRejected) {
        fieldDefaultRejected.addEventListener('input', () => {
            replyRejectedPreview.innerText = fieldDefaultRejected.value || 'عذراً، تم رفض الطلب ❌.';
        });
    }

    // Variant Switching
    window.setVariant = function(variant) {
        const modalPreview = document.getElementById('modalPreview');
        const iconSlot = document.getElementById('iconSlot');
        const tabs = document.querySelectorAll('.variant-tab');

        // Reset classes
        modalPreview.classList.remove('is-success', 'is-processing', 'is-failed');
        tabs.forEach(t => t.classList.remove('active'));

        // Set active tab
        const activeTab = [...tabs].find(t => t.classList.contains(variant));
        if (activeTab) activeTab.classList.add('active');

        modalPreview.classList.add(`is-${variant}`);

        // Update Title & Icon
        if (variant === 'success') {
            titleSlot.innerText = fieldSuccess.value || 'تم تنفيذ طلبك';
            iconSlot.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        } else if (variant === 'processing') {
            titleSlot.innerText = fieldProcessing.value || 'طلبك قيد المعالجة';
            iconSlot.innerHTML = '<i class="bi bi-clock-fill"></i>';
        } else if (variant === 'failed') {
            titleSlot.innerText = fieldFailed.value || 'تم رفض طلبك';
            iconSlot.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
        }
    };

    // --- Category Explorer Logic ---
    const categorySearch = document.getElementById('categorySearch');
    const categoryList = document.getElementById('categoryList');
    const btnSortPayments = document.getElementById('btnSortPayments');
    const sectionTitleText = document.querySelector('.section-title-fidelity span');
    const explorerBreadcrumb = document.querySelector('.explorer-breadcrumb');

    let currentMode = 'categories';

    const categoriesHTML = `
        <div class="category-row bg-white border" data-id="1">
            <div class="category-name-group">
                <i class="bi bi-folder-fill"></i>
                <span class="category-name">قسم رئيسي تجريبي 1</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
        <div class="category-row bg-white border" data-id="2">
            <div class="category-name-group">
                <i class="bi bi-folder-fill"></i>
                <span class="category-name">قسم رئيسي تجريبي 2</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
        <div class="category-row bg-white border" data-id="3">
            <div class="category-name-group">
                <i class="bi bi-folder-fill"></i>
                <span class="category-name">قسم رئيسي تجريبي 3</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
    `;

    const paymentsHTML = `
        <div class="category-row bg-white border" data-id="p1">
            <div class="category-name-group">
                <i class="bi bi-credit-card-2-front-fill" style="color: #7ab3ff;"></i>
                <span class="category-name">مدى (Mada)</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
        <div class="category-row bg-white border" data-id="p2">
            <div class="category-name-group">
                <i class="bi bi-credit-card-fill" style="color: #5e81ac;"></i>
                <span class="category-name">فيزا / ماستركارد</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
        <div class="category-row bg-white border" data-id="p3">
            <div class="category-name-group">
                <i class="bi bi-apple" style="color: #000;"></i>
                <span class="category-name">آبل باي (Apple Pay)</span>
            </div>
            <div class="sort-controls">
                <button class="sort-btn-fidelity move-up"><i class="bi bi-arrow-up"></i></button>
                <button class="sort-btn-fidelity move-down"><i class="bi bi-arrow-down"></i></button>
            </div>
        </div>
    `;

    if (btnSortPayments) {
        btnSortPayments.addEventListener('click', function() {
            if (currentMode === 'categories') {
                currentMode = 'payments';
                categoryList.innerHTML = paymentsHTML;
                sectionTitleText.innerText = 'طرق الدفع';
                explorerBreadcrumb.innerText = 'الرئيسية / طرق الدفع';
                btnSortPayments.innerHTML = '<i class="bi bi-folder2-open"></i> ترتيب التصنيفات';
            } else {
                currentMode = 'categories';
                categoryList.innerHTML = categoriesHTML;
                sectionTitleText.innerText = 'التصنيفات الفرعية';
                explorerBreadcrumb.innerText = 'الرئيسية';
                btnSortPayments.innerHTML = '<i class="bi bi-diagram-3"></i> ترتيب طرق الدفع';
            }
        });
    }

    if (categorySearch) {
        categorySearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const rows = categoryList.querySelectorAll('.category-row');
            rows.forEach(row => {
                const name = row.querySelector('.category-name').innerText.toLowerCase();
                if (name.includes(query)) {
                    row.style.display = 'flex';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    if (categoryList) {
        categoryList.addEventListener('click', function(e) {
            const btn = e.target.closest('.sort-btn-fidelity');
            if (!btn) return;

            const row = btn.closest('.category-row');
            if (btn.classList.contains('move-up')) {
                const prev = row.previousElementSibling;
                if (prev) {
                    categoryList.insertBefore(row, prev);
                }
            } else if (btn.classList.contains('move-down')) {
                const next = row.nextElementSibling;
                if (next) {
                    categoryList.insertBefore(next, row);
                }
            }
        });
    }

    // --- Social Links Logic ---
    const socialLinksList = document.getElementById('socialLinksList');
    const editSocialModal = document.getElementById('editSocialModal');
    const editSocialForm = document.getElementById('editSocialForm');

    if (socialLinksList) {
        socialLinksList.addEventListener('click', function(e) {
            // Reordering logic
            const sortBtn = e.target.closest('.sort-btn-fidelity');
            if (sortBtn) {
                const row = sortBtn.closest('.social-row');
                if (sortBtn.classList.contains('move-up')) {
                    const prev = row.previousElementSibling;
                    if (prev) {
                        socialLinksList.insertBefore(row, prev);
                        updateOrderNumbers();
                    }
                } else if (sortBtn.classList.contains('move-down')) {
                    const next = row.nextElementSibling;
                    if (next) {
                        socialLinksList.insertBefore(next, row);
                        updateOrderNumbers();
                    }
                }
                return;
            }

            // Edit logic
            const editBtn = e.target.closest('.btn-edit-social');
            if (editBtn && editSocialModal) {
                const row = editBtn.closest('.social-row');
                const rowId = row.getAttribute('data-id');
                const currentName = row.querySelector('.social-name').innerText;
                const currentLink = row.querySelector('.social-link').innerText;

                document.getElementById('editRowId').value = rowId;
                document.getElementById('editSocialName').value = currentName;
                document.getElementById('editSocialLink').value = currentLink;

                const bsModal = new bootstrap.Modal(editSocialModal);
                bsModal.show();
            }
        });

        if (editSocialForm) {
            editSocialForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const rowId = document.getElementById('editRowId').value;
                const newName = document.getElementById('editSocialName').value;
                const newLink = document.getElementById('editSocialLink').value;

                const row = socialLinksList.querySelector(`.social-row[data-id="${rowId}"]`);
                if (row) {
                    row.querySelector('.social-name').innerText = newName;
                    const linkEl = row.querySelector('.social-link');
                    linkEl.innerText = newLink;
                    linkEl.setAttribute('href', newLink);

                    // Hide modal
                    const modalInstance = bootstrap.Modal.getInstance(editSocialModal);
                    modalInstance.hide();
                }
            });
        }

        function updateOrderNumbers() {
            const rows = socialLinksList.querySelectorAll('.social-row');
            rows.forEach((row, index) => {
                const orderNumSpan = row.querySelector('.social-order-num');
                if (orderNumSpan) orderNumSpan.innerText = `#${index + 1}`;
            });
        }
    }

    // --- Admins Manager Logic ---
    const addAdminForm = document.getElementById('addAdminForm');
    const adminsTableBody = document.getElementById('adminsTableBody');
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            <span class="success-toast-text">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInLeft 0.5s reverse forwards';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    if (addAdminForm && adminsTableBody) {
        addAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('adminFullName').value;
            const email = document.getElementById('adminEmail').value;
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            const confirmPassword = document.getElementById('adminConfirmPassword').value;

            // Simple validation
            if (password.length < 8) {
                showToast('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                return;
            }

            if (password !== confirmPassword) {
                showToast('كلمات المرور غير متطابقة');
                return;
            }

            // Generate a random ID for simulation
            const randomId = Math.floor(Math.random() * 90) + 10;
            
            // Get current timestamp
            const now = new Date();
            const timestamp = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0') + ' ' + 
                String(now.getHours()).padStart(2, '0') + ':' + 
                String(now.getMinutes()).padStart(2, '0') + ':' + 
                String(now.getSeconds()).padStart(2, '0');

            // Create new row HTML (tr)
            const newRow = document.createElement('tr');
            newRow.className = 'admin-row admin-row-new text-center border-bottom';
            newRow.innerHTML = `
                <td><span class="text-muted fw-bold">${randomId}</span></td>
                <td><span class="text-muted small">${email}</span></td>
                <td><span class="fw-bold text-dark">${username}</span></td>
                <td><span class="text-dark">${fullName}</span></td>
                <td>
                    <span class="admin-badge" style="background-color: #64748b;">(مدير جديد)</span>
                </td>
                <td><span class="text-muted small">${timestamp}</span></td>
                <td>
                    <span class="badge bg-secondary px-3 py-2 rounded-2" style="font-size: 0.7rem;">جديد</span>
                </td>
            `;

            adminsTableBody.prepend(newRow);
            
            // Remove highlight class after animation finishes
            setTimeout(() => {
                newRow.classList.remove('admin-row-new');
            }, 2000);

            // Reset form
            addAdminForm.reset();
            showToast('تم إضافة المدير بنجاح! 🎉');
        });
    }

    // --- 2FA Settings Logic ---
    const totpForm = document.getElementById('totpForm');
    const pinForm = document.getElementById('pinForm');
    const twofaStatusText = document.getElementById('twofaStatusText');
    const disableActionArea = document.getElementById('disableActionArea');
    const btnDisable2FA = document.getElementById('btnDisable2FA');

    function update2FAStatus(isActive, method = '') {
        if (!twofaStatusText || !disableActionArea) return;

        if (isActive) {
            twofaStatusText.textContent = `مفعّل عبر ${method}`;
            twofaStatusText.className = 'current-status-badge status-on';
            disableActionArea.classList.remove('d-none');
            disableActionArea.style.animation = 'slideInLeft 0.5s ease forwards';
        } else {
            twofaStatusText.textContent = 'غير مفعّل';
            twofaStatusText.className = 'current-status-badge status-off';
            disableActionArea.classList.add('d-none');
        }
    }

    if (totpForm) {
        totpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const code = document.getElementById('totpCode').value;
            
            if (code.length === 6) {
                update2FAStatus(true, 'Google Authenticator');
                showToast('تم تفعيل التحقق عبر Google بنجاح! 🔐');
                totpForm.reset();
            } else {
                showToast('الرجاء إدخال كود صحيح مكون من 6 أرقام');
            }
        });
    }

    if (pinForm) {
        pinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const pin = document.getElementById('pinCode').value;
            const confirmPin = document.getElementById('pinConfirm').value;

            if (pin.length !== 4) {
                showToast('يجب أن يتكون الرمز من 4 أرقام');
                return;
            }

            if (pin === confirmPin) {
                update2FAStatus(true, 'رمز PIN');
                showToast('تم تفعيل قفل PIN بنجاح! 🔑');
                pinForm.reset();
            } else {
                showToast('رموز الـ PIN غير متطابقة!');
            }
        });
    }

    if (btnDisable2FA) {
        btnDisable2FA.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من إيقاف تفعيل التحقق بخطوتين؟')) {
                update2FAStatus(false);
                showToast('تم إيقاف تفعيل التحقق بخطوتين');
            }
        });
    }

    // --- Dashboard / Index Page Logic ---
    const btnMaintenance = document.getElementById('btnMaintenance');
    const maintenanceText = document.getElementById('maintenanceText');
    const btnNotifications = document.getElementById('btnNotifications');
    
    if (btnMaintenance) {
        btnMaintenance.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isDanger = this.classList.contains('btn-danger');
            
            if (isDanger) {
                this.classList.replace('btn-danger', 'btn-success');
                icon.classList.replace('fa-toggle-off', 'fa-toggle-on');
                if (maintenanceText) maintenanceText.innerText = 'إيقاف وضع الصيانة';
                showToast('تم تفعيل وضع الصيانة 🛠️');
            } else {
                this.classList.replace('btn-success', 'btn-danger');
                icon.classList.replace('fa-toggle-on', 'fa-toggle-off');
                if (maintenanceText) maintenanceText.innerText = 'تفعيل وضع الصيانة';
                showToast('تم إيقاف وضع الصيانة ✅');
            }
        });
    }

    if (btnNotifications) {
        btnNotifications.addEventListener('click', function() {
            showToast('لا توجد إشعارات جديدة حالياً 🔔');
            const badge = this.querySelector('.bg-danger');
            if (badge) badge.style.display = 'none';
        });
    }

    // Dynamic stats card actions
    const actionButtons = document.querySelectorAll('.btn-card-action, .btn-outline-danger, .btn-outline-secondary');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.tagName === 'A' && this.getAttribute('href') === '#') {
                e.preventDefault();
                showToast('جاري فتح التفاصيل... ⏳');
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // --- Add Product Page Logic ---
    const btnAddProduct = document.getElementById('btnAddProduct');
    const btnCancelProduct = document.getElementById('btnCancelProduct');

    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', function(e) {
            e.preventDefault();
            const btn = this;
            
            // Show loading state
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>جاري الحفظ...</span>';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                showToast('تمت إضافة المنتج بنجاح! 📦');
                
                btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>تمت الإضافة</span>';
                btn.classList.replace('btn-action-primary', 'btn-success');
                btn.style.opacity = '1';
                
                setTimeout(() => {
                    window.location.href = './manage_products.html';
                }, 1500);
            }, 1000);
        });
    }

    if (btnCancelProduct) {
        btnCancelProduct.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('هل أنت متأكد من إلغاء العملية؟ ستفقد جميع البيانات التي أدخلتها.')) {
                window.location.href = './manage_products.html';
            }
        });
    }
});

// --- Admin Logout ---
function adminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminData');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '../login.html';
}
