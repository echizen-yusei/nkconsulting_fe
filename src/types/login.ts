export type LoginFormDataType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  user: {
    email: string;
    jwt_token: string;
    uuid: string;
  };
};
