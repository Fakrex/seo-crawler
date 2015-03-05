var webPage = require('webpage'),
    page = webPage.create(),
    gLocator = require('./googleLocator/GLocator');

function SearchEngine(engConfig) {
    var _engineUrl = engConfig.rootDomain,
        _engineRequest = engConfig.requestPrefix,
        _concatSign = engConfig.concatSign,
        _engineNewPage = engConfig.newPagePrefix,
        _locParam = engConfig.locParam,
        _linkWrapperSelector = engConfig.linkWrapperSelector,
        _locSelector = engConfig.locSelector,
        _localInfo,
        _searchPagesUrls = [],
        _resultLinks;

    var pageHandler = function(uri) {
        page.open(uri, function (status) {
            if (status === 'success') {

                page.injectJs('./libs/jquery-2.1.3.min.js');

                _resultLinks = page.evaluate(function(_linkWrapperSelector) {
                    return $(_linkWrapperSelector).map(function () {
                        return this.href;
                    }).get();
                }, _linkWrapperSelector);
                _localInfo = page.evaluate(function(_locSelector) {
                    return $(_locSelector).text();
                }, _locSelector);

                saveResults();

                setTimeout(nextPage, 1000);
            }
        });
    };

    var nextPage = function() {
        var file = _searchPagesUrls.shift();
        if(!file) phantom.exit();
        pageHandler(file);
    };

    this.runSearch = function(searchObj) {
        var keyPhrase = searchObj.keyPhrase.replace(new RegExp(' ','g'), _concatSign);
        var url = _engineUrl + _engineRequest + encodeURIComponent(keyPhrase) + _locParam + setLocation(searchObj.city);
        for (var numPage = 0; numPage < searchObj.depthSearch; numPage++) {
            url += _engineNewPage + 10*numPage;
            _searchPagesUrls.push(url);
            url = url.substr(0, url.indexOf(_engineNewPage));
        }
        nextPage();
    };

    var saveResults = function() {
        console.log(_resultLinks.join('\n'));
        console.log(_resultLinks.length);
        console.log(_localInfo);
    };

    var setLocation = function(city) {
        try {
            return gLocator.encrypt(city);
        } catch(err) {
            console.log(err+'\nВыполнение программы прекращено!');
            phantom.exit();
        }
    }

}

var googleOptions = {
    rootDomain: 'http://google.ru/',
    requestPrefix: 'search?q=',
    concatSign: '+',
    newPagePrefix: '&start=',
    locParam: '&uule=',
    linkWrapperSelector: 'li.g h3 a',
    locSelector: '#swml_addr'
};

var yandexOptions = {
    rootDomain: 'http://yandex.ru',
    requestPrefix: 'search?q=',
    concatSign: '+',
    newPagePrefix: '&start=',
    locParam: '&uule=',
    linkWrapperSelector: 'li.g h3 a',
    locSelector: '#swml_addr'
};

var useragent = [];
useragent.push('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25');
useragent.push('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20130406 Firefox/23.0');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36 OPR/27.0.1689.76');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36');
useragent.push('Mozilla/5.0 (Windows NT 6.3; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0');

page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];


var google = new SearchEngine(googleOptions);

var inputParams = {
    keyPhrase: 'привет как дела',
    depthSearch: 1,
    city: 'Dimitrovgrad'
};


google.runSearch(inputParams);
