package controllers;


import play.Logger;
import play.mvc.Before;
import play.mvc.Controller;


public class Interceptor extends Controller {
    
    /**
     */
    @Before(priority = 1,
            unless = {
                "Person.login",
                "Person.signup",
                "Webpages.gatepass"
            })
    static void validateSession() {
        try {
            String email = session.get("email");
            if (email == null || email.isEmpty()) {
                redirect("/");
            }
        } catch (Exception e) {
            Logger.warn(e.getMessage());
            redirect("/");
        }
    }
}

