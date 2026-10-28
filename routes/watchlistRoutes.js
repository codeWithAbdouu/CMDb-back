import express from 'express';
import {
    getWatchlist,
    getAllWatchlists,
    createWatchlist,
    updateWatchlist,
    deleteWatchlist,
    setMovieUserIds,
    setWatchListId,
    getMovieUserIds,
} from './../controllers/watchlistController.js';
import {protect, restrict} from "../controllers/authController.js";

const router = express.Router();

router.use(protect)

router
    .route('/:tmdbId')
    .post(restrict('user'), setMovieUserIds, createWatchlist)
    .delete(restrict('user'), setWatchListId, deleteWatchlist)

router.route("/:tmdbId/me").get(restrict('user'), getMovieUserIds, getAllWatchlists)
router.route("/me").get(restrict('user'), getMovieUserIds, getAllWatchlists)

router.use(restrict("admin"));

router
    .route('/')
    .get(getAllWatchlists)
    .post(createWatchlist);

router
    .route('/:id')
    .get(getWatchlist)
    .patch(updateWatchlist)
    .delete(deleteWatchlist);

export default router;