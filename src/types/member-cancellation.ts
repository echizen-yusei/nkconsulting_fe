export enum ReasonCancellationType {
  INFREQUENTLY = "infrequently",
  LITTLE_DEMAND = "little_demand",
  DIFFERENT_EXPECTED = "different_expected",
  NOT_COST_EFFECTIVE = "not_cost_effective",
  BUDGETARY = "budgetary",
  NOT_EASY_TO_USE = "not_easy_to_use",
  OTHER = "other",
}

export type MemberCancellationRequestData = {
  membership_cancellation: {
    desired_services_or_benefits: string;
    feedback_during_usage: string;
    reasons_attributes: {
      reason_type: ReasonCancellationType;
      other_reason: string;
    }[];
  };
};
