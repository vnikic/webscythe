var pageStartTimes = {};

var pageEvaluate = function(expression) {
    return eval.apply(window, [expression]);
};

var addDocEvents = function() {
    document.addEventListener('DOMContentLoaded', function() {
       document.___content___loaded___ = true;
    });
};

var clearDocLoadedIndicator = function() {
   document.___content___loaded___ = false;
};

var repeaterFunc = function(isReadyChecker, funcWhenReady) {
    if (isReadyChecker()) {
        funcWhenReady();
    } else {
        window.setTimeout(repeaterFunc, 20, isReadyChecker, funcWhenReady);
    }
};

var initPage = function(page, pageParams) {
    if (pageParams) {
        page.viewportSize = {width: pageParams.width, height: pageParams.height};
        page.paperSize = {format: pageParams.paperformat, orientation: pageParams.paperorientation, border: pageParams.paperborder};
        page.settings.javascriptEnabled = pageParams.javascriptenabled == null || pageParams.javascriptenabled;
        page.settings.loadImages = pageParams.loadimages == null || pageParams.loadimages;
        if (pageParams.useragent) {
            page.settings.userAgent = pageParams.useragent;
        }
        if (pageParams.username) {
            page.settings.username = pageParams.username;
        }
        if (pageParams.password) {
            page.settings.password = pageParams.password;
        }
        if (pageParams.zoomfactor) {
            page.zoomFactor = parseFloat(pageParams.zoomfactor);
        }
        page.localToRemoteUrlAccessEnabled = true;
        if (pageParams.websecurityenabled == null) {
            page.webSecurityEnabled = false;
        } else {
            page.webSecurityEnabled = pageParams.websecurityenabled;
        }
        var timeout = parseInt(pageParams.timeout);
        page.timeout = isNaN(timeout) ? 30000 : timeout;

        page.pageParams = pageParams;
    }

    page.neverLoaded = true;

    page.onInitialized = function() {
        page.evaluate(addDocEvents, false);
    };

    page.checkIfDocContentIsLoaded = function() {
        if (page.neverLoaded) {
            return true;
        } else {
            return page.evaluate(function() {
                return document.___content___loaded___ ? true : false;
            });
        }
    };

    return page;
};

var server = require('webserver').create();


var dfltPage = null;
var namedPages = {};

var getPage = function(pageName, createIfNotExist, pageParams) {
    if (!pageName) {
        if (dfltPage == null && createIfNotExist) {
            dfltPage = initPage(new WebPage(), pageParams);
        }
        return dfltPage;
    } else if (namedPages[pageName]) {
        return namedPages[pageName];
    } else if (createIfNotExist) {
        var newPage = initPage(new WebPage(), pageParams);
        namedPages[pageName] = newPage;
        return newPage;
    }
    return null;
};

//Returns true if it is a DOM element
var isElement = function(o){
    return o != null && typeof o.innerHTML === "string";
};

var createResponseObject = function(content, msg, isLoaded) {
    if (isElement(content)) {
        content = content.innerHTML;
    }
    return {
        "msg" : msg,
        "loaded": isLoaded,
        "content": content
    };
};

var nvl = function(v, dflt) {
    return v ? v : dflt;
};

var sendResponse = function(response, statusCode, content) {
    response.statusCode = statusCode;
    response.write(content);
    response.close();
}

