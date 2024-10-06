// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Map from "ol/Map.js";
// import OSM from "ol/source/OSM.js";
// import TileLayer from "ol/layer/Tile.js";
// import View from "ol/View.js";
// import { fromLonLat } from "ol/proj";
// import Feature from "ol/Feature.js";
// import Point from "ol/geom/Point.js";
// import VectorLayer from "ol/layer/Vector.js";
// import VectorSource from "ol/source/Vector.js";
// import { Icon, Style } from "ol/style.js";
// import Overlay from "ol/Overlay.js";
// import { Draw } from "ol/interaction";
// import { FaLocationCrosshairs } from "react-icons/fa6";
// import { createBox } from "ol/interaction/Draw";
// import { Polygon } from "ol/geom";

// function Main() {
//     const mapRef = useRef(null);
//     const popupRef = useRef(null);
//     const [map, setMap] = useState(null);
//     const [vectorLayer, setVectorLayer] = useState(null);
//     const [popupContent, setPopupContent] = useState("");
//     const [draw, setDraw] = useState(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [polyVector, setPolyVector] = useState(null); // Vector for drawn features

//     const MAX_WIDTH = 5000; // 5km
//     const MAX_HEIGHT = 3000; // 3km

//     const details = [
//         { location: 'Spot 1', latitude: 19.9975, longitude: 73.7898, dangerLevel: 'High', date: '2024-09-01' },
//         { location: 'Spot 2', latitude: 19.9993, longitude: 73.7930, dangerLevel: 'Medium', date: '2024-09-05' },
//         { location: 'Spot 3', latitude: 19.9869, longitude: 73.7791, dangerLevel: 'Low', date: '2024-08-30' },
//         { location: 'Spot 4', latitude: 20.0051, longitude: 73.7982, dangerLevel: 'High', date: '2024-09-15' },
//         { location: 'Spot 5', latitude: 19.9874, longitude: 73.7712, dangerLevel: 'Low', date: '2024-09-10' },
//         { location: 'Spot 6', latitude: 19.9998, longitude: 73.7856, dangerLevel: 'Medium', date: '2024-09-08' },
//         { location: 'Spot 7', latitude: 19.9902, longitude: 73.7805, dangerLevel: 'High', date: '2024-09-12' },
//         { location: 'Spot 8', latitude: 20.0015, longitude: 73.7911, dangerLevel: 'Low', date: '2024-09-18' },
//         { location: 'Spot 9', latitude: 19.9923, longitude: 73.7888, dangerLevel: 'Medium', date: '2024-09-20' },
//         { location: 'Spot 10', latitude: 20.0037, longitude: 73.7819, dangerLevel: 'High', date: '2024-09-07' },
//         { location: 'Spot 11', latitude: 19.9950, longitude: 73.7994, dangerLevel: 'Low', date: '2024-08-28' },
//         { location: 'Spot 12', latitude: 19.9941, longitude: 73.7836, dangerLevel: 'High', date: '2024-09-03' },
//         { location: 'Spot 13', latitude: 19.9967, longitude: 73.7768, dangerLevel: 'Medium', date: '2024-09-09' },
//         { location: 'Spot 14', latitude: 19.9989, longitude: 73.7973, dangerLevel: 'Low', date: '2024-09-17' },
//         { location: 'Spot 15', latitude: 19.9870, longitude: 73.7822, dangerLevel: 'Medium', date: '2024-09-06' },
//         { location: 'Spot 16', latitude: 20.0023, longitude: 73.7739, dangerLevel: 'Low', date: '2024-09-11' },
//         { location: 'Spot 17', latitude: 19.9916, longitude: 73.7899, dangerLevel: 'High', date: '2024-09-16' },
//         { location: 'Spot 18', latitude: 19.9990, longitude: 73.7942, dangerLevel: 'Medium', date: '2024-09-14' },
//         { location: 'Spot 19', latitude: 19.9885, longitude: 73.7925, dangerLevel: 'High', date: '2024-09-13' },
//         { location: 'Spot 20', latitude: 20.0049, longitude: 73.7876, dangerLevel: 'Medium', date: '2024-09-19' }
//         // ... (other details)
//     ];

