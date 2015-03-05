var yandexGeo = require('./subModules/yandex-geo');

module.exports.encrypt = YaLocator;

function YaLocator(city) {
    var detectedObj = null

    yandexGeo.data.forEach( function(item) {
        if(item.name === city) {
            detectedObj = item;
        }
    });

    if(typeof detectedObj !== 'undefined' && detectedObj != null) {
        return detectedObj.id;
    } else {
        throw new Error('Нет такого города!');
    }

}