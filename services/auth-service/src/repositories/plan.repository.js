import Plan from "../models/plan.model.js";

export const createPlan = async (data) => {
  return await Plan.create(data);
};

export const getAllPlans = async ({ page, limit, search }) => {
  console.log("getAllPlans called with:", { page, limit, search });
  const query = search
    ? {
        name: {
          $regex: search,
          $options: "i",
        },
      }
    : {};

  const plans = await Plan.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Plan.countDocuments(query);

  return { plans, total };
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
