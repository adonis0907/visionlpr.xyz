const login = user =>{
    return fetch('/user/login',{
        method: 'post',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>{
        if(res.status === 200){
            return res.json()
                .then(data => data);
        }else{
            return {
                success: false,
                errorMsg: "Credencial inválida"
            }
        }
    });
};

const create = user =>{
    return fetch('/user/create', {
        method: 'post',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const logout = () =>{
    return fetch('/user/logout',{
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => data);
};

const isAuthenticated = () =>{
    return fetch('/user/authenticated')
        .then(res =>{
            if(res.status === 200)
                return res.json()
                    .then(data => data);
            else return {isAuthenticated: false, user:{}}
        });
};

const users = params =>{
    return fetch('/user/fetchAll', {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const deleteUser = users =>{
    return fetch('/user/delete', {
        method: 'delete',
        body: JSON.stringify({users:users}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const profile = id =>{
    return fetch(`/user/profile/${id}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const updateProfile = (id, profile) =>{
    return fetch(`/user/update/${id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
    }).then(res => res.json())
        .then(data => data);
};

const count = () =>{
    return fetch(`/user/count`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const resetLink = email =>{
    return fetch(`/user/reset-link`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    }).then(res => res.json())
        .then(data => data);
};

const getResetLink = token =>{
    return fetch(`/user/get-link/${token}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => data);
};

const resetPassword = user =>{
    return fetch(`/user/reset-password`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(res => res.json())
        .then(data => data);
};

export default {
    login: login,
    create: create,
    logout: logout,
    isAuthenticated: isAuthenticated,
    users: users,
    deleteUser: deleteUser,
    profile: profile,
    update: updateProfile,
    count: count,
    resetLink: resetLink,
    getResetLink: getResetLink,
    resetPassword: resetPassword
}