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
  {
    id: 3,
    name: "ivysaur",
    type: "grass",
    pokedex: 2,
  },
  {
    id: 4,
    name: "venusaur",
    type: "grass",
    pokedex: 3,
  },
  {
    id: 5,
    name: "charmander",
    type: "fire",
    pokedex: 4,
  },
  {
    id: 6,
    name: "charmeleon",
    type: "fire",
    pokedex: 5,
  },
  {
    id: 7,
    name: "charizard",
    type: "fire",
    pokedex: 6,
  },
  {
    id: 8,
    name: "squirtle",
    type: "water",
    pokedex: 7,
  },
  {
    id: 9,
    name: "wartortle",
    type: "water",
    pokedex: 8,
  },
  {
    id: 10,
    name: "blastoise",
    type: "water",
    pokedex: 9,
  },
]

/*
    4. Handle get requests to localhost:3000/pokemons
*/

/* 
-modify get route to also deal with a "type" queryParameter (expl: ?type=fire)
make it so we only return pokemon of the specified type
no need to include an error if no pokemon match the type, just respond with an empty array

*/

app.get("/pokemon", (request, response) => {
    // Queries/Query Parameters
    // use key value pairs that we can attatch to the URL
    // ?key=value
    // very useful for filtering/sorting and searching
    // adding query parameters does NOT change the base URL
  
    // request.query.KEY
    // request.query.name - access the name key value
    // console.log(request.query.name)

    // check if our name query exists
    if(request.query.name) {
        // get pokemon by their name utilizing our request query
        const foundPokemon = pokeData.find((pokemon) => {
            return request.query.name === pokemon.name
        })

        if(foundPokemon){
            // if found, return the found pokemon
            response.json({ 
                message: "success", 
                payload: foundPokemon
            })
        } else {
            response.status(404).json({ 
                message: "failure", 
                payload: "Pokemon Not Found" 
            })
        }
    // section to check for types
    } else if(request.query.type) {

        const results = pokeData.filter((pokemon) => {
                // if the pokemon's type is qual to the given type, add it to the results array
                // !== strict does not equal, negative version of ===
                return request.query.type === pokemon.type
            })
        
        if (results) {
            response.json({
                message: "success",
                payload: results
            })
        } else {
            response.json({
                message: "failure",
                payload: []
            })
        }
    
    } else {
        response.json({
            message: "success",
            payload: pokeData,
        })
    }
})


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
    if (request.body) {
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
    } else {
        response.status(500).json({
            message: "failure",
            payload: "Data not present"
        })
    }
})

/*
    7. Handle put requests to localhost:3000/pokemons/:name
*/

// PUT - Update Existing Data
// given an id that corresponds to an existing pokemon,
// update the data of that pokemon
// where id is a dynamic parameter
app.put("/pokemon/:id", (request, response) => {
    // 1st goal: get the id for the pokemon to update from the user
    // console.log(request.params.id)
    // id: request.params.id
    // turn id to a number because it is a string and our id's in our data are numbers
    const id = Number(request.params.id)

    // 2nd goal: veryify that a pokemon with given id exists
    // .find() -- search for an object in your array by property
    // for example, we can check our pokemon objects based on their id
    const foundPokemon = pokeData.find((pokemon) => {
        return id === pokemon.id
    })

    // if pokemon is found
    if(foundPokemon) {
        // 3rd goal: update the existing pokemon
        // request.body - incoming data used to update existing object
        // Object.assign(targetObject, incomingObject)
        // targetObject - object we are trying to update
        // incomingObject - data from request.body
        // overwrite the properties of the targetObject with the properties of the incomingObject
        Object.assign(foundPokemon, request.body) 

        response.json({
            message: "success",
            payload: foundPokemon
        })
    // if pokemon is not found
    } else {
        response.status(404).json({ 
            message: "failure", 
            payload: "Pokemon to update NOT FOUND!"
        })
    }
    // response.json({})
})

/*
    8. Handle delete requests to localhost:3000/pokemons/:name
*/
//DELETE
// delete by id
app.delete("/pokemon/:id", (request, response) => {

    // 1st goal: get the id for the pokemon to delete from the user
    const id = Number(request.params.id)

    // 2nd goal: veryify that a pokemon with given id exists
    // .find() -- search for an object in your array by property
    // for example, we can check our pokemon objects based on their id
    const pokemonToDelete = pokeData.find((pokemon) => {
        return id === pokemon.id
    })

    // if pokemon is found
    if(pokemonToDelete) {
        // 3rd goal: delete the existing pokemon
        // use .filter and filter on id
        // every pokemon whose id is NOT the one we are looking for will remain in our data
        // but the one with the id we are looking for will be removed
        // create a results array to use with filter
        const results = pokeData.filter((pokemon) => {
            // if the pokemon's id DOES NOT equal the given id, add it to the results array
            // !== strict does not equal, negative version of ===
            return id !== pokemon.id
        })

        // update our existing pokeData array with our new results array
        // reassign pokeData to the result from our filter
        pokeData = results

        response.json({
            message: "success",
            payload: pokeData
        })
    // if pokemon is not found
    } else {
        response.status(404).json({ 
            message: "failure", 
            payload: `Pokemon with id: ${id} NOT FOUND! CANNOT DELETE!`
        })

    }

})

/*
    9. Handle any unhandled URL extensions as an error
*/

app.all("/{*any}", (request, response) => {
  response.status(404).json({ 
    message: "failure", 
    payload: "Route Not Found" });
});

/*
    4b. Set up PORT and begin listening to requests
*/
const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is now listening on Port: ${PORT}`)
})