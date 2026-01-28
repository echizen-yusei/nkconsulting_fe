export type CreateContactPayload = {
  name: string;
  company: string;
  email: string;
  phoneNumber: string;
  body: string;
};

export type CreateContactResponse = {
  id: number;
  name: string;
  company: string;
  email: string;
  phoneNumber: string;
  body: string;
};
