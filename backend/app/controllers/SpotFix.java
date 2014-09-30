package controllers;

import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSInputFile;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import play.data.binding.As;
import play.mvc.*;


@With(Interceptor.class)
public class SpotFix extends Controller {

    public static void newplan(String where,
            String description,
            @As("dd/MM/yyyy HH:mm") Date date,
            double latitude,
            double longitude,
            File photo) {
        try {
            //copy tmp file to mongodb gridfs
            GridFS gfs = new GridFS(models.SpotFix.db(), models.SpotFix.PHOTOS_GRIDFS_BUCKET);
            GridFSInputFile gfsFile = gfs.createFile(photo);
            gfsFile.setFilename(UUID.randomUUID().toString());
            gfsFile.save();

            //create SpotFix object
            //set its properties including gridfs file blob id
            //save the SpotFix object
            models.SpotFix sf = new models.SpotFix();
            sf.where = where;
            sf.description = description;
            sf.dateAndTime = date;
            sf.photos = new ArrayList<>();
            sf.photos.add(gfsFile.getId().toString());
            sf.plannedBy = null;
            sf.save();

            Map<String, Object> map = new HashMap<>();
            map.put("result", "ok");
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            renderJSON(map);
        }
    }

    public static void join(String where,
            String description,
            @As("dd/MM/yyyy HH:mm") Date date,
            double latitude,
            double longitude,
            File photo) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "ok");
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            renderJSON(map);
        }
    }

    public static void report(String where,
            String description,
            @As("dd/MM/yyyy HH:mm") Date date,
            double latitude,
            double longitude,
            File photo) {
        try {
            Map<String, Object> map = new HashMap<>();
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