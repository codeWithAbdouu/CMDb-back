import express from "express";
import {
    getFavorite,
    getAllFavorites,
    createFavorite,
    updateFavorite,
    deleteFavorite,
    setMovieUserIds,
    setFavoritesId,
    getMovieUserIds,
} from "./../controllers/favoriteController.js";
import {protect, restrict} from "../controllers/authController.js";
import {getAllWatchlists} from "../controllers/watchlistController.js";

const router = express.Router();

router.use(protect);

router
    .route("/:tmdbId")
    .post(restrict("user"), setMovieUserIds, createFavorite)
    .delete(restrict("user"), setFavoritesId, deleteFavorite);

router
    .route("/:tmdbId/me")
    .get(restrict("user"), getMovieUserIds, getAllFavorites);
router.route("/me").get(restrict('user'), getMovieUserIds, getAllFavorites)

router.use(restrict("admin"));

router
    .route("/")
    .get(getAllFavorites)
    .post(createFavorite);

router
    .route("/:id")
    .get(getFavorite)
    .patch(updateFavorite)
    .delete(deleteFavorite);

export default router;