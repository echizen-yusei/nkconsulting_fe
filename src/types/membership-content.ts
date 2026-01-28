export type ConsultingService = {
  id: number;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  isActive?: boolean;
};

export type MemberOnlyPost = {
  id: number;
  title: string;
  thumbnail: string;
  isActive?: boolean;
};

export type MemberOnlyPostDetail = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
};
