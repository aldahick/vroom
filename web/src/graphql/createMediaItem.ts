import gql from "graphql-tag";
import { MutationFn } from "react-apollo";
import { MutationCreateMediaItemArgs } from "./types";

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

export type CreateMediaItem = MutationFn<{
  id: string;
}, MutationCreateMediaItemArgs>;
