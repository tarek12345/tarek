const auth = require("../Controllers/AuhtController");

var router = require("express").Router();
module.exports = app => {

    
    // login User
    router.post("/login", auth.login);
    // router.get("/isAuth", auth.isAuthenticate);
  
   
    app.use('/api/auth', router);
  };