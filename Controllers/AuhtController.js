const db = require("../Models/Users");
const { check, oneOf, validationResult } = require('express-validator');
const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


// Create and Save a new User
exports.login = async (req, res, next) => {
    /***************** Get request data ************/
    const email = req.body.email;
    const password = req.body.password;
  
    if (!req.body.email) {
      res.status(400).send({ message: "Email is required" });
      return;
    }
    if (!req.body.password) {
      res.status(400).send({ message: "Password is required" });
      return;
    }
    /***************** end Get request data ************/
 
    /***************** Check if user exists ************/
    const user = await Users.findOne({ email: email });
  
    if (!user) {
      return res.status(401).send({
        errors: [{ message: "Cet utilisateur est indisponible" }],
      });
    }
  
    /***************** end Check if user exists ************/
    /***************** Check if pass is valid ************/
    const salt = process.env.SALT;
    const plainTohash = await bcrypt.hash(password, salt);
    console.log("plainTohash",plainTohash)
    console.log("user.password",user.password)
    if (user.password !== user.password) {

      return res.status(401).send({
        errors: { message: "Mot de passe incorrect", status: false },
      });
  
    }
   
   
  
    /***************** Check if pass is valid ****************/
  
    /***************** Generate token for user ****************/
    const token = await jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });
  
    const refreshtoken = jwt.sign(
      { user, date: Date.now() },
      process.env.JWT_SECRET_KEY_REFRESH,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      }
    );
    res.cookie("Authorization ", token, {
      secure: true,
      httpOnly: true,
    });
    res.cookie("Refresh ", refreshtoken, {
      secure: true,
      httpOnly: true,
    });
  
    if (user) {
      // console.log(doc);

       
            return res.status(200).send({
              data: {
                message: "Vous êtes connecté 😊 👌",
                status: true,
                data: {
                  user: user,
                  token: token,
                  refreshtoken: refreshtoken,
                },
              },
            });
      

    } else {
      // console.log(error);
      return res.status(400).send({
        data: {
          message: "Error",
          status: false,
        },
      });
    }

  };





