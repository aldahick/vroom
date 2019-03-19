import { createStyles, Grid, MenuItem, Select, Typography, withStyles, WithStyles } from "@material-ui/core";
import _ from "lodash";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { GET_USER_MEDIA_ITEMS, GetUserMediaItemsResult } from "../../graphql/getUserMediaItems";
import { ContentView } from "./ContentView";

const styles = createStyles({

});

interface ContentListState {
  selected?: number;
}

export const ContentList = withStyles(styles)(class extends React.Component<WithStyles<typeof styles>, ContentListState> {
  readonly state: ContentListState = {};

  onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selected: Number(evt.target.value) });
  }

  render() {
    return (
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Grid container direction="column" alignItems="center">
            <Query<GetUserMediaItemsResult> query={GET_USER_MEDIA_ITEMS}>
              {({ data, error, loading }) => {
                if (loading) return <Typography>Loading...</Typography>;
                if (error || !data) {
                  return (
                    <Typography color="error">
                      {error ? error.message : "No data available."}
                    </Typography>
                  );
                }
                const mediaItems = _.sortBy(data.user.mediaItems, "key");
                if (mediaItems.length === 0) {
                  return <Typography color="error">No media items were found!</Typography>;
                }
                const selectedItem = mediaItems.find(i => i.id === this.state.selected);
                return (
                  <Fragment>
                    <Grid item xs={6} style={{ width: "50%" }}>
                      <Select fullWidth onChange={this.onChange} value={this.state.selected || mediaItems[0].id}>
                        {mediaItems.map(({ key, id }) =>
                          <MenuItem key={key} value={id}>{key}</MenuItem>
                        )}
                      </Select>
                    </Grid>
                    {selectedItem && <ContentView key={selectedItem.id} mimeType={selectedItem.mimeType} token={selectedItem.token} />}
                  </Fragment>
                );
              }}
            </Query>
          </Grid>
        </Grid>
      </Grid>
    );
  }
});
