import { createStyles, Typography, withStyles, WithStyles } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { Config } from "../../Config";

const styles = createStyles({

});

interface ContentViewProps {
  mimeType: string;
  token: string;
}

interface ContentViewState {
  data?: string;
  errorMessage?: string;
}

const TEXT_MIME_TYPES = ["text/html", "text/plain"];

export const ContentView = withStyles(styles)(class extends React.Component<ContentViewProps & WithStyles<typeof styles>, ContentViewState> {
  readonly state: ContentViewState = {};

  get contentUrl() {
    return Config.apiUrl + "/media/content?token=" + encodeURIComponent(this.props.token);
  }

  get isText() {
    return TEXT_MIME_TYPES.includes(this.props.mimeType);
  }

  async componentDidMount() {
    if (!this.isText) {
      return;
    }
    try {
      this.setState({
        data: await axios.get(this.contentUrl).then(r => r.data),
        errorMessage: undefined
      });
    } catch (err) {
      console.error(err);
      this.setState({ errorMessage: err.message });
    }
  }

  render() {
    if (this.state.errorMessage) {
      return <Typography color="error">{this.state.errorMessage}</Typography>;
    }
    const { mimeType } = this.props;
    switch (mimeType) {
      case "video/quicktime":
      case "video/mp4":
        return <video style={{ width: "100%" }} controls autoPlay src={this.contentUrl} />;
      case "audio/mp3":
        return <audio controls autoPlay src={this.contentUrl} />;
      case "image/png":
        return <img src={this.contentUrl} />;
    }
    if (this.isText) {
      if (!this.state.data) {
        return <Typography>Loading...</Typography>;
      }
      return <pre>{this.state.data}</pre>;
    }
    return <Typography color="error">Invalid MIME type {mimeType}.</Typography>;
  }
});
