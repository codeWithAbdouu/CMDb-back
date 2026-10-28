import Watchlist from './../models/watchlistModel.js';
import { getOne, getAll, createOne, updateOne, deleteOne } from './handlerFactory.js';
import AppError from "../utils/appError.js";
import {createWatchlistValidation, updateWatchlistValidation} from "../validations/watchlistValidation.js";

export const setMovieUserIds = (req, res, next) => {
    if (!req.body.tmdbId) req.body.tmdbId = req.params.tmdbId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

export const setWatchListId = async (req, res, next) => {
    const watchlist = await Watchlist.findOne({
        tmdbId: req.params.tmdbId,
        user: req.user.id,
    });

    if (!watchlist) {
        return next(new AppError("watchlist not found.", 404));
    }

    req.params.id = watchlist._id;

    next();
};

export const getMovieUserIds = (req, res, next) => {
    req.params.id = req.user.id;

    next();
}

export const getWatchlist = getOne(Watchlist, [{ path: 'user' }]);
export const getAllWatchlists = getAll(Watchlist);
export const createWatchlist = createOne(Watchlist, createWatchlistValidation);
export const updateWatchlist = updateOne(Watchlist, updateWatchlistValidation);
export const deleteWatchlist = deleteOne(Watchlist);
