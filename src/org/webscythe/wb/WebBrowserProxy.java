package org.webscythe.wb;


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

    public void dispose() {
        for (PhantomBrowser b: browsers) {
            b.endBrowserProcess();
        }
    }

}
