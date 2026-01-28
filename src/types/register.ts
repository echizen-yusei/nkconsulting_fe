export type RegisterFormDataType = {
  year_old: string;
  full_name: string;
  full_name_kana: string;
  name: string;
  email: string;
  phone_number: string;
  year_of_birth: string;
  month_of_birth: string;
  day_of_birth: string;
  plan_type: string;
  purpose_of_joining: string;
  elementary_school?: string;
  elementary_graduation_year: string;
  elementary_graduation_month: string;
  junior_high_school?: string;
  junior_high_graduation_year: string;
  junior_high_graduation_month: string;
  high_school?: string;
  high_school_graduation_year: string;
  high_school_graduation_month: string;
  university?: string;
  university_graduation_year: string;
  university_graduation_month: string;
  hobbies_and_skills_1?: string;
  hobbies_and_skills_2?: string;
  hobbies_and_skills_3?: string;
  allergies_or_conditions?: string;
  smoking_preference?: string;
  is_allergies_or_conditions_true: boolean;
  is_allergies_or_conditions_false: boolean;
  is_smoking_preference_true: boolean;
  is_smoking_preference_false: boolean;
  drinking_frequency?: string;
  is_drinking_alcohol_true: boolean;
  is_drinking_alcohol_false: boolean;
  confirm_agreement: boolean;
  work_history_validation?: string;
};

export type RegisterMemberFormDataType = {
  user: {
    email: string;
    member_information_attributes: {
      age: string;
      birthday: string;
      full_name: string;
      full_name_kana: string;
      phone_number: string;
    };
    profile_attributes: {
      allergies_or_conditions?: string;
      smoking_preference?: string;
      is_allergies_or_conditions: boolean | null;
      is_smoking_preference: boolean | null;
      drinking_frequency?: string;
      is_drinking_alcohol: boolean | null;
      hobbies_and_skill_1?: string;
      hobbies_and_skill_2?: string;
      hobbies_and_skill_3?: string;
    };
    member_plan_attributes: {
      plan_type: string;
      purpose_of_joining: string;
    };
    career_histories_attributes?: {
      name: string | null;
      education_level: SchoolType | null;
      target_date: string | null;
    }[];
    company_histories_attributes?: {
      company_name?: string;
      start_date?: string;
      end_date?: string;
      order?: number;
      is_current_company?: boolean;
      position?: string;
    }[];
  };
};

export enum SchoolType {
  SHOUGAKKOU = "shougakkou",
  CHUUGAKKOU = "chuugakkou",
  KOUKOU = "koukou",
  DAIGAKU_OR_SENMON = "daigaku_or_senmon",
}

export type SchoolParamsType = {
  type: SchoolType;
  page: number;
  per_page: number;
  name: string;
};
export type SchoolResponseType = {
  school_masters: {
    name: string;
    education_level: SchoolType;
    target_date: string;
  }[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};
