package org.webscythe.wb;


import org.webscythe.utils.SystemModule;

import java.util.Collection;
import java.util.LinkedList;

public class WebBrowserProxy {

    private Collection<PhantomBrowser> browsers = new LinkedList<PhantomBrowser>();

    public PhantomBrowser createBrowser() {
        PhantomBrowser phantomBrowser = new PhantomBrowser();
        browsers.add(phantomBrowser);
        phantomBrowser.startBrowserProcess();
        return phantomBrowser;
    }

    public Object createModule(String moduleName) {
        if ("sys".equalsIgnoreCase(moduleName)) {
            return new SystemModule();
        }
        return null;
    }

    public void dispose() {
        for (PhantomBrowser b: browsers) {
            b.endBrowserProcess();
        }
    }

}
