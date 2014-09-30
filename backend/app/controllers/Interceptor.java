package controllers;


import play.Logger;
import play.mvc.Before;
import play.mvc.Controller;


public class Interceptor extends Controller {
    
    /**
     */
    @Before(priority = 1,
            unless = {
                "SpotFix.signup"
            })
    static void validateSession() {
        try {
            String email = params.get("email");
            if (email == null || email.isEmpty()) {
                forbidden();
            }
        } catch (Exception e) {
            Logger.warn(e.getMessage());
            forbidden();
        }
    }
}

