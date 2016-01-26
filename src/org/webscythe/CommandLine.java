package org.webscythe;

import org.webscythe.script.ScriptExecutor;
import org.webscythe.utils.CommonUtil;

import javax.script.ScriptException;
import java.util.logging.Level;
import java.util.logging.LogManager;
import java.util.logging.Logger;

public class CommandLine {

    public static void main(String[] args) throws ScriptException {
        LogManager.getLogManager().getLogger(Logger.GLOBAL_LOGGER_NAME).setLevel(Level.FINE);

        String testScript = CommonUtil.readResourceAsString("/org/webscythe/script/test6.js");
        new ScriptExecutor().execute(testScript);
        System.exit(0);
    }

}
