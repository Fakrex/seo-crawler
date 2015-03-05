var webPage = require('webpage'),
    gLocator = require('./googleLocator/gLocator'),
    yaLocator = require('./yandexLocator/yaLocator'),
    page = webPage.create();

function SearchEngine(engConfig) {
    var _id = engConfig.id,
        _engineUrl = engConfig.rootDomain,
        _engineRequest = engConfig.requestPrefix,
        _concatSign = engConfig.concatSign,
        _engineNewPage = engConfig.newPagePrefix,
        _locParam = engConfig.locParam,
        _linkSelector = engConfig.linkSelector,
        _searchPagesUrls = [],
        _resultLinks;

    var pageHandler = function(uri) {
        page.open(uri, function (status) {
            if (status === 'success') {

                _resultLinks = page.evaluate(function(_linkSelector) {
                    return [].map.call(document.querySelectorAll(_linkSelector), function (link) {
                        return link.href;
                    });
                }, _linkSelector);

                saveResults();

                setTimeout(nextPage, 1000);
            }
        });
    };

    var nextPage = function() {
        var file = _searchPagesUrls.shift();
        if(!file){
            _id === 2 ? task2() : phantom.exit();
        }
        pageHandler(file);
    };

    this.runSearch = function(searchObj) {
        var keyPhrase = searchObj.keyPhrase.replace(new RegExp(' ','g'), _concatSign);
        var url = _engineUrl + _engineRequest + encodeURIComponent(keyPhrase) + _locParam + setLocation(searchObj.city);
        for (var numPage = 0; numPage < searchObj.depthSearch; numPage++) {
            url += _engineNewPage + _id.toString(2)*numPage;
            _searchPagesUrls.push(url);
            url = url.substr(0, url.indexOf(_engineNewPage));
        }
        nextPage();
    };

    var saveResults = function() {
        console.log(_resultLinks.join('\n'));
        console.log(_resultLinks.length);
    };

    var setLocation = function(city) {
        try {
            return (_id === 2) ? gLocator.encrypt(city.google): yaLocator.encrypt(city.yandex);
        } catch(err) {
            console.log(err+'\nВыполнение программы прекращено!');
            phantom.exit();
        }
    }

}

var googleOptions = {
    id: 2,
    rootDomain: 'http://google.ru/',
    requestPrefix: 'search?q=',
    concatSign: '+',
    newPagePrefix: '&start=',
    locParam: '&uule=',
    linkSelector: 'li.g h3 a'
};

var yandexOptions = {
    id: 1,
    rootDomain: 'http://yandex.ru/',
    requestPrefix: 'yandsearch?text=',
    concatSign: '%20',
    newPagePrefix: '&p=',
    locParam: '&lr=',
    linkSelector: '.b-link.serp-item__title-link'
};

var useragent = [];
useragent.push('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25');
useragent.push('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20130406 Firefox/23.0');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36 OPR/27.0.1689.76');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0');

page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];

var inputParams = {
    keyPhrase: 'приветули',
    depthSearch: 1,
    city: {
        google: 'Samara',
        yandex: 'Самара'
    }
};


function task1() {
    var google = new SearchEngine(googleOptions);
    google.runSearch(inputParams);
}

function task2() {
    var yandex = new SearchEngine(yandexOptions);
    yandex.runSearch(inputParams);
}


task1();