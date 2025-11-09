import catchAsync from "../helpers/catchAsync.js";
import AppError from "../helpers/AppError.js";
import Subscribtion from "../models/subscribtion.js";

// Create a new subscription (POST)
export const createSubscribtion = catchAsync(async (req, res, next) => {
  const { email } = req.body;
    // Validation
    if (!email) {
        return next(new AppError("Email is required", 400));
    }

  // Check if the email is already subscribed
  const existingSubscribtion = await Subscribtion.findOne({ email });
  if (existingSubscribtion) {
    return res.status(400).json({
      status: "fail",
      message: "This email is already subscribed",
    });
  }

  // Create and save the new subscription
  const newSubscribtion = await Subscribtion.create({ email });
  res.status(201).json({
    status: "success",
    data: {
      subscribtion: newSubscribtion,
    },
  });
});
export const getAllSubscribtions = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sort = "-subscribedAt",
  } = req.query;
    // Calculate pagination
    const skip = (page - 1) * limit;

  const subscribtions = await Subscribtion.find()
    .sort(sort)
    .skip(skip)
    .limit(limit);
    const totalSubscribtions = await Subscribtion.countDocuments();
    const totalPages = Math.ceil(totalSubscribtions / limit);

  res.status(200).json({
    status: "success",
    results: subscribtions.length,
    totalPages,
    data: {
      subscribtions,
    },
    });
});
export const deleteSubscribtion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
    const subscribtion = await Subscribtion.findByIdAndDelete(id);
    if (!subscribtion) {
        return res.status(404).json({
            status: "fail",
            message: "Subscribtion not found",
        });
    }
    res.status(204).json({
        status: "success",
        
    });
});
export const getSubscribtionStats = catchAsync(async (req, res, next) => {
  const totalSubscribtions = await Subscribtion.countDocuments();
    res.status(200).json({
        status: "success",
        data: {
            totalSubscribtions,
        },
    });
});
