const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
const app = express();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({
      message: { type: GraphQLString, resolve: () => "Hello World" },
    }),
  }),
});

const port = process.env.PORT || 8080;

app.use(
  "/graphQL",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Example app listening on port : ", port);
});
