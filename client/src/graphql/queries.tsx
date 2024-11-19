import { gql } from '@apollo/client';

export const GET_USER = gql`
    query getUser {
        getUser {
            id
            username
            email
        }
    }
`;

export const GET_USER_BOOKS = gql`
    query getUserBooks {
        getUserBooks {
            id
            title
            author
            description
        }
    }
`;