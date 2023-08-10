const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({



    name: { type: String, required: [true, 'Name is required'] },
    role:{ type: String, required: [true, 'Role is required'] },
    poste: { type: String, required: [true, 'Poste is required'] },
    jour: { type: Number, required: [true, 'jour is required'] },
    sexe: { type: String, required: [true, 'Sexe is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'] },
    created: { type: Date, required: [true, 'Create date is required'], default: Date.now() },
    modified: { type: String },
   

});



module.exports = mongoose.model('Users', UserSchema);