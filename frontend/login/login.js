// DOM элементы
const loginForm = document.getElementById('login-form');
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');
const notification = document.getElementById('notification');

// Показать/скрыть пароль
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// Показать уведомление
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(isError ? 'error' : 'success', 'show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Обработка отправки формы
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Валидация
    if (!email || !password) {
        showNotification('Пожалуйста, заполните все поля', true);
        return;
    }
    
    // Добавьте класс загрузки к кнопке
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    submitBtn.disabled = true;
    
    try {
        
        // Заглушка для демонстрации
        const data = api.login(email, password)
        
        if (!data.error) {
            showNotification('Успешный вход! Перенаправляем...');
            
            // Сохраняем токен (в реальном приложении)
            localStorage.setItem('authToken', data.token);
            
            // Перенаправляем после задержки
            setTimeout(() => {
                window.location.href = '../main/main.html';
            }, 1000);
        } else {
            throw new Error(data.message || 'Ошибка входа');
        }
    } catch (error) {
        showNotification(error.message, true);
    } finally {
        submitBtn.innerHTML = '<span class="btn-text">Войти</span><i class="fas fa-arrow-right"></i>';
        submitBtn.disabled = false;
    }
});

// Обработка входа через Google
document.querySelector('.btn-google').addEventListener('click', () => {
    showNotification('Вход через Google в разработке', true);
});