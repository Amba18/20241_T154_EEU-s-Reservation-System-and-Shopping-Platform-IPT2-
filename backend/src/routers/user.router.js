import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
import { BAD_REQUEST } from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';
const PASSWORD_HASH_SALT_ROUNDS = 10;
router.post(
  '/login',
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(BAD_REQUEST).send('Username or password is invalid');
    }

    if (user.onEdit) {
      return res.status(BAD_REQUEST).send('Your account is currently being edited. Please try again later.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return res.send(generateTokenResponse(user));
    }

    res.status(BAD_REQUEST).send('Username or password is invalid');
  })
);


router.post(
  '/register',
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(BAD_REQUEST).send('User already exists, please login!');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      PASSWORD_HASH_SALT_ROUNDS
    );

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
    };

    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result));
  })
);

router.put(
  '/updateProfile',
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );

    // Include timestamps in the response
    const userWithTimestamp = {
      ...user.toObject(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.send(generateTokenResponse(userWithTimestamp));
  })
);

router.put(
  '/changePassword',
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send('Change Password Failed!');
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();

    res.send();
  })
);

router.get(
  '/getall/:searchTerm?',
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const filter = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, 'i') } }
      : {};

    const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);

router.put(
  '/toggleBlock/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    const user = await UserModel.findById(userId);
    user.isBlocked = !user.isBlocked;
    user.save();

    res.send(user.isBlocked);
  })
);

router.get(
  '/getById/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    res.send(user);
  })
);
router.get(
  '/me',
  auth,
  handler(async (req, res) => {
    const user = await UserModel.findById(req.user.id, { password: 0 });
    if (!user) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    // Send the user data including timestamps
    res.status(200).send({
      ...user.toObject(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  })
);

router.put(
  '/update',
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin, onEdit } = req.body;

    // Find the user by ID
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update only the fields provided in the request
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (address !== undefined) user.address = address;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    // Optional: Handle `onEdit` separately
    if (onEdit !== undefined) user.onEdit = onEdit;

    await user.save();
    res.status(200).send({
      ...user.toObject(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  })
);

router.put(
  '/setEditState/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const { onEdit } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    user.onEdit = onEdit;
    await user.save();

    res.status(200).send({
      id: user.id,
      onEdit: user.onEdit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  })
);

const generateTokenResponse = user => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      oneEdit: user.onEdit,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    oneEdit: user.onEdit,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token,
  };
};

export default router;
