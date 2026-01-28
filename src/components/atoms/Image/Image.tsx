import Image, { ImageProps } from "next/image";

type ImageCustomProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
} & ImageProps;

const ImageCustom = ({ src, alt, width, height, ...props }: ImageCustomProps) => {
  return <Image src={src} alt={alt} width={width} height={height} {...props} />;
};
export default ImageCustom;
