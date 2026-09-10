/**
 * Toast.js
 * Responsive toast notification system.
 * Dispatches a non-intrusive alert when external or backend services are offline.
 * Respects session-storage deduplication to display only once per session.
 */

export class Toast {
  /**
   * Displays an AI service status toast if not previously displayed in this session.
   */
  static showAIServiceOfflineToast(customMessage = null) {
    const STORAGE_KEY = 'ai_service_offline_toast_shown';
    
    // Check if already shown in this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, 'true');

    const message = customMessage || "Sorry, the AI service is temporarily stopped. You can still explore the 3D Architecture, Dev Terminal, and full portfolio!";

    // Create toast container if not already present
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'portfolio-toast toast-warning';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">⚡</span>
        <div class="toast-text">
          <strong class="toast-title">AI Assistant Notice</strong>
          <span class="toast-desc">${message}</span>
        </div>
      </div>
      <button class="toast-close" aria-label="Dismiss notification">✕</button>
      <div class="toast-progress-bar"></div>
    `;

    container.appendChild(toast);

    // Auto-remove after 6.5s
    const timer = setTimeout(() => {
      dismiss();
    }, 6500);

    const dismiss = () => {
      clearTimeout(timer);
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    };

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }
  }
}

/**
 * Universal toast dispatcher for quick interactive feedback
 */
export function showToast(message, type = 'info', title = 'Skill Matrix') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeClass = type === 'warning' ? 'toast-warning' : (type === 'error' ? 'toast-error' : 'toast-info');
  toast.className = `portfolio-toast ${typeClass}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${type === 'warning' ? '⚠️' : '⚡'}</span>
      <div class="toast-text">
        <strong class="toast-title">${title}</strong>
        <span class="toast-desc">${message}</span>
      </div>
    </div>
    <button class="toast-close" aria-label="Dismiss">✕</button>
  `;

  container.appendChild(toast);

  const dismiss = () => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  };

  const timer = setTimeout(dismiss, 3500);

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      dismiss();
    });
  }
}

