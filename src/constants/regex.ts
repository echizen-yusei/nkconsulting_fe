export const REGEX = {
  EMAIL: /^([A-Za-z0-9+_-]+)(\.[A-Za-z0-9+_-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
  PHONE: /^(?=.{0,20}$)(?!.*--)\d+(?:-\d+)*$/,
  INVALID_FIELD: /^[0-9A-Za-z@_.+\-]+$/,
  NUMBER_ONLY: /[^0-9]/g,
  NUMBER_ONLY_WITH_HYPHEN: /[^0-9-]/g,
};
