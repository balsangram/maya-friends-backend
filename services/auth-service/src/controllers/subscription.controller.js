import {
  cancelPlan as cancelPlanService,
  resubscribePlan as resubscribePlanService,
} from "../services/subscription.service.js";


// Cancel subscription
export const cancelPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscription =
      await cancelPlanService(userId);

    return res.status(200).json({
      success: true,
      message:
        "Subscription will be cancelled at the end of the current period",
      data: subscription,
    });
  } catch (error) {
    console.error(
      "Cancel subscription error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Re-subscribe
export const resubscribePlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscription =
      await resubscribePlanService(userId);

    return res.status(200).json({
      success: true,
      message:
        "Subscription reactivated successfully",
      data: subscription,
    });
  } catch (error) {
    console.error(
      "Resubscribe error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};