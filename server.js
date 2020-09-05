require('./mongoose-connect')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routers')
var cors = require('cors');
const { Console } = require('console');
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');
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

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

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


io.on('connection', (socket) => {

    console.log(socket.id)

    socket.on("join", function(data) {
        // manageUser.push(data)
        // socket.use
        console.log(data)
            // socket.join(data.room)
        socket.join("e10adc3949ba59abbe56e057f20f883e")
        socket.emit('server-admin-join', data)
        console.log(socket.adapter.rooms)

    })

    socket.on("sendMessage", function(message) {

        io.to("e10adc3949ba59abbe56e057f20f883e").emit('message', { user: "long", text: message })
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


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/good');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})




http.listen(process.env.PORT || port, '0.0.0.0', () => {
    console.log('listening on *:' + port);
});