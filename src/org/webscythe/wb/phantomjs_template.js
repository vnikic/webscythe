//var fs = require('fs');

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

var repeaterFunc = function(isReadyChecker, response, responseTxt) {
    if (isReadyChecker()) {
        response.statusCode = 200;
        response.write(responseTxt);
        response.close();
    } else {
        window.setTimeout(repeaterFunc, 20, isReadyChecker, response, responseTxt);
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
        if (pageParams.websecurityenabled == null) {
            page.webSecurityEnabled = false;
        } else {
            page.webSecurityEnabled = pageParams.websecurityenabled;
        }
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
        response.statusCode = -100;
        var errMsg = 'Error: ' + (pageName ? 'Page \"' + pageName + '\" does not exist!': 'Default page doesn\'t exist!');
        response.write(JSON.stringify(createResponseObject(null, errMsg, false)));
        response.close();
        return;
    } else {
//        page.onError = function (msg, trace) {
//            if (response != null) {
//                response.statusCode = -101;
//                response.write(msg ? msg : "There is an error executing JavaScript!");
//                response.close();
//            }
//        };
        page.onError = function (msg, trace) {
            page.evaluate(function() {
                document.___content___loaded___ = true;
            }, false);
        };
    }

    try {
        if (action == "getcontent") {   // request to get content of the page
            response.statusCode = 200;
            response.write(page.content);
            response.close();
        } else if (action == "geturl") {   // request to get url of the page
            response.statusCode = 200;
            response.write(page.url);
            response.close();
        } else if (action == "load") {
            handleLoad(page, response, decodeURI(params["url"]), params["content"])
        } else if (action == "eval") {
            handleEvaluate(page, response, params["exp"]);
        } else if (action == "includejs") {
            page.includeJs(decodeURI(params["url"]), function() {
                response.statusCode = 200;
                response.write("");
                response.close();
            });
            response.statusCode = 200;
            response.write("");
            response.close();
        } else if (action == "getcookies") {
            response.statusCode = 200;
            response.write(JSON.stringify(page.cookies));
            response.close();
        } else if (action == "getallcookies") {
            response.statusCode = 200;
            response.write(JSON.stringify(window.phantom.cookies));
            response.close();
        } else if (action == "getcustomheaders") {
            response.statusCode = 200;
            response.write(JSON.stringify(page.customHeaders));
            response.close();
        } else if (action == "rendertofile") {
            handleRenderToFile(page, response, params["filename"], params["type"], params["rect"]);
        } else if (action == "rendertoimage") {
            handleRenderToImage(page, response, params["type"]);
        } else if (action == "rendertopdf") {
            var path = params["path"];
            if (path) {
                page.render(path);
                response.statusCode = 200;
                response.write("");
                response.close();
            }
        } else {
            response.write('Error: Invalid action required!');
            response.close();
        }
    } catch (err) {
        response.statusCode = -102;
        response.write('Error:' + err);
        response.close();
    }
});

var handleLoad = function(page, response, urlToLoad, pageContent) {
    page.neverLoaded = false;
    if (urlToLoad) {
        if (pageContent) {
            page.setContent(pageContent, urlToLoad);
            response.statusCode = 200;
            response.write(pageContent);
            response.close();
        } else {
            repeaterFunc(page.checkIfDocContentIsLoaded, response, "");
            page.open(encodeURI(urlToLoad));
        }
    } else {
        response.statusCode = 201;
        response.write("URL is not specified!");
        response.close();
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
        repeaterFunc(page.checkIfDocContentIsLoaded, response, JSON.stringify(createResponseObject(evalResult, "ok", false)));
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

    response.statusCode = 200;
    response.write("");
    response.close();
};

var handleRenderToImage = function(page, response, type) {
    if (!type) {
        type = "JPEG";
    }
    var encodedImage = page.renderBase64(type);
    if (!encodedImage) {
        encodedImage = "";
    }
    response.statusCode = 200;
    response.write(encodedImage);
    response.close();
};
