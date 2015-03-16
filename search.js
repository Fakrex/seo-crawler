var webPage = require('webpage'),
    enginesConfig = require('./configs/enginesConfig'),
    userAgents = require('./configs/userAgents'),
    inputParams = require('./inputParams'),
    saver = require('./resultSaver');

function SearchEngine(engConfig) {
    var _nameSearcher = engConfig.name,
        _engineUrl = engConfig.rootDomain,
        _engineRequest = engConfig.requestPrefix,
        _concatSign = engConfig.concatSign,
        _engineNewPage = engConfig.newPagePrefix,
        _locParam = engConfig.locParam,
        _linkSelector = engConfig.linkSelector,
        _numPageFactor = engConfig.numPageFactor,
        _locationMethod = engConfig.locationMethod,
        _searchPages = [],
        _currCity,
        _onPageLinks;

    var _page = webPage.create();
        _page.settings.userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    var pageHandler = function(obj) {
        _page.open(obj.link, function (status) {
            if (status === 'success') {

                _onPageLinks = _page.evaluate(function(_linkSelector) {
                    return [].map.call(document.querySelectorAll(_linkSelector), function (link) {
                        return link.href;
                    });
                }, _linkSelector);

                saveResults(obj.page, obj.key);
                setTimeout(nextPage, 1000);
            }
        });
    };

    var nextPage = function() {
        var file = _searchPages.shift();
        if(!file) executeTask();
        else pageHandler(file);
    };

    this.runSearch = function(searchObj) {
        _currCity = searchObj.city[_nameSearcher];
        var keyPhrase, url,
            location = setLocation(_currCity),
            keyArr = searchObj.keyPhrases;
        for (var numKey = 0; numKey < keyArr.length; numKey++ ) {
            keyPhrase = keyArr[numKey].replace(new RegExp(' ', 'g'), _concatSign);
            url = _engineUrl + _engineRequest + encodeURIComponent(keyPhrase) + _locParam + location;
            for (var numPage = 0; numPage < searchObj.depthSearch; numPage++) {
                var newObj = {};
                newObj.key = keyPhrase;
                newObj.page = numPage + 1;
                url += _engineNewPage + _numPageFactor * numPage;
                newObj.link = url;
                _searchPages.push(newObj);
                url = url.substr(0, url.indexOf(_engineNewPage));
            }
        }
        nextPage();
    };

    var saveResults = function(page, phrase) {
        resObj = {
            searcher: _nameSearcher,
            city: _currCity,
            key: phrase,
            page: page,
            links: _onPageLinks
        };

        saver.ResultHandler(resObj);
    };

    var setLocation = function(city) {
        try {
            return _locationMethod(city);
        } catch(err) {
            console.log(err+'\nВыполнение программы прекращено!');
            phantom.exit();
        }
    }
}

function task1() {
    var google = new SearchEngine(enginesConfig.gOpt);
    google.runSearch(inputParams);
}

function task2() {
    var yandex = new SearchEngine(enginesConfig.yaOpt);
    yandex.runSearch(inputParams);
}

function task3() {
    saver.resultStore();
    executeTask();
}

var taskPull = [task1, task2, task3];

function executeTask() {
    var task = taskPull.shift();
    if(!task) phantom.exit();
    task.call(null);
}

executeTask();

