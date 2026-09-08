import {
  findSubscriptionByUserId,
  updateSubscription,
} from "../repositories/subscription.repository.js";


// Cancel subscription
export const cancelPlan = async (userId) => {
  const subscription =
    await findSubscriptionByUserId(userId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  if (subscription.status !== "active") {
    throw new Error(
      "Subscription is not active"
    );
  }

  // Already scheduled for cancellation
  if (subscription.cancelAtPeriodEnd) {
    throw new Error(
      "Subscription is already scheduled for cancellation"
    );
  }

  const updatedSubscription =
    await updateSubscription(
      subscription._id,
      {
        cancelAtPeriodEnd: true,
        autoRenew: false,
      }
    );

  return updatedSubscription;
};


// Re-subscribe
export const resubscribePlan = async (userId) => {
  const subscription =
    await findSubscriptionByUserId(userId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const now = new Date();

  // Subscription already expired
  if (
    subscription.currentPeriodEnd <= now
  ) {
    throw new Error(
      "Subscription has expired. Please subscribe again."
    );
  }

  // Subscription is already active
  if (
    subscription.status === "active" &&
    !subscription.cancelAtPeriodEnd
  ) {
    throw new Error(
      "Subscription is already active"
    );
  }

  const updatedSubscription =
    await updateSubscription(
      subscription._id,
      {
        status: "active",
        autoRenew: true,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      }
    );

  return updatedSubscription;
};