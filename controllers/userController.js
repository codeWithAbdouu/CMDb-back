import User from './../models/userModel.js';
import {getOne, getAll, createOne, updateOne, deleteOne} from './handlerFactory.js';
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import {updateUserValidation} from "../validations/userValidation.js";

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;

    next();
};

export const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'Passwords do not match This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    const filteredBody = filterObj(req.body, 'name', 'email', "bio");

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {isActive: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const getUser = getOne(User);
export const getAllUsers = getAll(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User, updateUserValidation);
export const deleteUser = deleteOne(User);
