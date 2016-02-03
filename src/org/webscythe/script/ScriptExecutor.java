package org.webscythe.script;


import org.webscythe.utils.AppLogging;
import org.webscythe.utils.CommonUtil;
import org.webscythe.wb.PhantomException;
import org.webscythe.wb.WebBrowserProxy;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.File;
import java.io.IOException;
import java.util.logging.Logger;

public class ScriptExecutor {

    private final static Logger logger = AppLogging.getLogger(ScriptExecutor.class);

    private class ScriptExceptionWrapper extends RuntimeException {

        private ScriptException scriptException;

        public ScriptExceptionWrapper(ScriptException scriptException) {
            super(scriptException);
            this.scriptException = scriptException;
        }

        @Override
        public String getMessage() {
            if (scriptException != null) {
                Throwable cause = scriptException.getCause();
                if (cause != null) {
                    String causeMessage = cause.getMessage();
                    return causeMessage + " (line: " + (scriptException.getLineNumber() - predefinedJSLineCount) + ")";
                }
            }
            return super.getMessage();
        }
    }


    private String predefinedJS = null;
    private int predefinedJSLineCount = 0;


    public ScriptExecutor() {
        predefinedJS = CommonUtil.readResourceAsString("/org/webscythe/script/predefined.js");
        if (predefinedJS != null) {
            String[] lines = predefinedJS.split("\r\n|\r|\n");
            predefinedJSLineCount = lines.length;
        }
    }

    public void execute(String script) {
        WebBrowserProxy webBrowserProxy = new WebBrowserProxy();
        boolean hasErrors = false;
        try {
            StringBuilder b = new StringBuilder();
            if (predefinedJS != null) {
                b.append(predefinedJS);
            }
            b.append("\n");
            b.append(script);

            ScriptEngineManager factory = new ScriptEngineManager();
            ScriptEngine engine = factory.getEngineByName("JavaScript");

            // inject Java objects to execution context
            engine.put("__WB", webBrowserProxy);

            try {
                engine.eval(b.toString());
            } catch (ScriptException e) {
                throw new ScriptExceptionWrapper(e);
            }
        } catch (PhantomException e) {
            logger.severe(e.getMessage());
            hasErrors = true;
        } catch (ScriptExceptionWrapper e) {
            logger.severe(e.getMessage());
            hasErrors = true;
        } catch (Exception e) {
            e.printStackTrace();
            hasErrors = true;
        } finally {
            webBrowserProxy.dispose();
            if (hasErrors) {
                logger.info("Script execution finished with errors!");
            } else {
                logger.info("Script execution finished successfully!");
            }
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
