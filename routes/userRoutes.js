import express from 'express';
import {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getMe,
    updateMe,
    deleteMe
} from './../controllers/userController.js';
import {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    protect,
    restrict,
    updatePassword
} from "../controllers/authController.js"

import {createReview, getAllReviews} from "../controllers/reviewController.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updatePassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router
    .route('/:userId/reviews')
    .get(restrict('user'), getAllReviews)
    .post(restrict('user'), createReview);

router.use(restrict("admin"));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;
