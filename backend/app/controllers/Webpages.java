package controllers;

import play.Logger;
import play.mvc.*;


@With(Interceptor.class)
public class Webpages extends Controller {

    public static void gatepass() {
        try {
            String email = session.get("email");
            if (email == null || email.isEmpty()) {
                renderTemplate("gatepass.html");
            } else {
                renderTemplate("plan.html");
            }
        } catch (Exception e) {
            Logger.warn(e.getMessage());
            renderTemplate("gatepass.html");
        }
    }

    public static void spotfix() {
        try {
            renderTemplate("plan.html");
        } catch (Exception e) {
            Logger.warn(e.getMessage());
            renderTemplate("gatepass.html");
        }
    }
}