//     useEffect(() => {
//         const map = new Map({
//             target: "map",
//             layers: [
//                 new TileLayer({
//                     source: new OSM(),
//                 }),
//             ],
//             view: new View({
//                 center: fromLonLat([73.7898, 19.9975]), // Center on Nashik
//                 zoom: 12,
//             }),
//         });

//         const vectorSource = new VectorSource();
//         const polysource = new VectorSource({ wrapX: false });

//         const polyvector = new VectorLayer({
//             source: polysource,
//         });
//         setPolyVector(polyvector); // Save the vector layer

        


//         const addMarkersToMap = (detailsArray) => {
//             vectorSource.clear(); // Clear previous markers
//             detailsArray.forEach((detail) => {
//                 const marker = new Feature({
//                     geometry: new Point(fromLonLat([detailsArray.longitude, detailsArray.latitude])),
//                     detailsArray: detail,
//                 });
    
//                 marker.setStyle(
//                     new Style({
//                         image: new Icon({
//                             src: "/location-pin.png", // Ensure this path is correct
//                             anchor: [0.5, 1],
//                             scale: 0.1,
//                         }),
//                     })
//                 );
    
//                 vectorSource.addFeature(marker);
//             });
//         };
//         addMarkersToMap(detailsArray); // Add markers to map on load
//         // details.forEach((detail) => {
//         //     const marker = new Feature({
//         //         geometry: new Point(fromLonLat([detail.longitude, detail.latitude])),
//         //         details: detail,
//         //     });
//         //     marker.on("singleclick", function (event) {
//         //         const feature = map.forEachFeatureAtPixel(event.pixel, function (feat) {
//         //             return feat;
//         //         });
    
//         //         if (feature) {
//         //             const coordinates = feature.getGeometry().getFlatCoordinates();
//         //             const details = feature.get("details");
    
//         //             setPopupContent(
//         //                 <div className="text-black">
//         //                     <div>
//         //                         <strong>Location:</strong> {details.location}
//         //                     </div>
//         //                     <div>
//         //                         <strong>Date:</strong> {details.date}
//         //                     </div>
//         //                     <div>
//         //                         <strong>Danger level:</strong> {details.dangerLevel}
//         //                     </div>
//         //                 </div>
//         //             );
//         //             popup.setPosition(fromLonLat(coordinates));
//         //         } else {
//         //             popup.setPosition(undefined);
//         //         }
//         //     });
//         //     marker.setStyle(
//         //         new Style({
//         //             image: new Icon({
//         //                 src: "/location-pin.png", // Ensure this path is correct
//         //                 anchor: [0.5, 1],
//         //                 scale: 0.1,
//         //             }),
//         //         })
//         //     );

//         //     vectorSource.addFeature(marker);
//         // });

//         const initailVectorLayer = new VectorLayer({
//             source: vectorSource,
//         });

//         map.addLayer(initailVectorLayer);
//         map.addLayer(polyvector);
//         setMap(map);
//         setVectorLayer(initailVectorLayer);

//         const popup = new Overlay({
//             element: popupRef.current,
//             positioning: "bottom-center",
//             stopEvent: false,
//             offset: [0, -10],
//         });
//         map.addOverlay(popup);

       

//         // Custom geometry function for drawing constrained rectangles
//         const geometryFunction = function (coordinates, geometry) {
//             const start = coordinates[0]; // Starting point (first corner)
//             const end = coordinates[1]; // End point (current cursor location)

//             const width = Math.abs(end[0] - start[0]);
//             const height = Math.abs(end[1] - start[1]);

//             const constrainedWidth = Math.min(width, MAX_WIDTH);
//             const constrainedHeight = Math.min(height, MAX_HEIGHT);

