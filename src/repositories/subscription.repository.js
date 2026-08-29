import Subscription from "../models/Subscription.model.js";

// Find user's subscription
export const findSubscriptionByUserId = async (userId) => {
  return await SubscriptionModel.findOne({
    userId,
  }).populate("planId");
};


// Update subscription
export const updateSubscription = async (
  subscriptionId,
  data
) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("planId");
};