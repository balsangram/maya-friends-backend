import Plan from "../models/plan.model.js";

export const createPlan = async (data) => {
  return await Plan.create(data);
};

export const getAllPlans = async () => {
  return await Plan.find().sort({ createdAt: -1 });
};

export const getPlanById = async (planId) => {
  return await Plan.findById(planId);
};

export const updatePlan = async (planId, data) => {
  return await Plan.findByIdAndUpdate(
    planId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deletePlan = async (planId) => {
  return await Plan.findByIdAndDelete(planId);
};