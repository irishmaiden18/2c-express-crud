// npm i -- will install all dependencies listed in the package.json

// import the express module
const express = require("express")

// import the morgan module
const logger = require("morgan")

// create an express app
const app = express()

// import data
let ingredients = require("./data/index")

// set up middleware to better read requests

// logger tool
app.use(logger("dev"))

// parse (aka format) incoming JSON data from the request body
app.use(express.json())

// set up GET routes
app.get("/ingredients", (request, response) => {

    // create a type query that reads all available ingredients for ONE ingredient type
    if (request.query.type) {

        // get ingredient by its type using the request query
        const foundIngredientType = ingredients.find((ingredient) => {
            return request.query.type === ingredient.type
        })

        // if we find the ingredient type
        if (foundIngredientType) {
            // respond with the ingredient items of that type
            response.json({
                message: "success",
                payload: foundIngredientType.items
            })
        // if we don't find the ingredient type
        } else {
            // respond with an informative error message
            response.status(404).json({
                message: "railure",
                payload: "Ingredient type not found"
            })
        }
    // set up default route to return all ingredients
    } else{
        // send a success response with all ingredients
        response.json({
            message: "sucess",
            payload: ingredients
        })
    }
})

// Dynamic Parameters (alternative method to query parameters)
app.get('/ingredients/:type', (req, res) => {
  const foundIngredient = ingredients.find(ingredient => {
    return ingredient.type === req.params.type
  })

  if (foundIngredient) {
    res.json({ message: 'success', payload: foundIngredient })
  } else {
    res
      .status(404)
      .json({ message: 'failure', payload: 'Ingredient Not Found' })
  }
})

// set up POST route -- create a new ingredient type
app.post("/ingredients", (request, response) => {
    
    // make sure there is readable data coming in
    // if there is data
    if (request.body) {

        // check if the ingredient type is already in our ingredient list
        const foundIngredient = ingredients.find((ingredient) => {
            return request.body.type === ingredient.type
        })

        // if we didn't find the ingredient type
        if(!foundIngredient) {
            // add it to our ingredients array
            ingredients.push(request.body)

            // send a sucess response showing what was added
            response.json({
                message: "success",
                payload: request.body
            })
        // if the ingredient type is already in our list
        } else {
            response.status(500).json({
                message: "failure",
                payload: "Error - Ingredient type already exists"
            })
        }
    //if there is not readable data
    } else {
        // send an error response
        response.status(500).json({
            message: "failure",
            payload: "Data not present"
        })
    }
})

// set up the PUT route -- update the ingredients list for one ingredient type, by this we mean add a new ingredient item to an existing array
app.put("/ingredients/:type", (request, response) => {

    //get the type to update
    const type = request.params.type
    // console.log(type)

    // find an ingredient type in our ingredient that matches the one coming in for update
    const foundIngredient = ingredients.find((ingredient) => {
        return type === ingredient.type
    })

    // if the ingredient type coming in matches one in our list
    if(foundIngredient) {

        //add the incoming information to the items array for applicable type
        foundIngredient.items.push(request.body.item)

        response.json({
            message: "success",
            payload: foundIngredient
        })
    // if the ingredient type coming in DOES NOT match one in our list
    } else {
        // send an error response
        response.status(404).json({
            message: "failure",
            payload: "Ingredient type you are trying to update is NOT FOUND"
        })
    }
})

// set up a DELETE route -- delete an ingredient type, clearing that entire type as well as its associated array. Hint: Use Dynamic Parameters
app.delete("/ingredients/:type", (request, response) => {
    
    //get the type to delete
    const type = request.params.type

    // find an ingredient type in our ingredient that matches the one coming in for deletion
    const ingredientToDelete = ingredients.find((ingredient) => {
        return type === ingredient.type
    })

    // if the ingredient type to delete is found
    if (ingredientToDelete) {

        // create a new array that has only the ingredients we are not deleting
        let results = ingredients.filter((ingredient) => {
            return type !== ingredient.type
        })

        // reassign our ingredients array to the new array we just created
        ingredients = results

        //send response with the complete updated ingredients list
        response.json({
            message: "success",
            payload: `${type} successfully deleted!`
        })

    // if the ingredient type to delete is not found
    } else  {
        response.status(404).json({
            message: "failure",
            payload: `Ingredient with type ${type} NOT FOUND! CANNOT DELETE!`
        })
    }
})

// set up a partial DELETE route -- delete a single ingredient (not an entire type) (Hint: Use Dynamic Parameters to know which ingredient to remove, and optionally a Query Parameter or second Dynamic Parameter to narrow down which ingredient type it's in)
app.delete("/ingredients/:type/:item", (request, response) => {

    // get the type the item to delete is part of
    const type = request.params.type

    // get the item to be deleted
    const item = request.params.item

    // find an ingredient type in our ingredient that matches the one coming in
    const ingredientTypeToChange = ingredients.find((ingredient) => {
        return type === ingredient.type
    })

    // if the ingredient type is found
    if (ingredientTypeToChange) {

        // find the specific ingredient to delete in the type array that matches the one coming in
        const ingredientToDelete = ingredientTypeToChange.items.find((ingredient) => {
            return item === ingredient
        })

        // if the specific ingredient we want to delete is found
        if (ingredientToDelete) {

            // create a results array with all the items that are not the item we want to delete
            const results = ingredientTypeToChange.items.filter((ingredient) => {
                return item !== ingredient
            })

            // re-assign the item array for the type we are deleting from to the results array
            ingredientTypeToChange.items = results

            // send response of completed updated ingredient list
            response.json({
                message: "success",
                payload: ingredients
            })

        // if the specific ingredient we want to delete is NOT found    
        } else {

            //send an error response
            response.status(404).json({
                message: "failure",
                payload: `Ingredient with ${item} NOT FOUND! CANNOT DELETE!`
            })    
        }

    // if the ingredient type is not found
    } else  {

        //send an error response
        response.status(404).json({
            message: "failure",
            payload: `Ingredient with type ${type} NOT FOUND! CANNOT DELETE!`
        })
    }
})

// set the port to listen on
const PORT = 3000

// begin sistening to requests
app.listen(PORT, () => {
    console.log(`Server is now listening on Port: ${PORT}`)
})