var service = server.listen(${PORT}, function (request, response) {
    var params = request.post;
    var action = params["action"];
    var pageName = params["page"];

    var pageParams = {
        width: nvl(params["width"], "1280"),
        height: nvl(params["height"], "1000"),
        paperformat: nvl(params["paperformat"], "A4"),
        paperorientation: nvl(params["paperorientation"], "portrait"),
        paperborder: nvl(params["paperborder"], "0"),
        loadimages: nvl(params["loadimages"], true),
        javascriptenabled: nvl(params["javascriptenabled"], true),
        useragent: nvl(params["useragent"], "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0"),
        username: params["username"],
        password: params["password"],
        zoomfactor: nvl(params["zoomfactor"], 1),
        websecurityenabled: nvl(params["websecurityenabled"], false)
    };

    var page = getPage(pageName, true, pageParams);

    if (page == null) {
        var errMsg = 'Error: ' + (pageName ? 'Page \"' + pageName + '\" does not exist!': 'Default page doesn\'t exist!');
        sendResponse(response, -100, errMsg);
        return;
    } else {
        page.onError = function (msg, trace) {
            page.evaluate(function() {
                document.___content___loaded___ = true;
            }, false);
        };
        pageStartTimes[page] = {
            "time": new Date().getTime(),
            "response": response
        };
    }

    try {
        if (action == "getcontent") {   // request to get content of the page
            sendResponse(response, 200, page.content);
        } else if (action == "geturl") {   // request to get url of the page
            sendResponse(response, 200, page.url);
        } else if (action == "load") {
            handleLoad(page, response, decodeURI(params["url"]), params["content"])
        } else if (action == "eval") {
            handleEvaluate(page, response, params["exp"]);
        } else if (action == "includejs") {
            var jsUrl = decodeURI(params["url"]);
            page.onResourceError = function(resourceError) {
                sendResponse(response, -105, 'Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
            };
            page.includeJs(jsUrl, function() {
                sendResponse(response, 200, "");
            });
        } else if (action == "getcookies") {
            sendResponse(response, 200, JSON.stringify(page.cookies));
        } else if (action == "getallcookies") {
            sendResponse(response, 200, JSON.stringify(window.phantom.cookies));
        } else if (action == "getcustomheaders") {
            sendResponse(response, 200, JSON.stringify(page.customHeaders));
        } else if (action == "rendertofile") {
            handleRenderToFile(page, response, params["filename"], params["type"], params["rect"]);
        } else if (action == "rendertoimage") {
            handleRenderToImage(page, response, params["type"]);
        } else if (action == "rendertopdf") {
            var path = params["path"];
            if (path) {
                page.render(path);
                sendResponse(response, 200, "");
            }
        } else {
            sendResponse(response, -100, 'Error: Invalid action required!');
        }
    } catch (err) {
        sendResponse(response, -102, 'Error:' + err);
    }
});

var handleLoad = function(page, response, urlToLoad, pageContent) {
    page.neverLoaded = false;
    if (urlToLoad) {
        if (pageContent) {
            page.setContent(pageContent, urlToLoad);
            sendResponse(response, 200, pageContent);
        } else {
            page.open(encodeURI(urlToLoad), function(status) {
                if (status == "fail") {
                    var responseObj = {
                        "url": urlToLoad,
                        "msg": "Error loading \"" + urlToLoad + "\"!",
                        "status": "fail"
                    };
                    sendResponse(response, 300, JSON.stringify(responseObj));
                }
            });
            repeaterFunc(page.checkIfDocContentIsLoaded, function() {
                sendResponse(response, 200, JSON.stringify({"url": urlToLoad, "status": "ok"}));
            });
        }
    } else {
        sendResponse(response, 201, "URL is not specified!");
    }
};


var handleEvaluate = function(page, response, jsToEvaluate) {
    var evalResult = null;
    var isNavigationRequested = false;
    page.onNavigationRequested = function(url, type, willNavigate, main) {
        if (willNavigate && main) {
            isNavigationRequested = true;
        }
    };
    evalResult = page.evaluate(pageEvaluate, jsToEvaluate);

    window.setTimeout(function () {
        page.onNavigationRequested = null;
        if (isNavigationRequested) {
            page.evaluate(clearDocLoadedIndicator, false);
        }
        repeaterFunc(page.checkIfDocContentIsLoaded, function() {
            sendResponse(response, 200, JSON.stringify(createResponseObject(evalResult, "ok", false)));
        });
    }, 20);
};

var handleRenderToFile = function(page, response, filename, type, rect) {
    if (!type) {
        type = "JPEG";
    }
    if (rect) {
        page.clipRect = JSON.parse(rect);
    } else {
        page.clipRect = null;
    }
    page.render(filename, type, 100);

    sendResponse(response, 200, "");
};

var handleRenderToImage = function(page, response, type) {
    if (!type) {
        type = "JPEG";
    }
    var encodedImage = page.renderBase64(type);
    if (!encodedImage) {
        encodedImage = "";
    }
    sendResponse(response, 200, encodedImage);
};


window.setInterval(function () {
    var currTime = new Date().getTime();
    for (page in pageStartTimes) {
        var curr = pageStartTimes[page];
        if (page.timeout >= currTime - curr.time) {
            sendResponse(page.response, -134, "Browser response timeout!");
        }
    }
}, 1000);
