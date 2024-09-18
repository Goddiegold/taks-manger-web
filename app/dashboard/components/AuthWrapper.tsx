


import { userToken } from "@/app/utils/helper";
import React from "react";   

interface AuthWrapperProps {
  children: React.ReactNode | React.ReactNode[];
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
}) => {
  const token = userToken()
  if (token) {
    return <>{children}</>;
  } else {
    // return <Navigate to={"/login"} />
  }
};

export default AuthWrapper;
