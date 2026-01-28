import MemberInfoProvider from "@/components/providers/MemberInfoProvider";

export default async function MembershipInformationLayout({ children }: { children: React.ReactNode }) {
  return <MemberInfoProvider>{children}</MemberInfoProvider>;
}
