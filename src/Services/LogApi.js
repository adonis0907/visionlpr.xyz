const fetchAll = (params) =>{
    return fetch('/log/fetchAll', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(res =>res.json())
        .then(data => data);
};

export default fetchAll;