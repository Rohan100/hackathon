"use client";
import React, { useState, useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector.js";
import { Icon, Style } from "ol/style.js";
import Overlay from "ol/Overlay.js";
import { Draw } from "ol/interaction";
import { FaArrowRight, FaLocationCrosshairs } from "react-icons/fa6";
import { createBox } from "ol/interaction/Draw";
import { Polygon } from "ol/geom";
import { FaDrawPolygon } from "react-icons/fa6";
import { FaStop } from "react-icons/fa6";
import axios from "axios";
import { useGlobal } from "../provider/userContext";
import { data } from "./data";
import SearchLocation from "./searchBar";
function Main() {
    const mapRef = useRef(null);
    const {setMap : setglobalMap}= useGlobal();
    const [crimeData,setCrimeData] = useState([]);
    console.log("use: ",crimeData)
    const popupRef = useRef(null);
    const [map, setMap] = useState(null);
    const [filtermarker, setFilterMarker] = useState([]);
    const [vectorlayer, setVectorLayer] = useState(null);
    const [popupContent, setPopupContent] = useState("");
    const [draw, setDraw] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [polyVector, setPolyVector] = useState(null); // Vector for drawn features
    const [sidebar, setSidebar] = useState(false)
    // const [details,setDetails] = useState([]);
    const MAX_WIDTH = 25000; // 5km
    const MAX_HEIGHT = 23000; // 3km
    // useEffect(()=>{
        
    // },[crimeData])
    const handleNext = () => {
        console.log("Next button clicked");
        setSidebar(true)
        if (polyVector)
            polyVector.getSource().clear()
    }
    
    const details = data;
    const showPopup = (feature, coordinate, popup) => {
        const details = feature.get("details"); // Get the marker details
        setPopupContent(
            <div className="text-black flex flex-col p-2">
                <div>
                    <strong>Location:</strong> {details.city}
                </div>
                <div>
                    <strong>Date:</strong> {details.crimeDate}
                </div>
                <div>
                    <strong>Danger level:</strong> {details.crime}
                </div>
                
            </div>
        );
        popup.setPosition(coordinate); // Set the position of the popup
    };

    // useEffect(async ()=>{
    //     try {
    //         const response = await axios.get("http://localhost:3000/api/server/data")
    //         setCrimeData(response.data)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // },[])

    useEffect(() => {


        const map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([73.7898, 19.9975]), // Center on Nashik
                zoom: 12,
            }),
        });

        const vectorsource = new VectorSource();
        const polysource = new VectorSource({ wrapX: false });

        const polyvector = new VectorLayer({
            source: polysource,
        });
        setPolyVector(polyvector); // Save the vector layer

        // Function to add markers to the map
        const addMarkersToMap = (detailsArray) => {
            vectorsource.clear(); // Clear previous markers
            detailsArray.forEach((detail) => {
                const marker = new Feature({
                    geometry: new Point(fromLonLat([detail.longitude, detail.latitude])),
                    details: detail,
                    isMarker: true,
                });



                // const markerLayer = new VectorLayer({
                //     title:'point',
                //     source: new VectorSource({
                //         features:[marker]
                //     }),
                //     style:new Style({
                //         image: new Icon({
                //             src: "/location-pin.png", // Ensure this path is correct
                //             anchor: [0.5, 1],
                //             scale: 0.1,
                //         }),
                //     })
                // })



                marker.setStyle(
                    new Style({
                        image: new Icon({
                            src: "/location-pin.png", // Ensure this path is correct
                            anchor: [0.5, 1],
                            scale: 0.1,

                        }),
                    })
                );


                vectorsource.addFeature(marker)

            });
        };

        addMarkersToMap(details); // Initially add all markers to the map

        const initailVectorLayer = new VectorLayer({
            source: vectorsource,
        });

        map.addLayer(initailVectorLayer);
        map.addLayer(polyvector);
        setMap(map);
        setVectorLayer(initailVectorLayer);

        const popup = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            stopEvent: false,
            offset: [0, -10],
        });
        map.addOverlay(popup);
        console.log(popupRef)

        map.on('singleclick', (event) => {
            // Check if any feature (marker) is at the clicked location
            const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
                return feature;
            });
            console.log(popupRef.current)
            if (feature && feature.values_.isMarker) {
                const coordinates = feature.getGeometry().getCoordinates();
                showPopup(feature, coordinates, popup); // Show popup for the clicked feature
            } else {
                // Hide the popup if no feature is clicked
                popup.setPosition(undefined);
            }
        });

        // Custom geometry function for drawing constrained rectangles
        const geometryFunction = function (coordinates, geometry) {
            const start = coordinates[0]; // Starting point (first corner)
            const end = coordinates[1]; // End point (current cursor location)

            const width = Math.abs(end[0] - start[0]);
            const height = Math.abs(end[1] - start[1]);

            const constrainedWidth = Math.min(width, MAX_WIDTH);
            const constrainedHeight = Math.min(height, MAX_HEIGHT);

            const constrainedEnd = [
                start[0] + (end[0] < start[0] ? -constrainedWidth : constrainedWidth),
                start[1] + (end[1] < start[1] ? -constrainedHeight : constrainedHeight),
            ];

            const boxCoordinates = [
                [start, [constrainedEnd[0], start[1]], constrainedEnd, [start[0], constrainedEnd[1]], start],
            ];

            if (!geometry) {
                geometry = new Polygon(boxCoordinates);
            } else {
                geometry.setCoordinates(boxCoordinates);
            }

            return geometry;
        };


        // Create the draw interaction
        const draw = new Draw({
            source: polysource,
            type: "Circle",
            geometryFunction: geometryFunction,
            maxPoints: 2,
        });

        // Function to check if a marker is inside the polygon
        const isMarkerInsidePolygon = (polygon, marker) => {
            const markerCoordinates = marker.getGeometry().getCoordinates();
            return polygon.intersectsCoordinate(markerCoordinates);
        };

        draw.on("drawstart", () => {
            if (polyvector) polyvector.getSource().clear();
        });

        draw.on("drawend", (event) => {
            const drawnFeature = event.feature;
            const polygon = drawnFeature.getGeometry();

            // Filter markers that are inside the drawn polygon

            const filteredMarkers = details.filter((detail) => {
                const marker = new Feature({
                    geometry: new Point(fromLonLat([detail.longitude, detail.latitude])),
                    details: detail,
                });
                return isMarkerInsidePolygon(polygon, marker);
            });
            setFilterMarker(filteredMarkers);

            // Display only markers inside the polygon
            addMarkersToMap(filteredMarkers);
        });

        popupRef.current.onClick = () => {
            setSidebar(true); // Open sidebar on popup click
        };


        setDraw(draw);
        mapRef.current = map;

        setglobalMap(map)

        return () => {
            map.setTarget(null);
        };
    }, []);



    const handleToggleDrawing = () => {
        if (!isDrawing) {
            map.addInteraction(draw); // Enable drawing
        } else {
            map.removeInteraction(draw); // Disable drawing
        }
        setIsDrawing(!isDrawing);
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const coordinates = fromLonLat([longitude, latitude]);

                    if (map) {
                        map.getView().animate({
                            center: coordinates,
                            zoom: 12,
                        });

                        const currentLocationMarker = new Feature({
                            geometry: new Point(coordinates),
                            details: "You are here",
                        });

                        currentLocationMarker.setStyle(
                            new Style({
                                image: new Icon({
                                    src: "/location-pin.png",
                                    anchor: [0.5, 1],
                                    scale: 0.1,
                                }),
                            })
                        );

                        vectorlayer.getSource().clear();
                        vectorlayer.getSource().addFeature(currentLocationMarker);
                    }
                },
                (error) => {
                    console.log("Error getting location: ", error);
                },
                {
                    enableHighAccuracy: true,
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <div className={`absolute custom_sc bg-white top-3 left-3 bottom-3 shadow-lg rounded-xl w-1/4 z-10 sidebar  scroll-m-1 ${filtermarker.length && 'open'} overflow-y-auto`}>
                {
                    filtermarker.map(details => {
                        return (<div key={details.crimeDate} className="text-black my-2 border rounded-xl m-2 shadow-lg border-gray-400  p-3">
                            <div>
                                <strong>Location:</strong> {details.city}
                            </div>
                            <div>
                                <strong>Date:</strong> {details.crimeDate}
                            </div>
                            <div>
                                <strong>Danger level:</strong> {details.crime}
                            </div>
                            <div>
                                <strong>Crime Detail:</strong> {details.crimeDetail}
                            </div>
                            
                        </div>)
                    })
                }
            </div>
            <div
                ref={popupRef}
                className="absolute bg-white p-2 rounded-xl w-80 h-auto border border-black shadow-2xl"
                style={{ display: popupContent ? "block" : "none", pointerEvents: "none", transform: "translate(-50%, -145%)", whiteSpace: "wrap" }}
            >
                {popupContent}
            </div>
            <div id="map" ref={mapRef} className="relative" style={{ width: "100%", height: "100vh" }}>


                <div className="absolute right-1 flex flex-col gap-2 top-64 z-10">
                    <button onClick={handleGetLocation} className="p-2 ms-auto w-fit  bg-[#007bff] text-white border-none rounded-sm">
                        <FaLocationCrosshairs className="text-2xl" />
                    </button>
                    <button onClick={handleToggleDrawing} className={`p-2 ${isDrawing ? "bg-red-500" : "bg-green-500"} text-white border-none rounded-sm`}>
                        {isDrawing ? <FaStop className="text-2xl" /> : <FaDrawPolygon className="text-2xl" />}
                    </button>
                    <button className="bg-black text-white p-2" onClick={handleNext}>
                        <FaArrowRight className="text-2xl" />
                    </button>
                </div>
            </div>
            <SearchLocation/>
        </div>
    );
}

export default Main;
