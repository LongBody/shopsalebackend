require('./mongoose-connect')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routers')
var cors = require('cors');


require('dotenv').config()

const app = express()

var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = 8888
app.use(cors());
// const router = require('./routers')

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses

app.use(router)

app.get('/', (req, res) => res.send("Hello"))

app.use((err, req, res, next) => {
    let message = err.message
    let stack = err.stack
    res.status(400).json({ message, stack })
})

app.use(function(req, res, next) {
    var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:3000', 'http://127.0.0.1:9000', 'http://127.0.0.1:5501/index.html', 'http://127.0.0.1:5501',
        'http://localhost:8000/api/list-music', 'http://localhost:8000/api/list-music/?search=em', 'http://localhost:8000/api/list-music/find/?search=em', 'http://localhost:8000/api/list-music/?pageSize=8&pageIndex=1',
        'https://longbody.github.io/listmusicfront', 'https://listmusicnodejs.herokuapp.com/api/list-music', 'https://listmusicnodejs.herokuapp.com/api/list-music/find/?search=em',
        'https://listmusicnodejs.herokuapp.com/api/list-music/?search=em', 'https://listmusicnodejs.herokuapp.com/api/list-music/?pageSize=8&pageIndex=1', 'localhost:7000/api/categories/find/?search=', 'https://listmusicnodejs.herokuapp.com/api/categories/find/?search='
    ];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

const users = []

const addUser = ({ id, name, room }) => {

    const existUser = users.find((user) => user.name === name && user.room === room)
    if (!existUser) {
        const user = { id, name, room }
        users.push(user)
    }

    return users
}

const getUser = (id) => users.find((user) => user.id === id)

const getUserInRoom = (room) => users.find((user) => user.room === room)



io.on('connection', (socket) => {
    socket.on("join", function(data) {
        // manageUser.push(data)
        // socket.user
        console.log(data)
        console.log(socket.id)

        if (data.room === "") {
            data.room = users[0].room
        }

        const user = addUser({ id: socket.id, name: data.name, room: data.room })
            // if (data.name == "LongBody") {
            //     console.log(socket.id)
            // } else
            //     socket.join(data.room)
            // console.log(user.room)
        console.log(user)
        socket.join(user[0].room)
        console.log(socket.adapter.rooms)

    })

    socket.on("sendMessage", function(message) {

        io.to("5f3f981b9e35ec0024d18a6c").emit('message', { user: "long", text: message })
            // io.sockets.emit("server-send-message", { userName: socket.userName, message: data })
    })

    // socket.on("logout", function(data) {
    //     manageUser.splice(manageUser.indexOf(socket.userName), 1)
    //     socket.broadcast.emit("server-send-listUser", manageUser)
    // })

    // socket.on("someone-typing", function() {
    //     socket.broadcast.emit("server-send-someone-typing")


    // })

    // socket.on("someone-stop-typing", function() {
    //     socket.broadcast.emit("server-send-someone-stop-typing")
    // })

})




http.listen(process.env.PORT || port, '0.0.0.0', () => {
    console.log('listening on *:' + port);
});