import * as planService from "../services/plan.service.js";

export const createPlan = async (req, res) => {
  try {
    const plan = await planService.createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const displayPlans = async (req, res) => {
  try {
    const plans = await planService.displayPlans();

    return res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await planService.editPlan(
      planId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const result = await planService.deletePlan(planId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};