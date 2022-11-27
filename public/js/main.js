const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const serverName = document.getElementById('server-name');
const userList = document.getElementById('users');

//ambil username dan server
const { username, server } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join server chat
socket.emit('joinServer', { username, server });

//get user dan server
socket.on('serverUser', ({ server, users }) => {
    outputRoomName(server);
    outputUsers(users);
});

//pesan dari server
socket.on('message', pesan => {
    console.log(pesan);
    outputMessage(pesan);

    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//pesan submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //ambil pesan dari input
    const msg = e.target.elements.msg.value;
    // console.log(msg);
    socket.emit('chtMessage', msg);

    //clear inputan
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output pesan ke DOM
function outputMessage(pesan) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${pesan.username} <span>${pesan.time}</span></p>
    <p class="text">${pesan.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//output room name
function outputRoomName(server) {
    serverName.innerText = server;
}

//output user
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

//user keluar
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});