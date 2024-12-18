import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { TagModel } from '../models/tag.model.js';
import { sample_users,  sample_goods, sample_tags } from '../data.js';
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedUsers();
    await seedFoods();
    await seedTags();
    console.log('connect successfully---');
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!');
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log('Users seed is done!');
}

async function seedFoods() {
  await FoodModel.deleteMany({}); // Clear existing data
  for (const food of  sample_goods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }
  console.log('Items seed is done!');
}

async function seedTags() {
  await TagModel.deleteMany({}); // Clear existing data
  for (const tag of sample_tags) {
    await TagModel.create(tag);
  }
  console.log('Tags seed is done!');
}