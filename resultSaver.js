var fs = require('fs'),
    path = 'output.json';


var exampleObj = {
    "dateTime": "20115-01-01 18:00",
    "city": "Москва",
    "urlSearch": "http://www.mail.ru/sovety/sovet1/index.html",
    "rootDomain": "http://www.mail.ru",
    "name": "ООО Рога и копыта",
    "keys": [
        {
            "key": "купить квартиру в москве",
            "yandex": 1,
            "google": 10
        },
        {
            "key": "купить хрущевку в москве",
            "yandex": 4,
            "google": 5
        },
        {
            "key": "купить хрущевку",
            "yandex": 3,
            "google": 2
        }
    ],
    "phones": [
        "+79272956633",
        "+79272956633",
        "+79272956633",
        "+79272956633"
    ],
    "emails": [
        "email2@yandex.ru",
        "email2@yandex.ru",
        "email2@yandex.ru",
        "email2@yandex.ru"
    ]
};



function resultSaver(obj) {
    console.log(obj.searcher + ', ' + obj.city + ', ' + obj.page + ', ' + obj.key);
    console.log(obj.links.join('\n'));
    console.log(obj.links.length);

    fs.write(path, JSON.stringify(exampleObj), 'w');
}

module.exports = resultSaver;