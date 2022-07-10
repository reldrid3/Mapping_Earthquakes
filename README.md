# Mapping Earthquakes with Leaflet

## Overview

### Organization
I was a bit disappointed with the organization and tabbing/whitespace in the module and challenge codes, so I reorganized the code into sensible blocks:
1. Map Creation
    - This includes creation of tileLayers for the map background as well as the map itself and the baseMaps/overlays control.
2. Style Definitions
    - This includes styles for the circleMarkers, functions to determine radius and colors for the circleMarkers, and styles for the tectPlates lines.
3. Data
    - This includes gathering the different datasets from `d3.json()` calls and putting them into their respective layers.
    - My "slider" modification changed both the necessity for the "major" earthquake dataset as well as how the earthquake data was added to the map (in a control, rather than into an overlay).

### Slider Modification
I thought that adding an overlapping overlay called "Major Earthquakes," compared to "All Earthquakes," was a bit sloppy, so I decided to challenge myself and looked to the internet to implement a "Slider" control for the magnitudes of the earthquakes.  This is detailed in [this section](#slider-bar-creation).

## Deliverable #1
Tectonic plate lines were added with the following code (tectLineStyle defined in the Style block of code, earlier).  I chose a purple color, to stand out a bit more.

```
tectonicLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// 3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.
d3.json(tectonicLink).then(function(data) {
  L.geoJson(data, {
    style: tectLineStyle
  }).addTo(tectPlates);
  tectPlates.addTo(map);
});
```

## Deliverable #2
This entire deliverable was rendered obsolete by the addition of a Slider Bar, as seen in [this section](#slider-bar-creation).  I left the code to create and add the major earthquakes in place, but commented out, along with the layer declarations and additions to the overlays, for proof of completion with reference to the deliverable.  I hope that my Slider Implementation is more than sufficient for this.

## Deliverable #3
I created a "dark" tileLayer and added it to the main layer control.

## Slider Bar Creation
