import authService from '../services/auth-service.js';

export const createProfile = async (req, res, next) => {
  authService().createProfile(req.body)
    .then(_ => res.status(200).json({
      message: 'Profile was created successfully'
    }))
    .catch(err => next(err));
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  authService().login(email, password)
    .then(token => res.status(200).json({ token }))
    .catch(err => next(err));
}

export const getProfileInfo = async (req, res, next) => {
  authService().getProfileInfo(req.userData.userId)
    .then(user => res.status(200).json(user))
    .catch(err => next(err));
}

export const editProfileInfo = async (req, res, next) => {
  authService().editProfileInfo(req.userData.userId, req.body)
    .then(user => res.status(200).json(user))
    .catch(err => next(err))
}

export const deleteProfile = async (req, res, next) => {
  authService().deleteProfile(req.userData.userId)
    .then(_ => res.status(200).json({ message: 'Profile was deleted successfully' }))
    .catch(err => next(err));
}