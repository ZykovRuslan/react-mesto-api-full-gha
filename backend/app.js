const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// const staticFolderPath = path.join(__dirname, 'public');

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(requestLogger); // подключаем логгер запросов

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json());

// app.use(express.static(staticFolderPath));

app.use(routes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(handleError);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
