const create = station =>{
    return fetch('/station/create',{
        method: 'post',
        body: JSON.stringify(station),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const fetchAll = () =>{
    return fetch('/station/fetchAll', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const update = station =>{
    return fetch('/station/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(station)
    }).then(res =>res.json())
        .then(data => data);
};

const deleteStation = stations =>{
    return fetch('/station/delete', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({stations: stations})
    }).then(res =>res.json())
        .then(data => data);
};

const count = () =>{
    return fetch('/station/count', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    create:create,
    fetchAll: fetchAll,
    update: update,
    deleteStation: deleteStation,
    count: count
}