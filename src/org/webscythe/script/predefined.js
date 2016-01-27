var WebBrowser = function () {
    this.__browser = __WB.createBrowser();
    this.__winCounter = 0;

    this.createWindow = function(url) {
        var w = new WebBrowserWindow(this.__browser, "win" + this.__winCounter++);
        if (url) {
            w.load(url);
        }
        return w;
    };
};


var WebBrowserWindow = function(browser, id) {
    this.__browser = browser;
    this.__id = id;

    this.isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    this.escapeDoubleQuotes = function(s) {
        if (s != null) {
            var parts = (s + "").split("\"");
            var result = "";
            for (var i = 0; i < parts.length; i++) {
                if (i > 0) {
                    result += "\\\"";
                }
                result += parts[i];
            }
            return result;
        }
        return s;
    };

    this.prepareCode = function(code, args) {
        if (this.isFunction(code)) {
            code = "" + code;
            code = "__tmp_func__ = " + code.trim() + ";__tmp_func__(";
            for (var i = 1; i < args.length; i++) {
                var currArg = args[i];
                var evaluatedArg = "null";
                if (currArg != null) {
                    if (typeof currArg === 'number' || typeof currArg === 'boolean') {
                        evaluatedArg = currArg;
                    } else if (toString.call(currArg) === '[object Object]') {
                        evaluatedArg = "JSON.parse(\"" + this.escapeDoubleQuotes(JSON.stringify(currArg)) + "\")";
                    } else if (toString.call(currArg) === '[object Array]') {
                        evaluatedArg = "JSON.parse(\"" + this.escapeDoubleQuotes(JSON.stringify(currArg)) + "\")";
                    } else {
                        evaluatedArg = "\"" + this.escapeDoubleQuotes(currArg) + "\"";
                    }
                }
                if (i > 1) {
                    code += ", ";
                }
                code += evaluatedArg;
            }
            code += ")";
        }
        return code;
    };

    this.load = function(url) {
        var params = {};    // todo: add default params for this window
        params.page = this.__id;
        return this.__browser.load(url, JSON.stringify(params));
    };

    this.getContent = function() {
        return this.__browser.getPageContent(this.__id);
    };

    this.getUrl = function() {
        return this.__browser.getUrl(this.__id);
    };

    this.evaluate = function(code) {
        var result = this.__browser.eval(this.prepareCode(code, arguments), this.__id);
        // todo: check validity of the result
        var resultObj = JSON.parse(result);
        var content = resultObj.content;
        //print(result);
        return content;
    };

    this.includeJS = function(url) {
        this.__browser.includeJS(this.__id, url);
    };

    this.download = function(url, fileName) {
        this.__browser.download(url, this.__id, fileName);
    };
};


var System = function () {
    this.__sys = __WB.createModule("sys");

    this.saveText = function(content, filename, charset) {
        if (!charset) {
            charset = "UTF-8";
        }
        this.__sys.saveText(content, filename, charset);
    }

    this.sleep = function(time) {
        this.__sys.sleep(time);
    }
};