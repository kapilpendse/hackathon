/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package models;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Indexed;
import com.google.code.morphia.annotations.Reference;
import com.google.code.morphia.utils.IndexDirection;
import java.util.Date;
import java.util.List;
import play.modules.morphia.Model;

/**
 *
 * @author kdp
 */
@Entity
public class SpotFix extends Model {
    public static final String PHOTOS_GRIDFS_BUCKET = "spotfix_photos";

    public String where;
    public String description;
    public Date dateAndTime;
    public List<String> photos;

    @Indexed(IndexDirection.GEO2D)
    protected double[] loc;

    @Reference
    public Person plannedBy;

    @Reference
    public List<Person> participants;
}
