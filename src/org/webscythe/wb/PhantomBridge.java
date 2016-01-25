package org.webscythe.wb;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.webscythe.utils.CommonUtil;
import org.webscythe.utils.Pair;
import org.webscythe.utils.StringPair;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class PhantomBridge {

    private int phantomPort = -1;


    public PhantomBridge(int phantomPort) {
        this.phantomPort = phantomPort;
    }

    private String encode(String s) {
        try {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < s.length(); i++) {
                char ch = s.charAt(i);
                if (ch == '+') {
                    result.append("%2B");
                } else {
                    result.append(URLEncoder.encode(String.valueOf(ch), "utf-8"));
                }
            }
            return result.toString();
        } catch (Exception e) {
            throw new PhantomException(e);
        }
    }

    public String sendActionRequest(String action, StringPair... params) {
        try {
            StringBuilder b = new StringBuilder();
            b.append("http://localhost:").append(phantomPort).append("/?action=").append(action);
            if (params != null) {
                for (Pair<String, String> pair: params) {
                    if (!CommonUtil.isEmptyString(pair.key) && pair.value != null) {
                        b.append("&").append(encode(pair.key)).append("=").append(encode(pair.value));
                    }
                }
            }

            Pair<Integer, String> result = sendRequest(b.toString());

            if (result.key == 200) {
                return result.value;
            } else {
                throw new PhantomException(result.value);
            }
        } catch (Exception e) {
            throw new PhantomException(e);
        }
    }

    private Pair<Integer, String> sendRequest(String urlString) throws IOException {
        String params = null;
        // get parameters after ?
        final int index = urlString.indexOf("?");
        if (index > 0) {
            if (index < urlString.length() - 1) {
                params = urlString.substring(index + 1);
            }
            urlString = urlString.substring(0, index);
        }
        URL u = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) u.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(params != null ? params.length() : 0));
        DataOutputStream os = new DataOutputStream(conn.getOutputStream());
        if (params != null) {
            os.writeBytes(params);
        }
        os.flush();
        os.close();

        InputStream in = conn.getInputStream();

        int responseCode = conn.getResponseCode();


        String content = IOUtils.toString(conn.getInputStream(), "UTF-8");

        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        int ch;
        while ((ch = reader.read()) != -1) {
            buffer.append((char) ch);
        }
        reader.close();

        return new Pair<Integer, String>(responseCode, content);
    }

    public String load(String url, String jsonStruct) {
        if (CommonUtil.isEmptyString(url)) {
            url = "";
        }
        JSONObject params;

        try {
            params = new JSONObject(jsonStruct);
        } catch (JSONException e) {
            e.printStackTrace();
            params = new JSONObject();
        }

        return sendActionRequest(
                "load",
                new StringPair("url", url),
                new StringPair("page", params.optString("page")),
                new StringPair("width", params.optString("width")),
                new StringPair("height", params.optString("height")),
                new StringPair("paperformat", params.optString("paperformat")),
                new StringPair("paperorientation", params.optString("paperorientation")),
                new StringPair("paperborder", params.optString("paperborder")),
                new StringPair("loadimages", params.optString("loadimages")),
                new StringPair("useragent", params.optString("useragent")),
                new StringPair("username", params.optString("username")),
                new StringPair("password", params.optString("password")),
                new StringPair("zoomfactor", params.optString("zoomfactor")),
                new StringPair("content", params.optString("content", ""))
        );
    }

    public String getPageContent(String pageId) {
        return sendActionRequest("getcontent", new StringPair("page", pageId));
    }

    public String getUrl(String pageId) {
        return sendActionRequest("geturl", new StringPair("page", pageId));
    }

    public String evaluateOnPage(String expression, String pageName) {
        return sendActionRequest(
                "eval",
                new StringPair("exp", expression),
                new StringPair("page", pageName)
        );
    }

    public String includeJS(String pageName, String url) {
        return sendActionRequest(
                "includejs",
                new StringPair("url", url),
                new StringPair("page", pageName)
        );
    }

    public String getCookies(String pageName) {
        return sendActionRequest("getcookies", new StringPair("page", pageName));
    }

    public String getAllCookies(String pageName) {
        return sendActionRequest("getallcookies", new StringPair("page", pageName));
    }

    public String getCustomHeaders(String pageName) {
        return sendActionRequest("getcustomheaders", new StringPair("page", pageName));
    }

    public String renderToImage(String type, String pageName) {
        return sendActionRequest("rendertoimage", new StringPair("type", type), new StringPair("page", pageName));
    }

//    public String renderToPdf(String path, String pageName) {
//        path = CommonUtil.getAbsoluteFilename(workingDir, path);
//        return sendActionRequest("rendertopdf", new Pair<String, String>("page", pageName));
//    }

}