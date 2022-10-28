const Purchase = require('../models/purchase')


const ubdateSuscriptcion = async () =>{
    const today = new Date()
    const purchase = await Purchase.find({Available : true})
    purchase.forEach( async (e) =>{
        const date = new Date(`"${e.createdAt}"`)
        const rest = (today.getTime() - date.getTime()) / (1000*60*60*24)
        if(rest > 30){
            await Purchase.updateOne({_id : e._id},{$set : {Available : false}})
        }
    })
}

module.exports = { ubdateSuscriptcion }