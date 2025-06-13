document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.querySelector('.toggle-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthLabel = document.querySelector('.strength-label span');
    const notification = document.getElementById('notification');

    // Показать/скрыть пароль
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Проверка сложности пароля
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthIndicator(strength);
    });

    // Проверка совпадения паролей
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== passwordInput.value) {
            this.setCustomValidity('Пароли не совпадают');
        } else {
            this.setCustomValidity('');
        }
    });

    // Отправка формы
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            password: passwordInput.value
        };

        // Добавьте класс загрузки к кнопке
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
        submitBtn.disabled = true;

        try {
            const data = await api.register(formData.email, formData.password)
            console.log(data)
            if (!data.error) {
                showNotification(data.message, false);
                
                setTimeout(() => {
                    window.location.href = '../main/main.html';
                }, 1000);
            } else {
                throw new Error(data.message || 'Ошибка регистрации');
            }
        } catch (error) {
            showNotification(error.message, true);
        } finally {
            submitBtn.innerHTML = '<span class="btn-text">Зарегистрироваться</span><i class="fas fa-arrow-right"></i>';
            submitBtn.disabled = false;
        }
    });

    // Функции
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Длина пароля
        if (password.length > 7) strength += 1;
        if (password.length > 11) strength += 1;
        
        // Содержит цифры
        if (/\d/.test(password)) strength += 1;
        
        // Содержит спецсимволы
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        
        // Содержит буквы разного регистра
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        
        return Math.min(strength, 4); // Макс. 4 уровня сложности
    }

    function updateStrengthIndicator(strength) {
        const colors = ['#f72585', '#fb5607', '#ffbe0b', '#80b918', '#2ec4b6'];
        const labels = ['очень слабый', 'слабый', 'средний', 'сильный', 'очень сильный'];
        
        strengthBar.style.width = `${(strength + 1) * 25}%`;
        strengthBar.style.backgroundColor = colors[strength];
        strengthLabel.textContent = labels[strength];
        strengthLabel.style.color = colors[strength];
    }

    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(isError ? 'error' : 'success', 'show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});