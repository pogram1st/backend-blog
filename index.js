import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserControllers, PostController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://admin:1234@nodejs.bgwyrni.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.warn(`DB ${err}`)); // Подключились к нашей бд

const app = express(); // Создали экспресс приложение

const storage = multer.diskStorage({
  // Используем библиотеку мультер для загрузки файлов
  destination: (_, __, cb) => {
    // Говорим куда сохранять файл
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    // И под каким именем его сохранить
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // Далее объясняем мультеру какое хранилище использовать
app.use(cors());
app.use(express.json()); //Для того чтобы наше приложение мого читать JSON формат
app.use('/uploads', express.static('uploads')); // Здесь говорим если придет гет запрос пом=смотри есть ли в этой папке такой файл

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserControllers.register);

app.get('/auth/me', checkAuth, UserControllers.getMe);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
