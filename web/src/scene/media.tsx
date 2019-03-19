import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { ContentList } from "../component/media/ContentList";
import { UploadForm } from "../component/media/UploadForm";

interface MediaSceneState {
  isExpanded: { [key in "content" | "upload"]: boolean };
}

export class MediaScene extends React.Component<{}, MediaSceneState> {
  readonly state: MediaSceneState = {
    isExpanded: {
      content: true,
      upload: false
    }
  };

  toggleExpansion = (key: keyof MediaSceneState["isExpanded"]) => () => {
    this.setState({
      isExpanded: {
        ...this.state.isExpanded,
        [key]: !this.state.isExpanded[key]
      }
    });
  };

  render() {
    return (
      <Fragment>
        <ExpansionPanel expanded={this.state.isExpanded.upload}>
          <ExpansionPanelSummary onClick={this.toggleExpansion("upload")}>
            <Typography variant="subtitle1">Upload</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ display: "block" }}>
            <UploadForm />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <div style={{ paddingTop: "1em" }}>
          <ContentList />
        </div>
      </Fragment>
    );
  }
}
