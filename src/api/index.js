const main_url = 'https://api.yuelun.com/mobile/';

export default function myFetch(url, payload, callback) {
    let fullUrl = `${main_url}${url}`;
    fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(json => {
            callback(json)
        })
}