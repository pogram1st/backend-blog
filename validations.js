import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 8 символов').isLength({ min: 8 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 8 символов').isLength({ min: 8 }),
  body('fullName', 'Вы не ввели имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьиэ').isLength({ min: 10 }).isString(),
  body('tags', 'Неверный формат тэгов (Укажите массив)').optional().isArray(), // optional означет что можно и без него но если есть проверь
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
