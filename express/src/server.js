const express = require('express');
const path = require('path');
const docsRouter = require('./routes/docs');
const docsService = require('./services/docsService');

const app = express();
const PORT = 3000;

// Определяем путь к файлу данных (теперь это docs.json)
const DATA_FILE_PATH = path.join(__dirname, 'data/docs.json');

// Инициализируем сервис документов
docsService.init(DATA_FILE_PATH);

// 1. Встроенный middleware для парсинга JSON
app.use(express.json());
// 2. Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// 3. Подключение маршрутов (теперь по адресу /documents)
app.use('/documents', docsRouter);

app.get(/^.*$/, (req, res, next) => {
    // Если запрос был к API, пропускаем дальше к глобальному обработчику 404
    if (req.url.startsWith('/documents')) {
        return next();
    }
    // Для всех остальных GET-запросов отдаем главный HTML-файл бандла
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 4. Глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// 5. Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
