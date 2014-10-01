/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package models;
import com.google.code.morphia.annotations.Entity;
import play.modules.morphia.Model;

/**
 *
 * @author kdp
 */
@Entity
public class Person extends Model {
    public String name;
    public String email;
    public String password;
    
    public Person() {
        name = "";
        email = "";
        password = "";
    }
}
