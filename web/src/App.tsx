import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "typeface-open-sans";
import { UserState } from "./component";
import * as scenes from "./scenes";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: "Open Sans",
    caption: {
      fontSize: "14px"
    }
  }
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: UserState.token ? `Bearer ${UserState.token}` : ""
  }
}));

const client = new ApolloClient({
  link: authLink.concat(createHttpLink({
    uri: process.env.REACT_APP_API_URL || "http://localhost:8080/graphql"
  })),
  cache: new InMemoryCache()
});

export class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
        <MuiThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <Switch>
              {Object.values(scenes).map(component =>
                <Route key={component.route} exact path={component.route} component={component} />
              )}
            </Switch>
          </ApolloProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}
