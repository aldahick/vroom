import gql from "graphql-tag";

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
  user: {
    mediaItems: {
      id: number;
      key: string;
      mimeType: string;
      token: string;
    }[];
  }
};
