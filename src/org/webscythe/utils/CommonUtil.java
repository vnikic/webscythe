package org.webscythe.utils;

import org.apache.commons.io.IOUtils;

import java.io.*;
import java.net.DatagramSocket;
import java.net.ServerSocket;
import java.net.URL;

public class CommonUtil {

    public static boolean isEmptyString(Object o) {
        if (o == null) {
            return true;
        }
        String s = o.toString();
        return s == null || "".equals(s.trim());
    }

    public static String adaptFilename(String filePath) {
        return filePath == null ? null : filePath.replace('\\', '/');
    }

    /**
     * Checks if specified file path is absolute. Criteria for recogning absolute file paths is
     * that i starts with /, \, or X: where X is some letter.
     *
     * @param path
     * @return True, if specified filepath is absolute, false otherwise.
     */
    public static boolean isPathAbsolute(String path) {
        if (path == null) {
            return false;
        }

        path = adaptFilename(path);
        int len = path.length();

        return (len >= 1 && path.startsWith("/")) ||
                (len >= 2 && Character.isLetter(path.charAt(0)) && path.charAt(1) == ':');
    }

    /**
     * For the given working path and file path returns absolute file path.
     *
     * @param workingPath
     * @param filePath
     * @return Absolute path of the second parameter according to absolute working path.
     */
    public static String getAbsoluteFilename(String workingPath, String filePath) {
        filePath = adaptFilename(filePath);

        // if file path is absolute, then return only filePath parameter
        if (isPathAbsolute(filePath)) {
            return filePath;
        } else {
            workingPath = adaptFilename(workingPath);
            if (workingPath.endsWith("/")) {
                workingPath = workingPath.substring(0, workingPath.length() - 1);
            }
            return workingPath + "/" + filePath;
        }
    }

    /**
     * Extracts a filename and directory from an absolute path.
     */
    public static String getDirectoryFromPath(String path) {
        path = adaptFilename(path);
        int index = path.lastIndexOf("/");

        return path.substring(0, index);
    }

    /**
     * Extracts a filename from an absolute path.
     */
    public static String getFileFromPath(String path) {
        int i1 = path.lastIndexOf("/");
        int i2 = path.lastIndexOf("\\");
        if (i1 > i2) {
            return path.substring(i1 + 1);
        }
        return path.substring(i2 + 1);
    }

    /**
     * Saves specified content to the file with specified charset.
     *
     * @param file
     * @param content
     * @param charset
     * @throws IOException
     * @throws UnsupportedEncodingException
     */
    public static void saveTextToFile(File file, String content, String charset) throws IOException {
        FileOutputStream out = new FileOutputStream(file);
        byte[] data = content.getBytes(charset);

        out.write(data);

        out.flush();
        out.close();
    }

    public static String readStringFromFile(File file, String encoding) throws IOException {
        if (!file.exists()) {
            throw new IOException("File doesn't exist!");
        }

        long fileLen = file.length();
        if (fileLen <= 0L) {
            if (file.exists()) {
                return ""; // empty file
            }
            return null; // all other file len problems
        }
        if (fileLen > Integer.MAX_VALUE) { // max String size
            throw new IOException("File too big for loading into a String!");
        }

        FileInputStream fis = null;
        InputStreamReader isr = null;
        BufferedReader brin = null;

        int length = (int) fileLen;
        char[] buf = null;
        int realSize = 0;
        try {
            fis = new FileInputStream(file);
            isr = new InputStreamReader(fis, encoding);
            brin = new BufferedReader(isr, 64 * 1024);
            buf = new char[length];
            int c;
            while ((c = brin.read()) != -1) {
                buf[realSize] = (char) c;
                realSize++;
            }
        } finally {
            if (brin != null) {
                brin.close();
                isr = null;
                fis = null;
            }
            if (isr != null) {
                isr.close();
                fis = null;
            }
            if (fis != null) {
                fis.close();
            }
        }
        return new String(buf, 0, realSize);
    }

    /**
     * Reads content from specified URL
     *
     * @param url
     * @return Read content as string.
     * @throws IOException
     */
    public static String readStringFromUrl(URL url) throws IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
        int ch;
        while ((ch = in.read()) != -1) {
            buffer.append((char) ch);
        }
        in.close();

        return buffer.toString();
    }

    public static byte[] readResourceFromUrl(URL url) throws IOException {
        InputStream input = url.openStream();
        byte[] bytes = IOUtils.toByteArray(input);
        input.close();
        return bytes;
    }

    public static String readResourceAsString(String resourcePath) {
        InputStream in = CommonUtil.class.getResourceAsStream(resourcePath);
        LineNumberReader reader = new LineNumberReader(new InputStreamReader(in));
        int ch;
        StringBuilder result = new StringBuilder();
        try {
            while ((ch = reader.read()) != -1) {
                result.append((char) ch);
            }
            return result.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Checks to see if a specific port is available.
     * @param port the port to check for availability
     */
    public static boolean isPortAvailable(int port) {
        ServerSocket ss = null;
        DatagramSocket ds = null;
        try {
            ss = new ServerSocket(port);
            ss.setReuseAddress(true);
            ds = new DatagramSocket(port);
            ds.setReuseAddress(true);
            return true;
        } catch (IOException e) {
        } finally {
            if (ds != null) {
                ds.close();
            }
            if (ss != null) {
                try {
                    ss.close();
                } catch (IOException e) {
                }
            }
        }

        return false;
    }

}
