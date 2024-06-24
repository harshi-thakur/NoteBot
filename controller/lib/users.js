const isUser=(id)=>{
    const user =users.find(obj => obj.id === id);
    return user;
}
const setUser=(id,state)=>{
    const user =isUser(id);  
    if(user)
        user.state = state;
    else{
        users.push({id:id,state:state});
    }
}

const deleteUser=(id)=>{
    const index = users.findIndex(obj => obj.id === id);
if (index !== -1)
    users.splice(index, 1);
}

const users=[];

const updateUser={
    isUser:isUser,
    setUser:setUser,
    deleteUser:deleteUser
}

module.exports ={updateUser};
