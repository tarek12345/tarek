
const { check, oneOf, validationResult } = require('express-validator');
const Users = require("../Models/Users");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");


// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name is required" });
    return;
  }
  if (!req.body.email) {
    res.status(400).send({ message: "Email is required" });
    return;
  }
  if (!req.body.poste) {
    res.status(400).send({ message: "Poste is required" });
    return;

  } if (!req.body.role) {
    res.status(400).send({ message: "Role is required" });
    return;

  }
  if (!req.body.jour) {
    res.status(400).send({ message: "jour is required" });
    return;

  }
  if (!req.body.sexe) {
    res.status(400).send({ message: "Sex is required" });
    return;
  }
  check(req.body.email).isEmail()

  if (!req.body.password) {
    res.status(400).send({ message: "Email is required" });
    return;
  }


  // Create a User
  const User = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    poste: req.body.poste,
    sexe: req.body.sexe,
    jour: req.body.jour,
    role: req.body.role

  };

  //hashing password 
  const salt = process.env.SALT;
  // now we set user password to hashed password
  User.password = await bcrypt.hash(User.password, salt);


  // Save User in the database
  try {
    const user = await Users.create(User)
    if (user) {

      res.status(201).send({
        user:
          user
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

// Find all published Tutorials
exports.get = async (req, res) => {

  try {
    const user = await Users.find()
    if (user) {

      res.status(200).send({
        data:
          user
      });
    }

  } catch (error) {

    return res.status(403).send({
      message:
        error.message || "Some error occurred while creating the User."
    });


  }

}
// Delete a user by ID
exports.delete = (req, res) => {
  const id = req.params.id;
  Users.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(403).send({
        message: "Could not delete User with id=" + id
      });
    });
};
//Fin  Delete a user by ID


//filer liste User //

exports.filterUser = async (req, res, next) => {

  const search = req.body.search;


  try {
    await Users.find(

    )
      .then((user) => {

        const filter = user.filter(
          (item) => {
            if (
              item.name?.toLowerCase().includes(search.toLowerCase()) ||
              item.email?.toLowerCase().includes(search.toLowerCase()) ||
              item.poste?.toLowerCase().includes(search.toLowerCase()) ||
              item.sexe?.toLowerCase().includes(search.toLowerCase()) ||
              item._id == search) {
              return item
            }

          });

        if (filter.length > 0) {
          return res.status(200).json({
            data: filter,
            message: "liste des users",
          });
        } else {
          return res.status(404).json({

            message: "liste des users est vide",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({
          message: err,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err,
    });
  }
};
//fin filer liste User //
exports.resetPassword = async (req, res) => {

  const { email, newPassword } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//update  User //
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

};
// fin update  User //



