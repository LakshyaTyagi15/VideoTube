import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid channelId");
    }

    if (channelId === req.user?._id.toString()) {
        throw new APIError(400, "You cannot subscribe to yourself");
    }

    const alreadySubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (alreadySubscribed) {
        await Subscription.findByIdAndDelete(alreadySubscribed._id);
        return res
            .status(200)
            .json(
                new APIResponse(200, { subscribed: false }, "Unsubscribed successfully")
            );
    }

    await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    });

    return res
        .status(200)
        .json(
            new APIResponse(200, { subscribed: true }, "Subscribed successfully")
        );
});

// Get subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid channelId");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribedToSubscriber"
                        }
                    },
                    {
                        $addFields: {
                            subscribedToSubscriber: {
                                $cond: {
                                    if: { $in: [channelId, "$subscribedToSubscriber.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            },
                            subscribersCount: { $size: "$subscribedToSubscriber" }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$subscriber"
        },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: 1,
                    userName: 1,
                    fullName: 1,
                    avatar: 1,
                    subscribedToSubscriber: 1,
                    subscribersCount: 1,
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new APIResponse(200, subscribers, "Subscribers fetched successfully")
        );
});

// Get channels that a user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new APIError(400, "Invalid subscriberId");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "videos"
                        }
                    },
                    {
                        $addFields: {
                            latestVideo: {
                                $last: "$videos"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$subscribedChannel"
        },
        {
            $project: {
                _id: 0,
                subscribedChannel: {
                    _id: 1,
                    userName: 1,
                    fullName: 1,
                    avatar: 1,
                    latestVideo: {
                        _id: 1,
                        videoFile: 1,
                        thumbnail: 1,
                        title: 1,
                        description: 1,
                        duration: 1,
                        views: 1,
                        createdAt: 1,
                    }
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                subscribedChannels,
                "Subscribed channels fetched successfully"
            )
        );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
