package org.webscythe.script;


import org.webscythe.utils.CommonUtil;
import org.webscythe.wb.WebBrowserProxy;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.File;
import java.io.IOException;

public class ScriptExecutor {

    public void execute(String script) {
        WebBrowserProxy webBrowserProxy = new WebBrowserProxy();
        try {
            StringBuilder b = new StringBuilder();
            String predefinedJS = CommonUtil.readResourceAsString("/org/webscythe/script/predefined.js");
            if (predefinedJS != null) {
                b.append(predefinedJS);
            }
            b.append("\n");
            b.append(script);

            ScriptEngineManager factory = new ScriptEngineManager();
            ScriptEngine engine = factory.getEngineByName("JavaScript");

            // inject Java objects to execution context
            engine.put("__WB", webBrowserProxy);

            engine.eval(b.toString());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            webBrowserProxy.dispose();
        }
    }

    public void execute(File file, String encoding) {
        try {
            String script = CommonUtil.readStringFromFile(file, encoding);
            execute(script);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void execute(File file) {
        execute(file, "UTF-8");
    }

}
