// models/tag.model.js
import { Schema, model } from 'mongoose';

const TagSchema = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
});

export const TagModel = model('Tag', TagSchema);