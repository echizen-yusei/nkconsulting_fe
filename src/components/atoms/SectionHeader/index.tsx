type SectionHeaderProps = {
  title: string;
  className?: string;
  textStyle?: string;
  titleClassName?: string;
};

const SectionHeader = ({ title, className, textStyle, titleClassName }: SectionHeaderProps) => {
  return (
    <div className={`border-red-primary pointer-events-auto flex items-center border-l-8 ${className ?? ""}`}>
      <h2 className={`${textStyle ?? "heading-2-36"} text-cream ml-2 md:ml-4 ${titleClassName ?? ""}`}>{title}</h2>
    </div>
  );
};

export default SectionHeader;
