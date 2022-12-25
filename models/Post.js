import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, //Подключаем базу пользователей
      ref: 'User',
      required: true,
    },
    imageUrl: String,
    viewsCount: {
      type: Number,
    },
    comments: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);
