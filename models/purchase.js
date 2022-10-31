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
    method: {
        type:String , required: true} ,
    Available: {
        type: Boolean , required: true} ,
    commission:{
        type:Number
    }
},
    {
        timestamps: true,
        versionKey: false,
    })
module.exports = model('purchase', purchase);
