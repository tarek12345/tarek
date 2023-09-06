const conges = require("../Controllers/UsersCongeController");
// const auth = require("../Controllers/AuhtController");
module.exports = (app) => {
  var router = require("express").Router();
  router.get("/get", conges.get)
  router.post("/create", conges.create);
  router.delete("/delete/:id", conges.delete);

  app.use("/api/conges", router);
};
