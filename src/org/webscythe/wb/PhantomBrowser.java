package org.webscythe.wb;

import org.webscythe.utils.CommonUtil;

import java.io.*;
import java.net.URL;
import java.util.logging.Logger;

public class PhantomBrowser {

    private final static Logger logger = Logger.getLogger(PhantomBrowser.class.getName());

    private static final int MIN_PORT = 20111;
    private static final int MAX_PORT = 40111;

    private static final String HEADLESS_BROWSER_FILENAME = "phantomjs";

    private static String phantomTemplate = null;


    public static synchronized String getPhantomTemplateAsString() throws IOException {
        if (phantomTemplate == null) {
            phantomTemplate = CommonUtil.readResourceAsString("/org/webscythe/wb/phantomjs_template.js");
        }
        return phantomTemplate;
    }


    private String workingDir = "c:/temp/webscythe/";

    private int browserPort = 0;

    private Process process = null;


    public void startBrowserProcess() {
        // find first available port for the browser server to listen
        for (int port = MIN_PORT; port <= MAX_PORT; port++) {
            if (CommonUtil.isPortAvailable(port)) {
                browserPort = port;
                break;
            }
        }

        if (browserPort == 0) {
            logger.severe("Cannot find available port for browser server!");
        }

        String browserExecutablePath = CommonUtil.getAbsoluteFilename(workingDir, HEADLESS_BROWSER_FILENAME);
        try {
            String template = getPhantomTemplateAsString();
            template = template.replaceAll("\\$\\{PORT\\}", String.valueOf(browserPort));

            String jsFileName = workingDir + "/phantom_input.js";
            CommonUtil.saveStringToFile(new File(jsFileName), template, "utf-8");

            ProcessBuilder pb = new ProcessBuilder(browserExecutablePath, jsFileName);
            process = pb.start();
            logger.info("Browser process started.");

            // wait until browser is up and listening
            long time = System.currentTimeMillis();
            while (CommonUtil.isPortAvailable(browserPort) && System.currentTimeMillis() - time <= 5000) {
                Thread.sleep(100L);
            }
            logger.info("Browser process is ready at port " + browserPort);
        } catch (IOException e) {
            throw new PhantomException(e);
        } catch (InterruptedException e) {
            throw new PhantomException(e);
        }
    }

    public void endBrowserProcess() {
        if (process != null) {
            try {
                process.destroy();
                logger.info("Browser process finished.");
            } catch (Exception e) {
                throw new PhantomException(e);
            }
        }
    }

    public String loadStringFromUrl(String url) {
        try {
            return CommonUtil.readStringFromUrl(new URL(url));
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    public void saveStringToFile(String content, String filename) {
        try {
            CommonUtil.saveStringToFile(new File(filename), content, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String load(String url, String paramsAsJsonStruct) {
        logger.info("Loading page " + url);
        String loadResult = new PhantomBridge(browserPort).load(url, paramsAsJsonStruct);
        logger.info("Page loaded!");
        return loadResult;
    }

    public String getPageContent(String pageId) {
        return new PhantomBridge(browserPort).getPageContent(pageId);
    }

    public String getUrl(String pageId) {
        return new PhantomBridge(browserPort).getUrl(pageId);
    }

    public String eval(String expression, String pageName) {
        return new PhantomBridge(browserPort).evaluateOnPage(expression, pageName);
    }

    public String includeJS(String pageName, String url) {
        return new PhantomBridge(browserPort).includeJS(pageName, url);
    }

    public String getCookies(String pageName) {
        return new PhantomBridge(browserPort).getCookies(pageName);
    }

    public String getAllCookies(String pageName) {
        return new PhantomBridge(browserPort).getAllCookies(pageName);
    }

    public String getCustomHeaders(String pageName) {
        return new PhantomBridge(browserPort).getCustomHeaders(pageName);
    }

}
