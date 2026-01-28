export enum PaymentTab {
  create = "create",
  confirm = "confirm",
  addNewCard = "addNewCard",
}

export type PaymentFormDataType = {
  name?: string;
  usageAmount?: number;
  creditCardNumber?: string;
  expirationDate?: string;
  cvv?: string;
  paymentMethodId?: string;
  plan_type?: string;
  user_id?: string;
};

export interface PaymentMethodResponse {
  card: {
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  user: {
    uuid: string;
    plan_type: string;
  };
}
