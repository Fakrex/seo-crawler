var googleGeo = require('./subModules/google-geo'),
    gSecretKeys = require('./subModules/gSecretKeys'),
    base64 = require('./subModules/base64Processor');

module.exports.encrypt = GLocator;

function GLocator(city) {
    var detectedObj = null,
        countryCode = 'RU',
        len = '',
        resVal = 'w+CAIQICI';

	googleGeo.data.forEach( function(item) {
        if(item.name === city && item.country_code === countryCode) {
            detectedObj = item;
        }
    });

    if(typeof detectedObj !== 'undefined' && detectedObj != null) {
        len = detectedObj.canonical_name.length.toString();
        resVal = resVal + gSecretKeys.content[len] + base64.encode(detectedObj.canonical_name);
        return resVal;
    } else {
        throw new Error('Нет такого города!');
    }
}

