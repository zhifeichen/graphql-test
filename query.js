const G = require('graphql');
const db = require('./mongodb');
const moment = require('moment');

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

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        building: {
            type: GraphQLString
        },
        coord: {
            type: new GraphQLList(GraphQLFloat)
        },
        street: {
            type: GraphQLString
        },
        zipcode: {
            type: GraphQLString
        }
    })
});

const GradeType = new GraphQLObjectType({
    name: 'Grade',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        date: {
            type: GraphQLString,
            resolve(root) {
                console.log('date: ', arguments);
                return new moment(root.date).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
            }
        },
        grade: {
            type: GraphQLString
        },
        score: {
            type: GraphQLInt
        }
    })
});

const RestaurantType = new GraphQLObjectType({
    name: 'Restaurant',
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        address: {
            type: AddressType
        },
        borough: {
            type: GraphQLString
        },
        cuisine: {
            type: GraphQLString
        },
        grades: {
            type: new GraphQLList(GradeType)
        },
        name: {
            type: GraphQLString
        },
        restaurant_id: {
            type: GraphQLString
        }
    })
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        restaurant: {
            type: RestaurantType,
            args: {
              restaurant_id: {
                  type: new GraphQLNonNull(GraphQLString)
              }
            },
            resolve(root, args, cond) {
                console.log(arguments);
                if(db.findOne){
                    console.log('finding...');
                    let c = {}; // Object.assign({}, cond);
                    if(args.restaurant_id){
                        Object.assign(c, {'restaurant_id': args.restaurant_id});
                    }
                    const res = db.findOne(c);
                    return res;
                }else{
                    console.error("no db?!!!");
                    return {
                        id: "123",
                        building: "1007",
                        coord: [-73.856077, 40.848447],
                        street: "Morris Park Ave",
                        zipcode: "10462"
                    }
                }
            }
        }
    })
});

module.exports = Query;
