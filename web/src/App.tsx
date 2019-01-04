import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import ApolloClient from "apollo-boost";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "typeface-open-sans";
import * as scenes from "./scenes";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans",
    caption: {
      fontSize: "14px"
    }
  }
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL || "http://localhost:8080/graphql"
});

export class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
        <MuiThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <Switch>
              {Object.values(scenes).map(component =>
                <Route key={component.route} path={component.route} component={component} />
              )}
            </Switch>
          </ApolloProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}
