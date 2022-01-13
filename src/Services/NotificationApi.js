const getNotifications = () =>{
    return fetch('/notification/get', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const readNotification = id =>{
    return fetch(`/notification/read/${id}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    get: getNotifications,
    read: readNotification
}