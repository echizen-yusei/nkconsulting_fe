import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType?: "primary" | "secondary" | "outline" | "underline" | "white";
  isDisabled?: boolean;
  isBorderNoneSP?: boolean;
  textColor?: string;
  tooltip?: string;
}

const Button = ({
  children,
  buttonType = "secondary",
  className,
  isDisabled = false,
  isBorderNoneSP = true,
  textColor = "text-cream",
  tooltip,
  ...props
}: ButtonProps) => {
  const buttonTypeClass = {
    secondary: `bg-red-primary text-cream border-red-primary px-6 md:py-4 py-[23px] rounded-md ${
      isDisabled ? "button-secondary-disabled" : "button-secondary cursor-pointer"
    }`,
    primary: `bg-cream bg-secondary text-black-custom px-6 py-4 rounded-md ${isDisabled ? "button-primary-disabled" : "button-primary cursor-pointer"}`,
    outline: `bg-cream text-primary border-4 ${isBorderNoneSP ? "border-outline-button-none-sp" : "border-outline-button"} px-6 py-[19px] md:py-3 rounded-md cursor-pointer ${isDisabled ? "button-outline-disabled" : "button-outline cursor-pointer"}`,
    underline: `${textColor} text-1 pointer-events-auto inline underline hover:opacity-70 cursor-pointer ${isDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"} ${className}`,
    white: `text-primary border-none px-6 py-[23px] md:py-4 rounded-md ${isDisabled ? "bg-[#BBBBBB]  cursor-not-allowed" : "button-outline cursor-pointer bg-cream cursor-pointer"}`,
  };

  const shouldShowTooltip = isDisabled && tooltip;

  return (
    <>
      {shouldShowTooltip ? (
        <div className={`group relative ${buttonType === "underline" ? "inline-block" : "w-full"}`}>
          <button className={`${buttonTypeClass[buttonType]} ${className} font-noto-serif-jp`} disabled={isDisabled} {...props}>
            {children}
          </button>
          {shouldShowTooltip && (
            <div className="bg-gray333 text-cream pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform rounded-md px-3 py-2 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {tooltip}
              <div className="border-t-gray333 absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"></div>
            </div>
          )}
        </div>
      ) : (
        <button className={`${buttonTypeClass[buttonType]} ${className} font-noto-serif-jp`} disabled={isDisabled} {...props}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
