package org.webscythe;

import org.webscythe.script.ScriptExecutor;
import org.webscythe.utils.CommonUtil;

import javax.script.ScriptException;

public class CommandLine {

    public static void main(String[] args) throws ScriptException {
        String testScript = CommonUtil.readResourceAsString("/org/webscythe/script/test7.js");
        new ScriptExecutor().execute(testScript);
        System.exit(0);
    }

}
