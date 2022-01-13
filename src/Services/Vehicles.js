const fetchVehicles = (params) =>{
    return fetch('/vehicle/fetchAll', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

const fetchOne = id =>{
    return fetch(`/vehicle/fetch/${id}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const fetchAlert = params =>{
    return fetch('/vehicle/alert', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

const update = query =>{
    return fetch('/vehicle/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    }).then(res => res.json())
        .then(data => data);
};

const lastAlertForCamera = query =>{
    return fetch(`/vehicle/lastAlert/${query.station}/${query.cameraId}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const search = params =>{
    return fetch('/vehicle/search', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

const companion = params =>{
    return fetch('/vehicle/companion', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    fetchVehicles: fetchVehicles,
    fetchOne: fetchOne,
    fetchAlert: fetchAlert,
    update: update,
    lastAlertForCamera: lastAlertForCamera,
    search: search,
    companion: companion
};