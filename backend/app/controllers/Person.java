package controllers;

import java.util.HashMap;
import java.util.Map;
import lib.Util;
import play.mvc.*;


@With(Interceptor.class)
public class Person extends Controller {

    public static void signup(String name,
            String email,
            String password) {
        try {
            Map<String, Object> map = new HashMap<>();

            if(Util.getPersonByEmail(email) != null) {
                map.put("result", "error");
                map.put("reason", "account with same email exists");
            } else {
                models.Person person = new models.Person();
                person.name = name;
                person.email = email;
                person.password = password;
                person.save();
                map.put("result", "ok");
                session.put("email", email);
            }
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            renderJSON(map);
        }
    }

    public static void login(String email,
            String password) {
        try {
            Map<String, Object> map = new HashMap<>();
            models.Person person = models.Person.filter("email", email).first();
            if(Util.getPersonByEmail(email) != null &&
                    person.password.equals(password)) {
                map.put("result", "ok");
                session.put("email", email);
            } else {
                map.put("result", "error");
                map.put("reason", "invalid email or password");
                session.remove("email");
            }
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            renderJSON(map);
        }
    }

    public static void logout() {
        try {
            Map<String, Object> map = new HashMap<>();
            session.remove("email");
            map.put("result", "ok");
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            renderJSON(map);
        }
    }
}