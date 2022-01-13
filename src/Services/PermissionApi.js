const fetchAll = () =>{
    return fetch('/permission/fetchAll', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res =>res.json())
        .then(data => data);
};

export default {
    fetchAll: fetchAll
}