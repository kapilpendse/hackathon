package controllers;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import java.io.File;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lib.Util;
import org.bson.types.ObjectId;
import play.Logger;
import play.data.binding.As;
import play.libs.MimeTypes;
import play.mvc.*;


@With(Interceptor.class)
public class SpotFix extends Controller {

    private static class GeoJSONSerializer implements JsonSerializer<models.SpotFix> {

        public JsonElement serialize(models.SpotFix sf, Type typeOfSrc, JsonSerializationContext context) {
            JsonObject feature = new JsonObject();
            feature.addProperty("type", "Feature");

            JsonObject properties = new JsonObject();
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm");
            properties.addProperty("name", sf.where);
            properties.addProperty("description", sf.description);
            properties.addProperty("date", df.format(sf.dateAndTime));
            JsonArray photos = new JsonArray();
            for(String p : sf.photos) {
                photos.add(new JsonPrimitive(p));
            }
            properties.add("photos", photos);
            properties.addProperty("plannedby", sf.plannedBy.name);
            JsonArray participants = new JsonArray();
            for(models.Person participant : sf.participants) {
                participants.add(new JsonPrimitive(participant.name));
            }
            properties.add("participants", participants);
            feature.add("properties", properties);
            
            JsonObject geometry = new JsonObject();
            geometry.addProperty("type", "Point");
            JsonArray coordinates = new JsonArray();
            coordinates.add(new JsonPrimitive(sf.loc[0]));
            coordinates.add(new JsonPrimitive(sf.loc[1]));
            geometry.add("coordinates", coordinates);
            feature.add("geometry", geometry);

            return feature;
        }
    }
    
    public static void newphoto(File photo) {
        try {
            //copy tmp file to mongodb gridfs and then delete tmp file
            GridFS gfs = new GridFS(models.SpotFix.db(), models.SpotFix.PHOTOS_GRIDFS_BUCKET);
            GridFSInputFile gfsFile = gfs.createFile(photo);
            gfsFile.setFilename(UUID.randomUUID().toString());
            gfsFile.setContentType(MimeTypes.getContentType(photo.getName()));
            gfsFile.save();
            photo.delete();

            Map<String, Object> map = new HashMap<>();
            map.put("result", "ok");
            map.put("blobid", gfsFile.getId().toString());
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            Logger.warn(exp.getMessage());
            Logger.error(Util.getStackTraceString(exp));
            renderJSON(map);
        }
    }

    public static void getphoto(String photoid) {
        try {
            //extract file from mongodb and render as binary with correct content-type
            GridFS gfs = new GridFS(models.SpotFix.db(), models.SpotFix.PHOTOS_GRIDFS_BUCKET);
            GridFSDBFile gfsFile = gfs.find(new ObjectId(photoid));
            response.setContentTypeIfNotSet(gfsFile.getContentType());
            renderBinary(gfsFile.getInputStream());
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            Logger.warn(exp.getMessage());
            Logger.error(Util.getStackTraceString(exp));
            renderJSON(map);
        }
    }

    public static void newplan(String where,
            String description,
            @As("dd/MM/yyyy HH:mm") Date date,
            double latitude,
            double longitude,
            String photoid) {
        try {
            //create SpotFix object
            //set its properties including gridfs file blob id
            //save the SpotFix object
            models.SpotFix sf = new models.SpotFix();
            sf.where = where;
            sf.description = description;
            sf.dateAndTime = date;
            sf.photos.add(photoid);
            sf.loc[0] = longitude;
            sf.loc[1] = latitude;
            sf.plannedBy = Util.getPersonByEmail(session.get("email"));
            sf.participants.add(sf.plannedBy);
            sf.save();

            Map<String, Object> map = new HashMap<>();
            map.put("result", "ok");
            renderJSON(map);
        } catch (Exception exp) {
            Map<String, Object> map = new HashMap<>();
            map.put("result", "error");
            map.put("reason", exp.getMessage());
            Logger.warn(exp.getMessage());
            Logger.error(Util.getStackTraceString(exp));
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
    
    public static void all() {
        try {
            List<models.SpotFix> sf = models.SpotFix.findAll();
            Map<String, Object> map = new HashMap<>();
            map.put("type", "FeatureCollection");
            map.put("features", sf);
            renderJSON(map, new GeoJSONSerializer());
        } catch (Exception exp) {
            Logger.error(exp.getMessage());
            Logger.error(Util.getStackTraceString(exp));
            List<models.SpotFix> sf = new ArrayList<>();
            Map<String, Object> map = new HashMap<>();
            map.put("type", "FeatureCollection");
            map.put("features", sf);
            renderJSON(map, new GeoJSONSerializer());
        }
    }

}