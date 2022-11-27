const users = [];

// user join
function userJoin(id, username, server){
    const user = {id, username, server};
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//user keluar
function userKeluar(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//get server user
function getServerUser(server){
    return users.filter(user => user.server === server);
}

module.exports = { userJoin, getCurrentUser, userKeluar, getServerUser };