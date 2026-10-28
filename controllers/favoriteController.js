import Favorite from './../models/favoriteModel.js';
import {getOne, getAll, createOne, updateOne, deleteOne} from './handlerFactory.js';
import AppError from "../utils/appError.js";
import {createFavoriteValidation, updateFavoriteValidation} from "../validations/favoriteValidation.js"

export const setMovieUserIds = (req, res, next) => {
    if (!req.body.tmdbId) req.body.tmdbId = req.params.tmdbId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

export const setFavoritesId = async (req, res, next) => {
    const favorites = await Favorite.findOne({
        tmdbId: req.params.tmdbId,
        user: req.user.id,
    });

    if (!favorites) {
        return next(new AppError("favorite not found.", 404));
    }

    req.params.id = favorites._id;

    next();
};

export const getMovieUserIds = (req, res, next) => {
    req.params.id = req.user.id;

    next();
}

export const getFavorite = getOne(Favorite, [{path: 'user'}]);
export const getAllFavorites = getAll(Favorite);
export const createFavorite = createOne(Favorite, createFavoriteValidation);
export const updateFavorite = updateOne(Favorite, updateFavoriteValidation);
export const deleteFavorite = deleteOne(Favorite);
