import React from "react";
import { Mutation } from "react-apollo";
import { CREATE_MEDIA_ITEM, CreateMediaItem } from "../../graphql/createMediaItem";
import { File } from "../../graphql/types";
import { Form } from "../Form";

interface UploadFormState {
  errorMessage?: string;
  successMessage?: string;
}

export const UploadForm = class extends React.Component<{}, UploadFormState> {
  readonly state: UploadFormState = {};

  onSubmit = (createMediaItem: CreateMediaItem) => async (fields: {
    key: string;
    file: File;
  }) => {
    const res = await createMediaItem({
      variables: fields
    });
    if (!res) return;
    if (res.errors) {
      this.setState({
        errorMessage: res.errors.map(e =>
          typeof(e.message) === "string" ? e.message : (e.message as any).message
        ).join("\n")
      });
    } else if (res.data) {
      this.setState({
        errorMessage: undefined,
        successMessage: "Uploaded successfully."
      });
    }
  };

  render() {
    return (
      <Mutation mutation={CREATE_MEDIA_ITEM}>
        {createMediaItem => (
          <Form
            successMessage={this.state.successMessage}
            errorMessage={this.state.errorMessage}
            fields={{
              key: {
                isRequired: true,
                placeholder: "Key"
              },
              file: {
                isRequired: true,
                type: "file"
              }
            }}
            onSubmit={this.onSubmit(createMediaItem)}
          />
        )}
      </Mutation>
    );
  }
};
