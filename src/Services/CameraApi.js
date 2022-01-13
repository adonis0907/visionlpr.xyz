const create = camera =>{
    return fetch('/camera/create',{
        method: 'post',
        body: JSON.stringify(camera),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res =>res.json())
        .then(data => data);
};

const fetchAll = (params) =>{
    return fetch('/camera/fetchAll', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

const update = city =>{
    return fetch('/camera/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(city)
    }).then(res =>res.json())
        .then(data => data);
};

const deleteCameras = cameraIds =>{
    return fetch('/camera/delete', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cameras: cameraIds})
    }).then(res =>res.json())
        .then(data => data);
};

const fetchC = () =>{
    return fetch('/camera/fetch', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const count = () =>{
    return fetch('/camera/count', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    create:create,
    fetchAll: fetchAll,
    update: update,
    deleteCameras: deleteCameras,
    fetch: fetchC,
    count: count
}