const { Schema, model } = require('mongoose');

const purchase = new Schema({
    userName:  {
        type:String , required: true},
    gallerieName: {
        type:String , required: true},
    queen: {
        type:String , required: true},
    price: {
        type:Number , required: true} ,
    Available: {
            type: Boolean , required: true} ,
},
    {
        timestamps: true,
        versionKey: false,
    })
module.exports = model('purchase', purchase);
