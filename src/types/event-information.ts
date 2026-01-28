import { PaginationQuery, PaginationResponseType } from "./common";

export type EventResponseType = {
  event_informations: EventInfo[];
  pagination: PaginationResponseType;
};

export type EventInfo = {
  id: number;
  capacity: number;
  title: string;
  content: string;
  end_time: string;
  start_time: string;
  venue_name: string;
  target_date: string;
  excepted_number_of_participants: number;
  participant_fee: number;
  thumbnail: string;
};

export type EventDetailInfo = {
  id: number;
  capacity: number;
  thumbnail: string;
  target_date: string;
  title: string;
  end_time: string;
  start_time: string;
  venue_name: string;
  venue_address: string;
  venue_address_url: string;
  participant_fee: number;
  excepted_number_of_participants: number;
  plan_types: string[];
  content: string;
  status: string;
};

export type EventRequestType = PaginationQuery;
