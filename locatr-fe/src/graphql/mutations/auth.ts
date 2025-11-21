import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($email: String!, $username: String!, $password: String!) {
    register(email: $email, username: $username, password: $password) {
      user {
        id
        email
        username
        createdAt
      }
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        username
        createdAt
      }
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken
  }
`;
