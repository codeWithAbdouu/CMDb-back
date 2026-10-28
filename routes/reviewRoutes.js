import express from 'express';
import {
    getReview,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    setMovieUserIds,
    checkReviewOwnership,
    setReviewId, setUserId, setTmdbId
} from './../controllers/reviewController.js';
import {protect, restrict} from "../controllers/authController.js";

const router = express.Router();

router.use(protect)

router.route("/me").get(restrict('user'), setUserId, getAllReviews);

router
    .route('/:tmdbId')
    .get(setTmdbId, getAllReviews)
    .post(restrict('user'), setMovieUserIds, createReview)
    .patch(restrict('user'), checkReviewOwnership, updateReview)
    .delete(restrict('user'), checkReviewOwnership, deleteReview)

router.route("/:tmdbId/me").get(restrict('user'), setReviewId, getReview);

router.use(restrict("admin"));

router
    .route('/')
    .get(getAllReviews)
    .post(createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview);

export default router;
