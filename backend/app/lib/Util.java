/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package lib;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

/**
 *
 * @author kdp
 */
public class Util {

    public static String getStackTraceString(Exception e) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        e.printStackTrace(ps);
        return baos.toString();
    }

    public static models.Person getPersonByEmail(String email) {
        return models.Person.filter("email", email).first();
    }

}
