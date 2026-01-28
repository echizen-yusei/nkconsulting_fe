import UserMemberOnlyDetailProvider from "@/components/providers/MemberOnlyDetailProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <UserMemberOnlyDetailProvider>{children}</UserMemberOnlyDetailProvider>;
}
