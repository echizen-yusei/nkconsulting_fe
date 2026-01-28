export interface CompanyHistory {
  order: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current_company: boolean;
}

export interface User {
  email: string;
  age: number;
  birthday: string;
  full_name: string;
  full_name_kana: string;
  phone_number: string;
  plan_type: string;
  purpose_of_joining: string;
  school_masters: Record<string, unknown>;
  company_histories: CompanyHistory[];
  is_allergies_or_conditions: boolean;
  allergies_or_conditions: string;
  hobbies_and_skill_1: string;
  hobbies_and_skill_2: string;
  hobbies_and_skill_3: string;
  is_smoking_preference: boolean;
  smoking_preference: string;
  is_drinking_alcohol: boolean;
  drinking_frequency: string;
  is_membership_cancellation: boolean;
  next_due_on: string;
}

export interface MembershipInformation {
  user: User;
}

// Types for Update Form
export interface MemberInformationAttributes {
  age: number;
  birthday: string;
  full_name: string;
  full_name_kana: string;
  phone_number: string;
}

export interface ProfileAttributes {
  is_allergies_or_conditions: boolean;
  allergies_or_conditions: string;
  is_smoking_preference: boolean;
  smoking_preference: string;
  is_drinking_alcohol: boolean;
  drinking_frequency: string;
  hobbies_and_skill_1: string;
  hobbies_and_skill_2: string;
  hobbies_and_skill_3: string;
}

export interface CareerHistoryAttributes {
  name: string;
  education_level: string;
  target_date: string;
}

export interface CompanyHistoryAttributes {
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  order: number;
  is_current_company: boolean;
}

export interface UpdateUser {
  member_information_attributes: MemberInformationAttributes;
  profile_attributes: ProfileAttributes;
  career_histories_attributes: CareerHistoryAttributes[];
  company_histories_attributes: CompanyHistoryAttributes[];
}

export interface UpdateMembershipInformation {
  user: UpdateUser;
}

export interface Card {
  card_holder_name: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export interface MemberPlanMe {
  member_plan: {
    current_plan: CurrentPlan;
    card: Card | null;
    upgradeable_plans: UpgradeablePlan[];
    is_pending_upgrade: boolean;
  };
}

export interface UpgradeablePlan {
  plan_type: string;
  plan_fee: number;
  upgrade_fee: number;
}

export interface CurrentPlan {
  plan_type: string;
  expiry_date?: string;
  plan_fee: number;
  current_payment_method_type?: string;
}
