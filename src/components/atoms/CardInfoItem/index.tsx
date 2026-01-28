const CardInfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="border-cream flex w-full items-start justify-between gap-8 border-b pb-1.5">
      <span className="heading-5-20 text-cream whitespace-nowrap">{label}</span>
      <span className="heading-5-20 text-cream break-all whitespace-pre-wrap">{value}</span>
    </div>
  );
};

export default CardInfoItem;
