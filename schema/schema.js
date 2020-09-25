const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } = graphql

const Movies = require('../models/movie')
const Directors = require('../models/director')

// const directorsJson = [
//     {name: 'Quentin Tarantino', age: 55}, //5f68f121d79794824dbc6d16
//     {name: 'Christopher Nolan', age: 50}, //5f68f2fcd79794824dbc6d19
//     {name: 'James McTeigue', age: 51}, //5f68f344d79794824dbc6d1a
//     {name: 'Guy Ritchie', age: 50}, //5f68f372d79794824dbc6d1b
// ]

// const moviesJson = [
//     {name: 'Pulp Fiction', genre: 'Crime', directorId: 5f68f121d79794824dbc6d16 },
//     {name: 'Tenet', genre: 'Action, Sci-Fi, Drama, Thriller', directorId: 5f68f2fcd79794824dbc6d19},
//     {name: 'V for vendetta', genre: 'Sci-Fi-Thriller', directorId: 5f68f344d79794824dbc6d1a},
//     {name: '1984', genre: 'Sci-Fi', directorId: 5f68f344d79794824dbc6d1a},
//     {name: 'Snatch', genre: 'Crime-Comedy', directorId: 5f68f121d79794824dbc6d16},
//     {name: 'Reservoir Dogs', genre: 'Crime', directorId: 5f68f121d79794824dbc6d16 },
//     {name: 'The HatefulEight', genre: 'Crime', directorId: 5f68f121d79794824dbc6d16 },
//     {name: 'Inglourious Basterds', genre: 'Crime', directorId: 5f68f121d79794824dbc6d16 },
//     {name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime', directorId: 5f68f372d79794824dbc6d1b },
// ]

// const movies = [
//     {id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1'},
//     {id: '2', name: 'Tenet', genre: 'Action, Sci-Fi, Drama, Thriller', directorId: '2'},
//     {id: 3, name: 'V for vendetta', genre: 'Sci-Fi-Thriller', directorId: '3'},
//     {id: 4, name: '1984', genre: 'Sci-Fi', directorId: '2'},
//     {id: '1', name: 'Snatch', genre: 'Crime-Comedy', directorId: '1'},
//     {id: '1', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1'},
//     {id: '1', name: 'The HatefulEight', genre: 'Crime', directorId: '1'},
//     {id: '1', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1'},
//     {id: '1', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime', directorId: '4'},
// ]

// const directors = [
//     {id: '1', name: 'Quentin Tarantino', age: 55},
//     {id: '2', name: 'Christopher Nolan', age: 50},
//     {id: '3', name: 'James McTeigue', age: 51},
//     {id: '4', name: 'Guy Ritchie', age: 50},
// ]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args){
                // return directors.find(director => director.id === parent.id)
                return Directors.findById(parent.directorID)
            }
        }
    }),
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt},
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorID == parent.id)
                return Movies.find({directorID: parent.id})
            }
        }

    }),
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age
                })
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId
                })
                return movie.save()
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id)
            }

        },
        deleteMovie: {
            type: MovieType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id)
            }

        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id === args.id)
                return Movies.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id === args.id )
                return Directors.findById(args.id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies
                return Movies.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors
                return Directors.find({})
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation
})