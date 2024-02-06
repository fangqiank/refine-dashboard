import gql from "graphql-tag"

export const UPDATE_USER_MUTATION = gql`
	mutation UpdateUser($input: updateOneUserInput!){
		updateOneUser(input: $input){
			id
      name
      avatarUrl
      email
      phone
      jobTitle
		}
	}
`