// start with npm init -y

/*
    1. Import express & Morgan, set up app variable
*/
// npm i express
// import the express module
const express = require("express")

// import the morgan module
// logger - common name for any tool that logs information
const logger = require("morgan")

// create an express application
const app = express()


/*
    2. Set up middleware to read requests better
*/
// npm i morgan

//morgan will provide logs to our terminal based on the incoming requests

// app.use() - let's us run middleware functions
// logger("dev") - our logging tool 
// we are defining which version of morgan we want to use here with "dev" we are indicating the developer version
// our logger in action: GET / 200 4.113 ms - 49
app.use(logger("dev"))

// middleware that parses (aka formats) incoming JSON data from the request body (REQUIRED!!!!!) 
// w/o it our request body will be undefined regardless of if we are sending data or not
app.use(express.json())

app.get("/", (request, response) => {
    response.json({user: "expressUser200", language: "JavaScript"})
})

/*

CRUD APP   REST API OPERATIONS
Create          POST
Read            GET
Update          PUT
Delete          DELETE


*/




/*
    3. Set up local data to work with
*/
// array of pokemon objects
let pokeData = [
  {
    id: 1,
    name: "pikachu",
    type: "electric",
    pokedex: 25,
  },
  {
    id: 2,
    name: "bulbasaur",
    type: "grass",
    pokedex: 1,
  },
];

/*
    4. Handle get requests to localhost:3000/pokemons
*/

app.get("/pokemon", ((request, response) => {
    response.json({
        message: "success",
        payload: pokeData
    })
}))


/*
    5. Set up the ability to query for a specific item in the data set
  */
// 5a. Set up for if the client requested a pokemon with a query

// 5b. Use .find to search for the pokemon in the data

// 5c. If the pokemon isn't found it will be undefined, send back a failure message

// 5d. if the pokemon IS found, send back a success message, with the pokemon that was found

// 4a. respond with the entire pokeData object if you DON'T input pokemon

/*
    6. Handle post requests to localhost:3000/pokemons
*/

// POST - creat data
// we can also call the route "/pokemon" because there is no potential conflict between GET and POST (and all the other methods!)
app.post("/pokemon", (request, response) => {

    // data from POST request is located in the body
    // console.log(request.body)

    // modify our post route to prevent duplicate pokemon

    // how do we figure out if we have a duplicate pokemon (no 2 pokemon of the same name allowed in our data)

    // .find() -- can search by object property which you CAN'T do with includes
    // .find() -- search for an object in your array by property
    // for example, we can check our pokemon objects based on their name

    const foundPokemon = pokeData.find((pokemon) => {
        // check if pokemon has the same name as the name from the incoming data
        // incoming data: request.body
        return request.body.name === pokemon.name
    })

    // console.log(foundPokemon)

    // if not found, there is no duplicate!
    // we can add new pokemon to the array
    if(!foundPokemon) {
        //if find comes back undefined (it is not already in our array), add the pokemon (our request.body) to our array
        pokeData.push(request.body)

        response.json({
            message: "success",
            payload: request.body
        })
    // account for if the pokemon is already in our array
    } else {
        response.status(500).json({
            message: "failure",
            payload: "Error - Pokemon already exists"
        })
    }
})

/*
    7. Handle patch requests to localhost:3000/pokemons/:name
*/

/*
    8. Handle delete requests to localhost:3000/pokemons/:name
*/

/*
    9. Handle any unhandled URL extensions as an error
*/

/*
    4b. Set up PORT and begin listening to requests
*/
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is now listening on Port: ${PORT}`)
})

