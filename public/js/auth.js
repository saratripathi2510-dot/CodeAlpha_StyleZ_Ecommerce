/**
 * StyleZ - Authentication Module
 * Manages user login, registration, session persistence, and user navigation states
 */

const Auth = {
  elements: {},

  init() {
    this.elements = {
      modalOverlay: document.getElementById('authModalOverlay'),
      openBtn: document.getElementById('userAccountBtn'),
      closeBtn: document.getElementById('closeAuthBtn'),
      tabLogin: document.getElementById('authTabLogin'),
      tabRegister: document.getElementById('authTabRegister'),
      loginForm: document.getElementById('loginForm'),
      registerForm: document.getElementById('registerForm'),
      errorBanner: document.getElementById('authErrorBanner'),
      demoFillBtn: document.getElementById('demoFillBtn'),
      userNavContainer: document.getElementById('userNavContainer')
    };

    this.bindEvents();
    this.checkSession();
  },

  bindEvents() {
    if (this.elements.openBtn) {
      this.elements.openBtn.addEventListener('click', () => {
        if (window.StyleZState.user) {
          this.toggleUserMenu();
        } else {
          this.open('login');
        }
      });
    }

    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.elements.modalOverlay) {
          this.close();
        }
      });
    }

    // Tab buttons
    if (this.elements.tabLogin) {
      this.elements.tabLogin.addEventListener('click', () => this.switchTab('login'));
    }
    if (this.elements.tabRegister) {
      this.elements.tabRegister.addEventListener('click', () => this.switchTab('register'));
    }

    // 1-Click Demo autofill button
    if (this.elements.demoFillBtn) {
      this.elements.demoFillBtn.addEventListener('click', () => {
        this.switchTab('login');
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        if (emailInput && passInput) {
          emailInput.value = 'client@stylez.com';
          passInput.value = 'password123';
          window.StyleZUI.showToast('Demo Credentials Filled', 'Alexander Vance credentials loaded.', 'info');
        }
      });
    }

    // Login submit
    if (this.elements.loginForm) {
      this.elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin();
      });
    }

    // Register submit
    if (this.elements.registerForm) {
      this.elements.registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleRegister();
      });
    }
  },

  async checkSession() {
    try {
      const data = await window.StyleZAPI.auth.me();
      if (data.authenticated && data.user) {
        window.StyleZState.user = data.user;
      } else {
        window.StyleZState.user = null;
      }
      this.renderNav();
    } catch (err) {
      console.warn('Session check failed:', err);
      window.StyleZState.user = null;
      this.renderNav();
    }
  },

  open(tab = 'login') {
    this.hideError();
    this.switchTab(tab);
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  close() {
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      this.hideError();
    }
  },

  switchTab(tab) {
    this.hideError();
    if (tab === 'login') {
      this.elements.tabLogin?.classList.add('active');
      this.elements.tabRegister?.classList.remove('active');
      if (this.elements.loginForm) this.elements.loginForm.style.display = 'block';
      if (this.elements.registerForm) this.elements.registerForm.style.display = 'none';
    } else {
      this.elements.tabRegister?.classList.add('active');
      this.elements.tabLogin?.classList.remove('active');
      if (this.elements.registerForm) this.elements.registerForm.style.display = 'block';
      if (this.elements.loginForm) this.elements.loginForm.style.display = 'none';
    }
  },

  showError(msg) {
    if (this.elements.errorBanner) {
      this.elements.errorBanner.textContent = msg;
      this.elements.errorBanner.style.display = 'block';
    }
  },

  hideError() {
    if (this.elements.errorBanner) {
      this.elements.errorBanner.style.display = 'none';
    }
  },

  async handleLogin() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      this.showError('Please provide both your email address and password.');
      return;
    }

    try {
      const submitBtn = this.elements.loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
      }

      const res = await window.StyleZAPI.auth.login(email, password);
      window.StyleZState.user = res.user;
      this.renderNav();
      this.close();

      window.StyleZUI.showToast(
        'Welcome Back',
        `Pleased to see you again, ${res.user.name}.`,
        'success'
      );
    } catch (err) {
      this.showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      const submitBtn = this.elements.loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  },

  async handleRegister() {
    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;

    if (!name || !email || !password) {
      this.showError('Please fill in all registration fields.');
      return;
    }

    if (password.length < 6) {
      this.showError('Password must contain at least 6 characters.');
      return;
    }

    try {
      const submitBtn = this.elements.registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
      }

      const res = await window.StyleZAPI.auth.register(name, email, password);
      window.StyleZState.user = res.user;
      this.renderNav();
      this.close();

      window.StyleZUI.showToast(
        'Account Created',
        `Welcome to StyleZ Haute Couture, ${res.user.name}.`,
        'success'
      );
    } catch (err) {
      this.showError(err.message || 'Registration failed.');
    } finally {
      const submitBtn = this.elements.registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  },

  async handleLogout() {
    try {
      await window.StyleZAPI.auth.logout();
      window.StyleZState.user = null;
      this.renderNav();

      window.StyleZUI.showToast(
        'Signed Out',
        'You have successfully signed out of your account.',
        'info'
      );
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  renderNav() {
    const user = window.StyleZState.user;
    if (!this.elements.userNavContainer) return;

    if (user) {
      const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      this.elements.userNavContainer.innerHTML = `
        <div class="user-menu-wrapper" style="position: relative;">
          <button class="user-account-btn" id="userMenuTrigger">
            <span class="user-avatar-indicator">${initials}</span>
            <span class="user-name-text">${user.name.split(' ')[0]}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="user-dropdown-menu" id="userDropdownMenu" style="
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: #141414;
            border: 1px solid var(--border-gold);
            border-radius: var(--radius-sm);
            min-width: 200px;
            box-shadow: var(--shadow-md);
            z-index: 100;
            overflow: hidden;
          ">
            <div style="padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--ivory-muted);">
              Signed in as<br><strong style="color: var(--ivory-white); font-size: 0.8rem;">${user.email}</strong>
            </div>
            <button onclick="StyleZOrders.open()" style="
              width: 100%;
              text-align: left;
              padding: 0.75rem 1rem;
              font-size: 0.8rem;
              color: var(--ivory-secondary);
              display: flex;
              align-items: center;
              gap: 0.6rem;
              transition: background 0.2s;
            " onmouseover="this.style.background='rgba(212,175,55,0.1)'" onmouseout="this.style.background='transparent'">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Order History
            </button>
            <button onclick="StyleZAuth.handleLogout()" style="
              width: 100%;
              text-align: left;
              padding: 0.75rem 1rem;
              font-size: 0.8rem;
              color: #f87171;
              border-top: 1px solid var(--border-subtle);
              display: flex;
              align-items: center;
              gap: 0.6rem;
              transition: background 0.2s;
            " onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      `;

      const trigger = document.getElementById('userMenuTrigger');
      const menu = document.getElementById('userDropdownMenu');
      if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', () => {
          menu.style.display = 'none';
        });
      }
    } else {
      this.elements.userNavContainer.innerHTML = `
        <button class="user-account-btn" onclick="StyleZAuth.open('login')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Sign In</span>
        </button>
      `;
    }
  }
};

window.StyleZAuth = Auth;
