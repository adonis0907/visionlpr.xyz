const createAlertType = alertType =>{
    return fetch('/alert/addType',{
        method: 'post',
        body: JSON.stringify(alertType),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res =>res.json())
        .then(data => data);
};

const fetchTypes = () =>{
return fetch('/alert/fetchType', {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res =>res.json())
    .then(data => data);
};

const updateAlertType = alertType =>{
    return fetch('/alert/updateType', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertType)
    }).then(res =>res.json())
        .then(data => data);
};

const deleteAlertType = alertTypeIds =>{
    return fetch('/alert/deleteType', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({alerts: alertTypeIds})
    }).then(res =>res.json())
        .then(data => data);
};

const createAlert = alert =>{
    return fetch('/alert/create',{
        method: 'post',
        body: JSON.stringify(alert),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res =>res.json())
        .then(data => data);
};

const fetchAlerts = (params) =>{
    return fetch('/alert/fetchAll', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

const updateAlert = alert =>{
    return fetch('/alert/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
    }).then(res =>res.json())
        .then(data => data);
};

const deleteAlerts = alertIds =>{
    return fetch('/alert/delete', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({alerts: alertIds})
    }).then(res =>res.json())
        .then(data => data);
};

const count = () =>{
    return fetch('/alert/count', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    createType:createAlertType,
    fetchType: fetchTypes,
    updateType: updateAlertType,
    deleteTypes: deleteAlertType,
    createAlert: createAlert,
    fetchAlerts: fetchAlerts,
    updateAlert:updateAlert,
    deleteAlerts: deleteAlerts,
    count: count
}