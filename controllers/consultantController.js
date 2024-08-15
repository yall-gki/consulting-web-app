import  { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const getClientInterractions = async(req,res)=>{
const user = req.user
try {
    const interactions = await prisma.consultant.findUnique(
        {
            where: {
                id : user.id
            },
            include:{
                interactions
            }
        }



    )
    res.status(200).json({interactions})





} catch (error) {
       res.status(401).json(error);
}





}

const startInterraction  = async(req,res)=>{
const user = req.user

try {
    
} catch (error) {
    
}





}

export  {getClientInterractions, startInterraction, endInterraction}