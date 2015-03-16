var fs = require('fs'),
    path = 'output.json';

fs.write(path, '', 'w');
var now = new Date(),
    resArr = [],
    strDate = now.toISOString(),
    currCity,
    currDate = strDate.substr(0,strDate.indexOf('T')) + ' ' + now.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

var exampleObj = {
    "dateTime": "2015-01-01 18:00",
    "city": "Москва",
    "urlSearch": "http://www.mail.ru/sovety/sovet1/index.html",
    "keys": [

    ]
};



function ResultHandler(obj) {
    console.log('опа!');
    console.log(obj.searcher + ', ' + obj.city + ', ' + obj.page + ', ' + obj.key);
    console.log(obj.links.join('\n'));
    console.log(obj.links.length);

    currCity = !!currCity ? currCity : obj.city;

    var tmpObj;
    for(var i = 0; i < obj.links.length; i++) {
        var keyItem = {};
        tmpObj = Object.create(exampleObj);
        tmpObj.city = currCity;
        tmpObj.dateTime = currDate;
        tmpObj.urlSearch = obj.links[i];
        if(resArr.indexOf())
        tmpObj.keys = [];
        keyItem['key'] = obj.key;
        switch (obj.searcher) {
            case 'yandex':
                keyItem['yandex'] = i + 1;
                break;
            case 'google':
                keyItem['google'] = i + 1;
                break;
            default:
                throw new Error('Неверное значение!');
        }
        tmpObj.keys.push(keyItem);
        resArr.push(tmpObj);
    }
}

function resultStore() {
    fs.write(path, JSON.stringify(resArr, null, '\t'), 'w');
}

function resultAggregate() {

}


module.exports = {
    ResultHandler : ResultHandler,
    resultStore: resultStore
};