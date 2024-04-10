const express = require('express');
// const multer = require('multer');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
// const upload = multer({ dest: 'client/public/users' });

router.post('/signup', authController.signup);
router.post('/loginWithGoogle', authController.signWithGoogle);
router.post('/signWithGoogle', authController.signWithGoogle);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); // works to protect all routes below

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);

router.use(authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
