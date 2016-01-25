package org.webscythe.wb;

public class PhantomException extends RuntimeException {

    public PhantomException(String message) {
        super(message);
    }

    public PhantomException(Throwable cause) {
        super(cause);
    }

}
