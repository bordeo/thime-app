import * as React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import { Member } from "../types/Member";

export type AuthContextProps = {
  authToken?: string;
  currentUser?: Member;
  onNewAuthToken: (authToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create a context wrapping the auth state
const AuthContext = React.createContext<AuthContextProps>({
  authToken: undefined,
  currentUser: undefined,
  onNewAuthToken: async authToken => {
    throw new Error("onReceivedAuthToken() not implemented");
  },
  logout: async () => {
    throw new Error("logout() not implemented");
  }
});

export function withAuthContext<P extends AuthContextProps>(
  Component: React.ComponentType<P>
) {
  const AuthContextComponent = function AuthContextComponent(
    props: Pick<P, Exclude<keyof P, keyof AuthContextProps>>
  ) {
    return (
      <AuthContext.Consumer>
        {authContextProps => <Component {...props} {...authContextProps} />}
      </AuthContext.Consumer>
    );
  };
  return hoistNonReactStatic(AuthContextComponent, Component);
}

export default AuthContext;
