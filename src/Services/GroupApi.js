const fetchAll = () =>{
    return fetch('/group/fetchAll', {
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