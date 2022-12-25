import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    const uniqueTags = tags.filter((value, index, arr) => {
      return arr.indexOf(value) === index && value !== ''; // Возвращаем только уникальные элементы
    }); // То есть возвращаем элементы чей индекс попался первым [1, 2, 1, 2] вторая еденица и двойка уже не попадет, так
    // как их индекс не совпадет с первым, тем самым мы отсеиваем ненужное
    res.json(uniqueTags);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить теги',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
      comments: [],
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: 'Не создать статью',
      err: err,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec(); // для связи 2х таблиц
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const getAllPopular = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec(); // для связи 2х таблиц
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не получить post',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Страница не найденна',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статью',
      err: err,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Не удалить статью',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статью',
      err: err,
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );
    res.json({ succerss: true });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
      err: err,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.body.id;
    const comment = req.body.valueInput;
    const comments = req.body.comments;
    const user = await UserModel.findById(req.userId);

    const objectComm = {
      commentText: comment,
      user: user,
    };
    const arr = [...comments, objectComm];
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        comments: arr,
        user: req.userId,
      },
    );
    res.json({ arr: arr });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
      err: err,
    });
  }
};
