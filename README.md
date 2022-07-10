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
After seeing Deliverable #2's request to add another layer of earthquakes of magnitude > 4.5, which would be completely undetectable (and duplicative) unless the "all earthquakes" overlay was turned off in the control, I decided to alter the goal, that instead of making an entire overlapping layer, I could create a control that would filter the layer based on a slider.  This was much more difficult than I had originally planned (I assumed Leaflet may have had a plugin or control ready to go), but I persevered as follows.

### Finding a Template
I went searching for Leaflet Sliders, and came across two possible plugins, of which I used the LeafletSlider, written by Dennis Wilhelm, hosted under an MIT license on [GitHub](https://github.com/dwilhelm89/LeafletSlider).  A few points about this code:
- The code was based on jQuery, as I found, and I needed to add jQuery's JS and CSS code, as well as the jQuery UI JS code.
- The sliderControl itself is an extension of a Leaflet control - essentially a class that inherits L.Control, so it was easier to understand in that regard.
- This slider was set up as a filter for an ordered time series - converting this to filter by earthquake magnitude, instead, was a challenge.
    - Honestly, it was more of a challenge due to an excess of features and options that were set for the time code, that would either be inapplicable for magnitudes or set as a default for this particular implementation.  I removed a good bit of code to simplify the sliderControl.

### Features Remaining
Some things that the slider had coded already that I left in place, besides the main guts of the class (add, remove, init, etc.), are:
- Disabling and Enabling map dragging, so that the map isn't dragged while the slider is adjusted
- A "timestamp" was displayed below the slider, to show the current timestamp being adjusted.  This was modified to display the current range of magnitudes being filtered by.

### Changing Time to Magnitudes
Adjusting this indexed-time filtering to filtering by magnitude required a bit of tinkering with the min and max values - originally, they were set to the first and last index of the array, but I had to set them to the minimum and maximum value of the earthquake data (calculated painstakingly in the [challenge logic](static/js/challenge_logic.js) file).  I still needed the array data to sift through the markers each time, however - I just used my minValue and maxValue much more than minIndex and maxIndex.

### Filtering
The filtering was already being done one at a time - essentially, each earthquake becomes an individual layer that is added to the map, and everytime the slider is adjusted, all those layers are removed from the map before a new filtering is applied.

### Screenshots
