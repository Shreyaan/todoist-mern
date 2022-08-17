import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import svg from "./Spinner-1s-200px.svg"

function PrivateRoutes({}) {
  const { auth } = useAuth();

  if (auth === undefined) return (<div style={{textAlign:"center"}}><img src={svg} alt="" /></div>)

  return auth === true ? <Outlet /> : <Navigate to="/auth" />;
}

export default PrivateRoutes;
