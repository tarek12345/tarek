const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: { type: String, required: [true, 'Name is required'] },
    description: { type: String, required: [true, 'description is required'] },
    datedebut: { type: Date},
    datefin: { type: Date},
    jour: { type: Number, required: [true, 'jour is required'] },
    created: { type: Date, required: [true, 'Create date is required'], default: Date.now() },
    modified: { type: String },
   

});



module.exports = mongoose.model('Conges', UserSchema);