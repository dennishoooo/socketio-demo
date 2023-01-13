import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import Chance from 'chance'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

type Message = {
    sender: string
    content: string
    createdAt: string
}

const chance = new Chance()
let users:any = {}
let messages:Message[] = []

io.on('connection', (socket)=>{
    console.log('user connected');
    users[socket.id] = {name:chance.name()}

    socket.on('chat message', msg => {
        console.log(msg);
        messages.push({sender:users[socket.id].name, content: msg, createdAt: new Date(Date.now()).toString()})
        io.emit('chat message', messages[messages.length -1])
    })

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
    
})

app.use(express.static('public'))

server.listen(8080,()=>{
    console.log('server connected');
    
})