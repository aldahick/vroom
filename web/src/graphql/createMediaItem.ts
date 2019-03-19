import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

export const CREATE_MEDIA_ITEM = gql`
mutation CreateMediaItemWeb(
  $key: String!,
  $data: String,
  $file: Upload
) {
  createMediaItem(key: $key, data: $data, file: $file) {
    id
  }
}`;

export type CreateMediaItemInput = {
  key: string;
  data?: string;
  file?: File;
};

export type CreateMediaItem = MutationFn<{
  id: string;
}, CreateMediaItemInput>;
