import House from '../models/House.js'
import Land from '../models/Land.js';


import  { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const createAd = async (req,res)=>{

const {type} = req.body
const userId = req.userId



try {
    
if(type==="house"){

   //  expression for req.body
const { images, status, price, bedrooms, bathrooms, surface, address, garages, yearBuilt } = req.body;
const house = await House.create({
    images,status,  price, owner: userId, bedrooms, bathrooms, surface, address, garages, yearBuilt

})
res.status(201).json({message : "ad created succefuly",house})
    
}else if(type==="land"){

   // Destructuring expression for req.body
// Destructuring expression for req.body
const { images, status, price,  surface, address, yearBuilt } = req.body;
   const land = await Land.create({
    images, status, price, owner: userId, surface, address, yearBuilt
   
   })
   res.status(201).json({message : "ad created succefuly",land})
    
   
    
}

} catch (error) {
    console.log(error,{message : `error while creating the ${type} ad`})
    res.status(500).json({error : "internal server error"})
}


}