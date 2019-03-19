import { Grid } from "@material-ui/core";
import React from "react";
import { Config } from "../Config";

export class MediaScene extends React.Component {
  render() {
    return (
      <Grid container>
        <form encType="multipart/form-data" action={Config.apiUrl + "/media"} method="POST">
          <input type="text" name="key" placeholder="Key" />
          <input type="file" name="file" />
          <input type="submit" />
        </form>
      </Grid>
    );
  }
}
