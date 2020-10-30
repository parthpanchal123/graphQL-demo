const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");
const { authors, books } = require("./sampleData");
const app = express();
const port = process.env.PORT || 8080;

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },

    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is a book written by an author",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    // * Fetch a single book by id
    book: {
      type: BookType,
      description: " A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => books.find((book) => book.id === args.id),
    },

    // * Fetch a single author by id
    author: {
      type: AuthorType,
      description: " A Single Author ",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => authors.find((author) => author.id === args.id),
    },

    // * Fetch all books
    books: {
      type: new GraphQLList(BookType),
      description: "List of all Books",
      resolve: () => books,
    },
    // * Fetch all authors
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation",
  fields: () => ({
    // * Add a book
    addBook: {
      type: BookType,
      description: "Add a new book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const newBook = {
          id: books.length + 1,
          authorId: args.authorId,
          name: args.name,
        };

        books.push(newBook);
        return newBook;
      },
    },

    // * Add an AUthor
    addAuthor: {
      type: AuthorType,
      description: "Add a new author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const newAuthor = {
          id: authors.length + 1,
          name: args.name,
        };

        authors.push(newAuthor);
        return newAuthor;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphQL",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.get("/", (req, res) => {
  res.send(JSON.stringify(authors));
});

app.listen(port, () => {
  console.log("Example app listening on port : ", port);
});
