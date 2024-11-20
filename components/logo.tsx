import React from "react";
import Image from "next/image";

const LOGO_PATH = "/images/logo.png";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xxs";
}

const sizeMap = {
  xxs: "w-4 h-4",
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export default function Logo({ size = "md" }: LogoProps) {
  return (
    <div className={`relative ${sizeMap[size]}`}>
      <Image src={LOGO_PATH} alt="Logo" fill className="object-contain" priority />
    </div>
  );
}
