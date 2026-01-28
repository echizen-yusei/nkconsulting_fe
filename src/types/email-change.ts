export type SendEmailOtpRequest = {
  email_change_request: { newEmail: string };
};

export type VerifyEmailOtpRequest = {
  email_change_request: { new_email: string; otp_code: string };
};

// Response types
export type SendEmailOtpResponse = {
  email_change_request: { id: string };
};

export type VerifyEmailOtpResponse = {
  message?: string;
};
