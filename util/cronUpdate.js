const Purchase = require('../models/purchase')


const ubdateSuscriptcion = async () =>{
    const today = new Date()
    const purchase = await Purchase.find({Available : true})
    purchase.forEach( async (e) =>{
        const date = new Date(`"${e.createdAt}"`)
        const rest = (today.getTime() - date.getTime()) / (1000*60*60*24)
        if(rest >= 30){
            await Purchase.updateOne({_id : e._id},{$set : {Available : false}})
        }
    })
}

// const pruebaCron = async () =>{
//     const purchases = await Purchase.find({Available : true})
//     const today = new Date()
//     purchases.forEach( async (e) =>{
//         const date = new Date(`"${e.createdAt}"`)
//         const rest = (today.getTime() - date.getTime()) / (1000*60*60*24)
//         console.log(rest)
//         if(rest >= 0.12){
//             await Purchase.updateOne({_id : e._id},{$set : {Available : false}})
//             console.log(`id : ${e._id} -- modificado`)
//         } 
//     })
// }

module.exports = { ubdateSuscriptcion }