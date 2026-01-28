import Banner from "@/components/organisms/home/Banner";
import ClubAnnualFee from "@/components/organisms/home/ClubAnnualFee";
import MemberBenefits from "@/components/organisms/home/MemberBenefits";
// import MembershipFees from "@/components/organisms/home/MembershipFees";
import MembershipRegistrationProcess from "@/components/organisms/home/MembershipRegistrationProcess";
import VisitWebsite from "@/components/organisms/home/VisitWebsite";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <div className="relative">
        <div className="relative">
          <div className="bg-gradient-custom absolute inset-0 z-[-1]"></div>
          <div className="mx-6 pt-16 md:mx-12 md:pt-30">
            <MemberBenefits />
          </div>
          <div className="mx-6 mt-16 pb-16 md:mx-12 md:mt-30 md:pb-30">
            <MembershipRegistrationProcess />
          </div>
        </div>
        <div className="mx-6 md:mx-12 md:pt-30">
          <ClubAnnualFee />
        </div>
        <div className="mt-16 md:mt-30">
          <VisitWebsite />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
