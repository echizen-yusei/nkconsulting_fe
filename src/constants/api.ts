export const API = {
  // POST
  CONTACT: "/contact",
  SESSION: "/users/sessions",
  RESET_PASSWORD: "/users/passwords",
  SETTING_PASSWORD_VERIFY: "/users/passwords",
  SETTING_PASSWORD: "/users/passwords",
  USER_INFO: "/users/me",
  REGISTER_MEMBER: "/users/registrations",
  // GET
  GET_SCHOOL_SHOUGAKKOU: "/school_masters/shougakkou",
  GET_SCHOOL_CHUUGAKKOU: "/school_masters/chuugakkou",
  GET_SCHOOL_KOUKOU: "/school_masters/koukou",
  GET_SCHOOL_DAIGAKU_OR_SENMON: "/school_masters/daigaku_or_senmon",

  // MEMBER ONLY SERVICES
  GET_CONSULTING_SERVICES: "/users/consulting_services",
  GET_MEMBER_ONLY_POSTS: "/users/member_only_posts",

  // EVENT
  EVENTS: "/users/event_informations",

  // NOTIFICATION
  NOTIFICATIONS: "/users/announcements",

  // MEMBERSHIP INFORMATION
  GET_MEMBERSHIP_INFORMATION: "/users/profile/me",
  UPDATE_MEMBERSHIP_INFORMATION: "/users/profile/update",
  MEMBERSHIP_CANCELLATIONS: "/users/membership_cancellations",

  // EMAIL CHANGE
  EMAIL_CHANGE_REQUESTS: "/users/email_change_requests",
  // PAYMENT
  USER_STRIPE: "/users/registrations",
  MEMBER_PLAN: "/users/member_plans",
};

export class Api {
  static readonly users = "/users";
  static readonly reservations = "/reservations";
  static readonly louge_reservations = `${this.users}${this.reservations}`;
  static lougeReservationDetail(id: string): string {
    return `${this.louge_reservations}/${id}`;
  }
  static lougeReservations(page: number = 1): string {
    return `${this.louge_reservations}?page=${page}&per_page=3`;
  }
}

export const ZIP_API_URL = "https://postcode.teraren.com/postcodes/";
