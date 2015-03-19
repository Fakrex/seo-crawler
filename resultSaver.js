var fs = require('fs'),
    path = 'output.json';

fs.write(path, '', 'w');
var now = new Date(),
    resArr = [],
    linkOnPagesCounter = {},
    strDate = now.toISOString(),
    currCity,
    currDate = strDate.substr(0,strDate.indexOf('T')) + ' ' + now.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

var exampleObj = {
    "dateTime": "2015-01-01 18:00",
    "city": "Москва",
    "urlSearch": "http://www.mail.ru/sovety/sovet1/index.html",
    "rootDomain": "http://www.mail.ru/",
    "keys": [

    ]
};

function ResultHandler(obj) {
    console.log('опа!');
    console.log(obj.searcher + ', ' + obj.city + ', ' + obj.page + ', ' + obj.key);
    console.log(obj.links.join('\n'));
    console.log(obj.links.length);
    linkOnPagesCounter[obj.searcher] = (obj.page === 1) ? 0 : linkOnPagesCounter[obj.searcher];

    currCity = !!currCity ? currCity : obj.city;


    for(var i = 0; i < obj.links.length; i++) {
        createEntry(obj, i);
    }

    linkOnPagesCounter[obj.searcher] += obj.links.length;
}

function createEntry(obj, ind) {
    var tmpObj,
        keyItem = {};
    tmpObj = Object.create(exampleObj);
    tmpObj.city = currCity;
    tmpObj.dateTime = currDate;
    tmpObj.urlSearch = obj.links[ind];
    tmpObj.rootDomain = getDomain(obj.links[ind]);
    tmpObj.keys = [];
    keyItem['key'] = obj.key;
    switch (obj.searcher) {
        case 'yandex':
            keyItem['yandex'] = linkOnPagesCounter[obj.searcher] + (ind + 1);
            break;
        case 'google':
            keyItem['google'] = linkOnPagesCounter[obj.searcher] + (ind + 1);
            break;
        default:
            throw new Error('Неверное значение!');
    }
    tmpObj.keys.push(keyItem);
    mergePseudoDuplicates(tmpObj) ?  null : resArr.push(tmpObj);
}

function mergePseudoDuplicates(neededObj) {
    for(var j = 0; j < resArr.length; j++ ) {
        if(resArr[j].urlSearch === neededObj.urlSearch) {
            mergeItems(resArr[j], neededObj);
            return true;
        }
    }
    return false;
}

function mergeItems(oldItem, newItem) {
    var isCombined = false;
    for(var j = 0; j < oldItem.keys.length; j++){
       if (oldItem.keys[j].key === newItem.keys[0].key) {
           mergeObjects(oldItem.keys[j], newItem.keys[0]);
           isCombined = !isCombined;
       }
    }
    isCombined ?  null : oldItem.keys = oldItem.keys.concat(newItem.keys);
}

function mergeObjects(obj1, obj2) {
    for( var property in obj2) {
        obj1[property] = obj2[property];
    }
}

function getDomain(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
}

function resultStore() {
    fs.write(path, JSON.stringify(resArr, null, '\t'), 'w');
}

module.exports = {
    ResultHandler : ResultHandler,
    resultStore: resultStore
};