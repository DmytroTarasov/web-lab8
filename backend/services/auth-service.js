import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import HttpError from '../models/http-error.js';
import { User } from '../models/user.js';

export default () => ({
  createProfile: (data) =>
    new Promise(async (resolve, reject) => {

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(data.password, 10);
      } catch (err) {
        return reject(new HttpError('User was not created, try again later', 500));
      }

      const createdUser = new User({
        ...data,
        password: hashedPassword
      });

      await createdUser.save();

      return resolve();
    }),
  login: (email, password) =>
    new Promise(async (resolve, reject) => {
      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        return reject(new HttpError('Invalid creds', 400));
      }

      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(
          password,
          existingUser.password
        );
      } catch (err) {
        return reject(new HttpError('Could not log you in, please try later', 500));
      }

      if (!isValidPassword) {
        return reject(new HttpError('Invalid creds', 400));
      }

      let token;
      try {
        token = jwt.sign(
          {
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
          },
          process.env.JWT_KEY
        );
      } catch (err) {
        return reject(new HttpError('Login failed', 500));
      }

      return resolve(token);
    }),
  getProfileInfo: (userId) => new Promise(async (resolve, reject) => {
    const user = await User.findById(userId).select('-password -__v -_id');

    return resolve(user);
  }),
  editProfileInfo: (userId, data) => new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email: data.email });

    if (user && user.id !== userId) {
      return reject(new HttpError('This email was already taken', 400));
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(data.password, 10);
    } catch (err) {
      return reject(new HttpError('User was not created, try again later', 500));
    }

    await User.findByIdAndUpdate(userId, { ...data, password: hashedPassword });

    const updatedUser = await User.findById(userId).select('-password -__v -_id');

    return resolve(updatedUser);
  }),
  deleteProfile: (userId) => new Promise(async (resolve, reject) => {
    await User.findByIdAndDelete(userId);
    return resolve();
  })
});
