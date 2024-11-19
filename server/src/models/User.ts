import { Schema, model, Types, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

// import schema from Book.js
import bookSchema, { BookDocument } from './schemas/Book.js';
import { gql } from 'apollo-server-express';


export const typeDefs = gql`
  type Book {
    _id: ID!
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;


// export interface UserDocument extends Document {
//   _id: Types.ObjectId;
//   username: string;
//   email: string;
//   password: string;
//   savedBooks: BookDocument[];
//   validatePassword(password: string): Promise<boolean>;
//   bookCount: number;
// }

// const userSchema = new Schema<UserDocument>(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [/.+@.+\..+/, 'Must use a valid email address'],
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     // set savedBooks to be an array of data that adheres to the bookSchema
//     savedBooks: [bookSchema],
//   },
//   // set this to use virtual below
//   {
//     toJSON: {
//       virtuals: true,
//     },
//   }
// );
// // hash user password
// userSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('password')) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }

//   next();
// });

// // custom method to compare and validate password for logging in
// userSchema.methods.validatePassword = async function (password: string) {
//   return await bcrypt.compare(password, this.password);
// };

// // when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
// userSchema.virtual('bookCount').get(function () {
//   return this.savedBooks.length;
// });

// const User = model<UserDocument>('User', userSchema);

// export default User;
