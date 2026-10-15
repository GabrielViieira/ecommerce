import createApp from "./app"
import { connectDB } from "./config/db"

const port = 3000
const server = createApp()


const StartServer = async () =>{
    try{
        await connectDB()

        server.listen(port, () =>{
            console.log(`Servidor iniciado na porta: ${port}` )
        })
    }catch (err){
        console.log(`Não foi possivel iniciar, erro em questao: ${err}`)
    }
}

StartServer()