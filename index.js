const Express= require('express');
const ExpressGraphQL =require('express-graphql');
const graphql=require('graphql');
const app= Express();
const Mongoose= require('mongoose');
const bodyparser= require('body-parser');
const Schema = Mongoose.Schema;

var http = require('http');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// var server= http.createServer(app);

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");


// Mongoose.connect("mongodb://localhost:27017/thepolyglotdeveloper");

Mongoose.connect("mongodb://localhost:27017/mernlogin",{useNewUrlParser:true})
.then(()=>console.log("Mongodb connected"))
.catch(err=>console.log(err))

const PersonModel = Mongoose.model("person",new Schema({
    firstname:{
        type:String
    },
    
    lastname:{
        type:String
    } 
}));

const PersonType = new GraphQLObjectType({
    name: "Person",
    fields: {
        id: { type: GraphQLID },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            people: {
                type: GraphQLList(PersonType),
                resolve: (root, args, context, info) => {
                    return PersonModel.find().exec();
                }
            },
            person: {
                type: PersonType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return PersonModel.findById(args.id).exec();
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
            person: {
                type: PersonType,
                args: {
                    firstname: { type: GraphQLNonNull(GraphQLString) },
                    lastname: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: (root, args, context, info) => {
                    var person = new PersonModel(args);
                    return person.save();
                }
            }
        }
    })
});


app.post('/login',function(req,res)
{
    
    console.log(req);
    var username= req.body.username;
    var password= req.body.password;
    console.log(username);
    console.log(password);
    // console.log("Shailesh");
    // resolve(username);
    res.status(200).json({'message':'Incorrect'});
})
app.use("/graphql", ExpressGraphQL({
    schema: schema,
    graphiql: true
}));

// app.get("/sfg",function(req,res)
// {
//     console.log("Shsfg");
// })

app.listen(3000, () => {
    console.log("Listening at 5000");
});

// server.listen(3000, '192.168.0.3');