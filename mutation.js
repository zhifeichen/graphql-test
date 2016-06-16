const G = require('graphql');

const  {
    graphql,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} = G;

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        id: {
          type: GraphQLID,
          resolve: (value, args) => {
              return 0;
          }
        }
    })
});

module.exports = Mutation;
