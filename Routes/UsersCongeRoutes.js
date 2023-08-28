const conges = require("../Controllers/UsersCongeController");
// const auth = require("../Controllers/AuhtController");
module.exports = (app) => {
  var router = require("express").Router();

  router.post("/create", conges.create);
  

  app.use("/api/conges", router);
};
