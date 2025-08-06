import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};
