import { ApolloError } from "apollo-client";
import { MutationFn } from "react-apollo";

export async function callMutation<Data, Variables>(mutation: MutationFn<Data, Variables>, variables: Variables): Promise<Data> {
  const res = await mutation({ variables });
  if (!res) {
    throw new ApolloError({
      errorMessage: "No response from mutation"
    });
  }
  if (res.errors || !res.data) {
    throw new ApolloError({
      graphQLErrors: res.errors,
    });
  }
  return res.data;
}