//             const constrainedEnd = [
//                 start[0] + (end[0] < start[0] ? -constrainedWidth : constrainedWidth),
//                 start[1] + (end[1] < start[1] ? -constrainedHeight : constrainedHeight),
//             ];

//             const boxCoordinates = [
//                 [start, [constrainedEnd[0], start[1]], constrainedEnd, [start[0], constrainedEnd[1]], start],
//             ];

//             if (!geometry) {
//                 geometry = new Polygon(boxCoordinates);
//             } else {
//                 geometry.setCoordinates(boxCoordinates);
//             }

//             return geometry;
//         };

//         // Create the draw interaction
//         const draw = new Draw({
//             source: polysource,
//             type: "Circle",
//             geometryFunction: geometryFunction,
//             maxPoints: 2,
//         });

//         const isMarkerInsidePolygon = (polygon, marker) => {
//             const markerCoordinates = marker.getGeometry().getCoordinates();
//             return polygon.intersectsCoordinate(markerCoordinates);
//         }

//         draw.on("drawstart", () => {
//             if (polyvector) polyvector.getSource().clear();
//         });

//         draw.on("drawend", (event) => {
//             const feature = event.feature;

//             const polygon = drawnFeature.getGeometry();

//             const filteredMakers = details.filter((detail) => {
//                 const marker = new Feature({
//                     geometry: new Point(fromLonLat([detail.longitude, detail.latitude])),
//                     details: detail,
//                 })
//                 return isMarkerInsidePolygon(polygon, marker);
//             })
//             addMarkersToMap(filteredMakers)
//             console.log("Drawn Rectangle:", feature);
//         });

//         setDraw(draw);
//         mapRef.current = map;

//         return () => {
//             map.setTarget(null);
//         };
//     }, []);

//     const handleToggleDrawing = () => {
//         if (!isDrawing) {
//             map.addInteraction(draw); // Enable drawing
//         } else {
//             map.removeInteraction(draw); // Disable drawing
//         }
//         setIsDrawing(!isDrawing);
//     };

//     const handleGetLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     const coordinates = fromLonLat([longitude, latitude]);

//                     if (map) {
//                         map.getView().animate({
//                             center: coordinates,
//                             zoom: 12,
//                         });

//                         const currentLocationMarker = new Feature({
//                             geometry: new Point(coordinates),
//                             details: "You are here",
//                         });

//                         currentLocationMarker.setStyle(
//                             new Style({
//                                 image: new Icon({
//                                     src: "/location-pin.png",
//                                     anchor: [0.5, 1],
//                                     scale: 0.1,
//                                 }),
//                             })
//                         );

//                         vectorLayer.getSource().clear();
//                         vectorLayer.getSource().addFeature(currentLocationMarker);
//                     }
//                 },
//                 (error) => {
//                     console.log("Error getting location: ", error);
//                 },
//                 {
//                     enableHighAccuracy: true,
//                 }
//             );
//         } else {
//             console.error("Geolocation is not supported by this browser.");
//         }
//     };

//     return (
//         <div>
//             <div id="map" ref={mapRef} className="relative" style={{ width: "100%", height: "100vh", marginBottom: "20px" }}>
//                 <div
//                     ref={popupRef}
//                     className="absolute bg-white p-2 rounded-xl w-80 h-auto border border-black shadow-2xl"
//                     style={{ display: popupContent ? "block" : "none", pointerEvents: "none", transform: "translate(-50%, -145%)", whiteSpace: "wrap" }}
//                 >
//                     {popupContent}
//                 </div>

//                 <div className="absolute left-4 top-64 z-10">
//                     <button onClick={handleGetLocation} className="p-2 mb-2 bg-[#007bff] text-white border-none rounded-sm">
//                         <FaLocationCrosshairs />
//                     </button>
//                     <button onClick={handleToggleDrawing} className={`p-2 ${isDrawing ? "bg-red-500" : "bg-green-500"} text-white border-none rounded-sm`}>
//                         {isDrawing ? "Stop Drawing" : "Draw Rectangle"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Main;
