var gLocator = require('../googleLocator/GLocator'),
    yaLocator = require('../yandexLocator/yaLocator');

var googleOptions = {
    name: 'google',
    rootDomain: 'http://google.ru/',
    requestPrefix: 'search?q=',
    concatSign: '+',
    newPagePrefix: '&start=',
    locParam: '&uule=',
    linkSelector: 'li.g h3 a',
    numPageFactor: 10,
    locationMethod: gLocator.encrypt
};

var yandexOptions = {
    name: 'yandex',
    rootDomain: 'http://yandex.ru/',
    requestPrefix: 'yandsearch?text=',
    concatSign: '%20',
    newPagePrefix: '&p=',
    locParam: '&lr=',
    linkSelector: '.b-link.serp-item__title-link',
    numPageFactor: 1,
    locationMethod: yaLocator.encrypt
};

module.exports.gOpt = googleOptions;
module.exports.yaOpt = yandexOptions;
