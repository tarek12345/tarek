
const { check, oneOf, validationResult } = require('express-validator');
const Conges = require("../Models/CongeUsers");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

exports.get = async (req, res) => {

  try {
    const conge = await Conges.find()
    if (conge) {

      res.status(200).send({
        data:
        conge
      });
    }

  } catch (error) {

    return res.status(403).send({
      message:
        error.message || "Some error occurred while creating the conge."
    });


  }

}
exports.delete = (req, res) => {
  const id = req.params.id;
  Conges.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "Congé was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(403).send({
        message: "Could not delete Congé with id=" + id
      });
    });
};
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name is required" });
    return;
  }

  if (!req.body.jour) {
    res.status(400).send({ message: "jour is required" });
    return;

  }
  if (!req.body.description) {
    res.status(400).send({ message: "description is required" });
    return;

  }


  // Create a User
  const CongeUser = {
    name: req.body.name,
    jour: req.body.jour,
    datedebut: req.body.datedebut,
    datefin: req.body.datefin,
    description: req.body.description,


  };


  // Save User in the database
  try {
    const userconge = await Conges.create(CongeUser)
    if (userconge) {

      res.status(201).send({
        userconge:
        userconge
      });
    }

  } catch (error) {
    console.log("is : " + error)
    if (error.code === 11000) {

      return res.status(400).send({
        message:
          'This user is already exist'
      });

    } else {
      return res.status(403).send({
        message:
          error.message || "Some error occurred while creating the User."
      });


    }

  }
 

};