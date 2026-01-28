import { PaginationQuery, PaginationResponseType } from "./common";

export type NotificationInfo = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  unread: boolean;
  tag: string;
};

export type NotificationDetailInfo = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  unread: boolean;
  tag: string;
};

export type NotificationRequestType = PaginationQuery;

export type NotificationResponseType = {
  announcements: NotificationInfo[];
  pagination: PaginationResponseType;
};
