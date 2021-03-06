package org.webscythe.utils;

import java.io.File;
import java.io.IOException;

/**
 * Various system based functions.
 */
public class SystemModule {

    public SystemModule() {
    }

    public void saveText(String content, String filePath, String charset) throws IOException {
        File file = new File(filePath);
        CommonUtil.saveTextToFile(file, content, charset);
    }

    public void sleep(long milliseconds) throws InterruptedException {
        Thread.sleep(milliseconds);
    }

    public void print(Object o) {
        System.out.print(o);
    }

    public void println(Object o) {
        System.out.println(o);
    }

}
