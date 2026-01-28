export type SettingPasswordFormProps = {
  token: string;
};

export type PasswordFormData = {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
};
