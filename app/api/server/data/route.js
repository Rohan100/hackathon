import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try{

        const data = await prisma.crime.findMany();
        console.log(data)
        return Response.json(data )
    }catch(err){
        console.log(err)
        return Response.json({"msg":"server error"}).status(500)
    }
    
}

