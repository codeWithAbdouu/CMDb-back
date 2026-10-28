import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/APIFeatures.js";
import Review from "../models/reviewModel.js";

export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
        status: "success", data: null,
    });
});


export const createOne = (Model, validationSchema) =>
    catchAsync(async (req, res, next) => {
        let data = req.body;

        if (validationSchema) {
            const result = validationSchema.safeParse(req.body);

            if (!result.success) {
                const message = result.error.issues
                    .map((issue) => issue.message)
                    .join(", ");

                return next(new AppError(message, 400));
            }

            data = result.data;
        }

        // Attach authenticated user for reviews
        if (Model === Review) {
            data.user = req.user.id;
        }

        const doc = await Model.create(data);

        res.status(201).json({
            status: "success",
            data: {
                data: doc,
            },
        });
    });

export const updateOne = (Model, validationSchema) => catchAsync(async (req, res, next) => {
    let data = req.body;

    if (validationSchema) {
        const result = validationSchema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            return next(new AppError(message, 400));
        }

        data = result.data;
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, data, {
        new: true, runValidators: true,
    });

    if (!doc) {
        return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
        status: "success", data: {
            data: doc,
        },
    });
});

export const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
        query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
        return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
        status: "success", data: {
            data: doc,
        },
    });
});

export const getAll = (Model) => catchAsync(async (req, res, next) => {
    // To allow for nested GET requests (hack)
    let filter = {};

    if (req.params.tmdbId) {
        filter = {tmdbId: Number(req.params.tmdbId)};
    }

    if (req.params.id) {
        filter = {...filter, user: req.params.id};
    }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: "success", results: doc.length, data: {
            data: doc,
        },
    });
});