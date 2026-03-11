const express = require("express");
const app = express();

// app.use() - using middleware functions
// middleware functions occur BEFORE our routes get hit (in the MIDDLE of a request being received by our server and hitting its respective API route)
app.use((request, response, next) => {
  console.log(request.headers); //information about the request (request metadata)
  next(); // move to the next function
});

app.use((request, response, next) => {
  request.chance = Math.random() * 10; // adding a new property to our request object
  console.log(request.chance);
  next(); // move to the next function
});

app.get("/", (request, response) => {
  response.json({
    chance: request.chance,
  });
});

app.listen(3000);
