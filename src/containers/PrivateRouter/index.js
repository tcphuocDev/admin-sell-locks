import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { getProfile } from "../../redux/actions/auth.action";
import NotAuthorized from "../../components/NotAuthoried";
import { ROLE } from "../../common/common";

export default function PrivateRouter({
  component: Component,
  roles = [ROLE.ADMIN],
  ...rest
}) {
  const state = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (state.token) {
    if (
      (roles.length && !roles.includes(state?.user?.role)) ||
      state?.user?.isActive === 0
    )
      return <NotAuthorized />;
    return <Component {...rest} />;
  } else {
    return <Navigate to={"/?from=" + path} />;
  }
}
