package com.stoneitgt.sogongja.user.service;


import com.stoneitgt.sogongja.user.geotools.HeatmapProcess;
import com.stoneitgt.sogongja.user.mapper.AreaMapper;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.map.GridCoverageLayer;
import org.geotools.map.MapContent;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.geotools.renderer.GTRenderer;
import org.geotools.renderer.lite.StreamingRenderer;
import org.geotools.styling.Style;
import org.geotools.styling.StyleFactory;
import org.geotools.swing.JMapFrame;
import org.geotools.swing.dialog.JExceptionReporter;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.MultiPoint;
import org.locationtech.jts.geom.impl.PackedCoordinateSequenceFactory;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.opengis.util.ProgressListener;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.referencing.CRS;
import org.geotools.xml.styling.SLDParser;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;


@Service
public class GeoService {

    @Autowired
    private AreaMapper areaMapper;

    @Autowired
    private AppProperties app;

    static StyleFactory styleFactory = CommonFactoryFinder.getStyleFactory();

    public byte[] makeHeatMap(Map<String, Object> params) throws FactoryException {

        // csv 로 된 데이터를 db 저장
        // db 에 저장된 값을 shapefile 로 만든걸 이미지로 만들어서 가져옴?
        double lat = Double.parseDouble(params.get("lat").toString());
        double lng = Double.parseDouble(params.get("lng").toString());
        int meter = Integer.parseInt(params.get("meter").toString());
//        double latInterval = 0.002727; // 0.000909 * 3
//        double lngInterval = 0.003375; // 0.001125 * 3
        double latInterval = 0.000909 * (meter/100);
        double lngInterval = 0.001125 * (meter/100);

        double x1 = lat - latInterval;
        double x2 = lat + latInterval;
        double y1 = lng - lngInterval;
        double y2 = lng + lngInterval;

        params.put("x1", x1);
        params.put("x2", x2);
        params.put("y1", y1);
        params.put("y2", y2);
        params.put("scope", "'F'");

        List<Map<String, Object>> researchShopList = areaMapper.getResearchShopList(params);
        System.out.println(researchShopList.size());
        Coordinate[] data = new Coordinate[researchShopList.size()];

        for (int i = 0; i < researchShopList.size(); i++) {
            data[i] = new Coordinate(Double.parseDouble(researchShopList.get(i).get("latitude").toString()), Double.parseDouble(researchShopList.get(i).get("longitude").toString()));
        }

        ReferencedEnvelope bounds =
                new ReferencedEnvelope(x1 , x2, y1 , y2, DefaultGeographicCRS.WGS84);

//        Coordinate[] data = {
//                new Coordinate(37.49143000000000, 127.05565000000000),
//                new Coordinate(37.49145500000000, 127.05565000000000),
//                new Coordinate(37.49069200000000, 127.05612000000000),
//                new Coordinate(37.49392700000000, 127.06290400000000),
//                new Coordinate(37.49334300000000, 127.06190500000000)
//        };
        SimpleFeatureCollection fc = createPoints(data, bounds);

        ProgressListener monitor = null;
        int width = (int) Math.round(getDistance(x1, y1, x2, y1) * 0.5);
        int height = (int) Math.round(getDistance(x1, y1, x1, y2) * 0.5);
        System.out.println(width + "," + height);
//        int width = 320;
//        int height = 320;
        HeatmapProcess process = new HeatmapProcess();
        GridCoverage2D cov =
                process.execute(
                        fc, // data
                        50, // radius
                        null, // weightAttr
                        1, // pixelsPerCell
                        bounds, // outputEnv
                        width, // outputWidth
                        height, // outputHeight
                        monitor // monitor)
                );


        MapContent map = new MapContent();
        File sld = new File(app.getGeotoolsSld());

        Style styles = createFromSLD(sld);

        GridCoverageLayer layer = new GridCoverageLayer(cov, styles);
        map.addLayer(layer);


        GTRenderer renderer = new StreamingRenderer();
        renderer.setMapContent(map);

        Rectangle imageBounds = null;
        ReferencedEnvelope mapBounds = null;

        mapBounds = map.getMaxBounds();
        System.out.println("mapBounds : " + mapBounds);
        double heightToWidth = mapBounds.getSpan(1) / mapBounds.getSpan(0);
        System.out.println("heightToWidth : " + heightToWidth);
        imageBounds = new Rectangle(
                0, 0, width, height);
//            imageBounds = new Rectangle(
//                    0, 0, imageWidth, (int) Math.round(imageWidth * heightToWidth));
        System.out.println("imageBounds : " + imageBounds);


        BufferedImage image = new BufferedImage(imageBounds.width, imageBounds.height, BufferedImage.TYPE_INT_ARGB);

        Graphics2D gr = image.createGraphics();
        gr.setComposite(AlphaComposite.Clear);
        gr.fill(imageBounds);

        renderer.paint(gr, imageBounds, mapBounds);

        BufferedImage mimg = new BufferedImage(image.getHeight(), image.getWidth(), BufferedImage.TYPE_INT_ARGB);

        //create mirror image pixel by pixel
        for(int y = 0; y < image.getHeight(); y++){
            for(int x = 0; x < image.getWidth(); x++){
                //lx starts from the left side of the image
                //rx starts from the right side of the image
                //get source pixel value
                int p = image.getRGB(x, y);
                //set mirror image pixel value - both left and right
                mimg.setRGB(image.getHeight() - y - 1, image.getWidth() - x - 1, p);
            }
        }

        try {

            ImageIO.write(mimg, "png", new File("C:\\Users\\start\\Downloads\\aaaaaaaa.png"));


            ByteArrayOutputStream outStreamObj = new ByteArrayOutputStream();
            ImageIO.write(mimg, "png", outStreamObj);
            return outStreamObj.toByteArray();
        } catch (IOException e) {
            return null;
        }finally {
            map.dispose();
        }

    }

    private double getDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat/2)* Math.sin(dLat/2)+ Math.cos(Math.toRadians(lat1))* Math.cos(Math.toRadians(lat2))* Math.sin(dLon/2)* Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        double d =6371 * c * 1000;    // Distance in m
        return d;
    }

    private SimpleFeatureCollection createPoints(Coordinate[] pts, ReferencedEnvelope bounds) {

        SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
        tb.setName("data");
        tb.setCRS(bounds.getCoordinateReferenceSystem());
        tb.add("shape", MultiPoint.class);
        tb.add("value", Double.class);

        SimpleFeatureType type = tb.buildFeatureType();
        SimpleFeatureBuilder fb = new SimpleFeatureBuilder(type);
        DefaultFeatureCollection fc = new DefaultFeatureCollection();
        GeometryFactory factory = new GeometryFactory(new PackedCoordinateSequenceFactory());
        for (Coordinate p : pts) {
            Geometry point = factory.createPoint(p);
            fb.add(point);
            fb.add(p.getZ());
            fc.add(fb.buildFeature(null));
        }


        return fc;
    }

    private Style createFromSLD(File sld) {
        try {
            SLDParser stylereader = new SLDParser(styleFactory, sld.toURI().toURL());
            Style[] style = stylereader.readXML();
            return style[0];

        } catch (Exception e) {
            JExceptionReporter.showDialog(e, "Problem creating style");
        }
        return null;
    }

}
