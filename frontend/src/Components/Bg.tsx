import React from "react";

interface BgProps {
  children: React.ReactNode;
}

const Bg: React.FC<BgProps> = ({ children }) => {
  return <div className="w-full h-full">{children}</div>;
};

export default Bg;
