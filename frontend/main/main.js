
// DOM элементы
const linksList = document.getElementById('links-list');
const createBtn = document.getElementById('create-btn');
const refreshBtn = document.getElementById('refresh-btn');
const toast = document.getElementById('toast');
const linkStatsContainer = document.getElementById('link-stats-container');
const backToListBtn = document.getElementById('back-to-list-btn');
const linksCard = document.getElementById('links-card');

// Текущая выбранная ссылка
let selectedLinkCode = null;

// Функции отображения
const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

const renderLinks = async () => {
    linksList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><div>Загрузка ссылок...</div></div>';
    
    try {
        const links = await api.getAllLinks();
       
        if (links.length === 0) {
            linksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-link-slash"></i>
                    <h3>Ссылок пока нет</h3>
                    <p>Создайте свою первую короткую ссылку</p>
                </div>
            `;
            return;
        }
        
        linksList.innerHTML = '';
        
        links.forEach(link => {
            const isActive = selectedLinkCode === link.short_code;
            const linkElement = document.createElement('div');
            linkElement.className = `link-item ${isActive ? 'active' : ''}`;
            linkElement.dataset.code = link.short_code;
            linkElement.dataset.url = link.original_url;
            linkElement.innerHTML = `
                <div class="short-url">
                    <i class="fas fa-link"></i>
                    <span>https://short.link/${link.short_code}</span>
                </div>
                <div class="original-url" title="${link.original_url}">
                    ${link.original_url.length > 50 
                      ? link.original_url.substring(0, 50) + '...' 
                      : link.original_url}
                </div>
                <div class="actions">
                    <button class="btn btn-outline btn-sm copy-action" data-code="${link.short_code}">
                        <i class="far fa-copy"></i>
                    </button>
                    <button class="btn btn-outline btn-sm analytics-action" data-code="${link.short_id}">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                </div>
                <div class="link-date" style="grid-column: span 3; color: var(--gray); font-size: 0.85rem; margin-top: 8px;">
                    Создано: ${new Date(link.created).toLocaleDateString('ru-RU')}
                </div>
            `;
            linksList.appendChild(linkElement);
        });
        
        // Добавляем обработчики
        document.querySelectorAll('.copy-action').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const code = e.target.closest('.copy-action').dataset.code;
                navigator.clipboard.writeText(`https://short.link/${code}`);
                showToast('Ссылка скопирована!');
            });
        });
        
        document.querySelectorAll('.analytics-action').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();

                const linkCode = e.target.closest('.analytics-action').dataset.code;
                const linkUrl = e.target.closest('.analytics-action').dataset.url;
                showLinkStats(linkCode, linkUrl);
            });
        });
        
        document.querySelectorAll('.link-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.actions')) {
                    const linkCode = e.currentTarget.dataset.code;
                    const linkUrl = e.currentTarget.dataset.url;
                    showLinkStats(linkCode, linkUrl);
                }
            });
        });
        
    } catch (error) {
        linksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
};


const showLinkStats = async (linkCode, urlCode) => {
    try {
        // Показываем индикатор загрузки
        linkStatsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <div>Загрузка статистики...</div>
            </div>
        `;
        linkStatsContainer.style.display = 'block';
        linksCard.style.display = 'none';
        // Получаем данные
        const result = await api.getLinkStats(linkCode);
        const stats = {
            short_code: linkCode,
            original_url: urlCode,
            total_clicks: result.reduce((accumulator, currentValue) => accumulator + +currentValue.total_clicks, 0),
            clicks_by_day: result
        }
        selectedLinkCode = linkCode;
        
        // Обновляем список ссылок, чтобы выделить активную
        await renderLinks();
        
        // Рендерим статистику
        linkStatsContainer.innerHTML = `
            <div class="link-stats-header">
                <div>
                    <div class="link-stats-title">
                        <i class="fas fa-chart-line"></i>
                        <span id="stats-link-title">Статистика ссылки</span>
                    </div>
                    <div class="link-stats-url" id="stats-full-url">
                        https://short.link/${stats.short_code}<br>
                        <small>${stats.original_url}</small>
                    </div>
                </div>
                <button class="btn btn-sm" id="back-to-list-btn">
                    <i class="fas fa-arrow-left"></i> Назад
                </button>
            </div>
            
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" id="stats-total-clicks">${stats.total_clicks}</div>
                    <div class="stat-label">Всего кликов</div>
                </div>
            </div>
            
            <div class="stats-chart-container">
                <canvas id="clicksChart"></canvas>
            </div>
        `;
        
        const ctx = document.getElementById('clicksChart').getContext('2d');
        const dates = stats.clicks_by_day.map(day => new Date(day.date).toLocaleDateString('ru-RU'));
        const clicksData = stats.clicks_by_day.map(day => day.total_clicks);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Клики по дням',
                    data: clicksData,
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Кликов: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });


        // Добавляем обработчик для кнопки "Назад"
        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            linkStatsContainer.style.display = 'none';
            linksCard.style.display = 'block';
            selectedLinkCode = null;
            renderLinks();
        });
        
    } catch (error) {
        linkStatsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки статистики</h3>
                <p>${error.message}</p>
                <button class="btn" id="back-to-list-btn" style="margin-top: 20px;">
                    <i class="fas fa-arrow-left"></i> Вернуться к списку
                </button>
            </div>
        `;
        
        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            linkStatsContainer.style.display = 'none';
            linksCard.style.display = 'block';
            selectedLinkCode = null;
            renderLinks();
        });
    }
};

// Инициализация
const initApp = async () => {
    await renderLinks();
};

// Обработчики событий
createBtn.addEventListener('click', async () => {
    const original_url = document.getElementById('original-url').value;
    
    if (!original_url) {
        showToast('Пожалуйста, введите URL');
        return;
    }
    
    try {
        const newLink = await api.createLink(original_url);
        if (newLink.error) {
            throw new Error(newLink.error)
        }
        // Показываем результат
        document.getElementById('short-code').textContent = `https://short.link/${newLink.result}`
        document.getElementById('result-container').style.display = 'block';
        
        // Обновляем список ссылок
        await renderLinks();
        await renderStats();
        
        showToast('Ссылка успешно создана!');
        
    } catch (error) {
        showToast(`Ошибка: ${error.message}`);
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const shortUrl = document.getElementById('short-url').textContent;
    navigator.clipboard.writeText(shortUrl);
    showToast('Ссылка скопирована!');
});

// Запуск приложения
initApp();