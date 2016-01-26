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

}
