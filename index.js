const G = require('graphql');
const Query = require('./query');
const Mutation = require('./mutation');

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

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

const queryString = `query Restaurant($id: String!){
    restaurant(restaurant_id: $id) {
        address {
            building,
            coord,
            street,
            zipcode
        },
        grades {
            date
        }
    }
}`;
graphql(Schema, queryString,
  {root: "root value"},
  {context: "context value"},
  {id: "30075445"},
  "Restaurant"
).then((result) => {
    console.log('result: ', JSON.stringify(result));

    graphql(Schema, `{
        restaurant(restaurant_id: "30112340") {
            address {
                building,
                coord,
                street,
                zipcode
            },
            grades {
                date
            }
        }
    }`, {root: "root value"})
    .then((result) => {
        console.log('result2: ', result.data.restaurant.address.coord);
    });
});

const express = require('express');
const session = require('express-session');
const graphqlHttp = require('express-graphql');
const bodyParser = require('body-parser')

const app = express();

// app.use(session({
//     secret: "anything you don't know"
// }) )

// use express-graphql
app.use('/graphql1', graphqlHttp({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

// use text/plain body paser to get query
app.use(bodyParser.text({ type: 'application/graphql'}));
app.use('/graphql', (req, res, next) => {
    console.log(Object.keys(req.body));
    if(Object.keys(req.body).length > 0){
        console.log(req.body);
        graphql(Schema, req.body)
            .then((result) => {
                res.send(result);
            })
    } else {
        next();
    }
})




const server = app.listen(8080, () => {
    console.log('Listening at port ', server.address().port);
})
