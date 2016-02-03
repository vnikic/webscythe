package org.webscythe.wb;

import org.json.JSONException;
import org.json.JSONObject;

public class PhantomException extends RuntimeException {

    JSONObject errObject = null;

    public PhantomException(String message) {
        super(message);
        try {
            errObject = new JSONObject(message);
        } catch (JSONException e) {
            // do nothing - cannot create JSON object of the message string
        }
    }

    public PhantomException(Throwable cause) {
        super(cause);
    }

    @Override
    public String getMessage() {
        String msg = super.getMessage();
        if (errObject != null) {
            msg = errObject.optString("msg", msg);
        }
        return "BROWSER: " + msg;
    }

}
