const users = require("../Controllers/UsersController");
// const auth = require("../Controllers/AuhtController");
module.exports = (app) => {
  var router = require("express").Router();

  router.get("/get", users.get);
  // Create a new User
  router.post("/create", users.create);
  // filter  User
  router.post("/filter", users.filterUser);
  // Update a Users
  router.delete("/delete/:id", users.delete);
  //  // Retrieve all Users
  //   router.get("/", users.findAll);
  //   // Retrieve a single Users with id
  router.post("/reset-password", users.resetPassword);
  //   // Update a Users with id
    router.post("/update/:id", users.updateUser);
  //   // Delete a Users with id
  //   router.delete("/:id", users.delete);

  app.use("/api/users", router);
};
