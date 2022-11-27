const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { formatPesan } = require('./utils/messages');
const { userJoin, getCurrentUser, userKeluar, getServerUser } = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Sidongoding Bot';

//client connect
io.on('connection', socket => {
    socket.on('joinServer', ({ username, server }) => {
        const user = userJoin(socket.id, username, server);
        socket.join(user.server);

        //pesan this user baru masuk
        socket.emit('message', formatPesan(botName, 'Selamat bergabung di forum'));

        //pesan user baru masuk
        socket.broadcast.to(user.server).emit('message', formatPesan(botName, `${user.username} telah bergabung`));

        //info user dalam forum
        io.to(user.server).emit('serverUser', {
            server: user.server,
            users: getServerUser(user.server)
        });
    });

    //ambil pesan dari client
    socket.on('chtMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.server).emit('message', formatPesan(user.username, msg));
    });

    //pesan user keluar
    socket.on('disconnect', () => {
        const user = userKeluar(socket.id);
        if (user) {
            io.to(user.server).emit('message', formatPesan(botName, `${user.username} telah meninggalkan forum`));

            //info user dalam forum
            io.to(user.server).emit('serverUser', {
                server: user.server,
                users: getServerUser(user.server)
            });
        }
        // io.emit('message', formatPesan(botName, 'Seseorang telah keluar'));
    });

})
server.listen(3000, () => console.log(`App run in http://localhost:3000`));