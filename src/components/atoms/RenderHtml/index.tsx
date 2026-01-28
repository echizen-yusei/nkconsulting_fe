type RenderHtmlProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  className?: string;
};
const RenderHtml = ({ content, className = "" }: RenderHtmlProps) => {
  return <div className={`html-content ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default RenderHtml;
