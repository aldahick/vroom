import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserState } from "./UserState";

export const PrivateRoute: React.FunctionComponent<RouteProps> = ({ component, ...rest }) => {
  const Component = component as React.ComponentClass<any, any>;
  return (
    <Route
      {...rest}
      render={props => UserState.isAuthenticated
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: "/login",
            state: {
              from: props.location
            }
          }}
        />
      }
    />
  );
};
