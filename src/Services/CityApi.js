const create = city =>{
    return fetch('/city/create',{
        method: 'post',
        body: JSON.stringify(city),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const fetchAll = () =>{
    return fetch('/city/fetchAll', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

const update = city =>{
    return fetch('/city/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(city)
    }).then(res =>res.json())
        .then(data => data);
};

const deleteCity = cities =>{
    return fetch('/city/delete', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cities: cities})
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    create: create,
    fetchAll: fetchAll,
    update: update,
    deleteCity: deleteCity
}