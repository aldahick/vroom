import gql from "graphql-tag";
import { User } from "./types";

export const GET_USER_MEDIA_ITEMS = gql`
query GetUserMediaItemsWeb {
  user {
    mediaItems {
      id
      key
      mimeType
      token
    }
  }
}`;

export type GetUserMediaItemsResult = {
  user: Pick<User, "mediaItems">;
};
