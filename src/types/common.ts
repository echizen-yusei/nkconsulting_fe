import { useTranslations } from "next-intl";

export type ErrorType = {
  bad_request?: string;
  unauthorized?: string;
  forbidden?: string;
  internal_server_error?: string;
  not_found?: string;
  validate?: string;
};

export interface PaginationQuery {
  page: number;
  per_page: number;
}

export type PaginationResponseType = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type TranslationsType = ReturnType<typeof useTranslations>;
