// implement your API here

//Step 1 - import express from 'express'
const express = require("express")

const Users = require("./data/db.js") //new line

const server = express()

//Step 2 -  teaches express how to read JSON from the body
server.use(express.json()) //needed for POST and PUT/PATCH

//Step 4 - Add a user with a POST REQUEST
server.post(`/api/users`, (req, res) => {
  //axios.post(url, data, options) the data will be in the body of the request
  const users = req.body
  // validate the data, and if the data is valid save it
  Users.insert(users)
    .then(user =>
      users.name && users.bio
        ? res.status(201).json(user)
        : res
            .status(400)
            .json({ errorMessage: "Please provide name and bio for the user." })
    )
    .catch(err =>
      !users.name || !users.bio
        ? res
            .status(400)
            .json({ errorMessage: "Please provide name and bio for the user." })
        : res.status(500).json({
            errorMessage:
              "There was an error while saving the user to the database"
          })
    )
})

// end of POST REQUEST to Add user

// Step 4a - view a list of users with a GET REQUEST
server.get(`/api/users`, (req, res) => {
  // go and get the info from the database
  Users.find()
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved." })
    })
  res.status(200)
})
// End of GET request to get all users

// Step 4b - GET REQUEST that returns the user object with the specified id.
server.get(`/api/users/:id`, (req, res) => {
  const { id } = req.params

  Users.findById(id)
    .then(user => {
      !user
        ? res.status(404).json({
            message: "The user with the specified ID does not exist."
          })
        : res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved" })
    })
})

// Step 4c - Delete user by id
server.delete(`/api/users/:id`, (req, res) => {
  const { id } = req.params

  Users.remove(id)
    .then(user => {
      !user
        ? res.status(404).json({
            message: "The user with the specified ID does not exist."
          })
        : res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved" })
    })
})
// DELETE by id end

// UPDATE  user
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body

  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide a username and bio" })
  } else {
    Users.update(id, req.body)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: "No user by that ID located" })
        } else {
          res.status(200).json(user)
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ errorMessage: "User info could not be modified." })
      })
  }
})

//Step 3 - Set up port to listen
const port = 5000
server.listen(port, () => console.log(`\n** API on port ${port} \n`))
