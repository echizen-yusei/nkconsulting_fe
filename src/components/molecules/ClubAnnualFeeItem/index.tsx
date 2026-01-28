"use client";

type ClubAnnualFeeItemProps = {
  title: string;
  price: string;
  subPrice: string;
  list: string[];
  borderBottomColor: string;
};

const ClubAnnualFeeItem = ({ title, price, subPrice, list, borderBottomColor }: ClubAnnualFeeItemProps) => {
  return (
    <div className={`min-w-[250px] flex-1 rounded-md py-6 md:h-[332px] ${borderBottomColor} border-gradient-black flex shrink-0 flex-col items-center`}>
      <h2 className="heading-3-30 text-cream text-center">{title}</h2>
      <p className="text-cream heading-4 mt-6 text-center whitespace-pre-line">{price}</p>
      <p className="text-cream text-2 mt-2 text-center whitespace-pre-line">{subPrice}</p>
      <ul className="mt-6 list-inside list-disc text-left">
        {list.map((item) => (
          <li key={item} className="text-cream text-1 text-left wrap-break-word whitespace-pre-wrap" style={{ tabSize: 4 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClubAnnualFeeItem;
