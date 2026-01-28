type TagProps = {
  text: string;
  className?: string;
};
const Tag = ({ text, className }: TagProps) => {
  return (
    <div className={`bg-red-primary max-w-[100px] p-[4px] ${className ?? ""}`}>
      <p className="text-3 text-cream truncate-3 break-all whitespace-pre-wrap">{text}</p>
    </div>
  );
};

export default Tag;
