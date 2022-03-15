mapboxgl.accessToken =
  "pk.eyJ1IjoidmlzaW9uLXRlYW0iLCJhIjoiY2sycDZxbG1uMDEybDNocnVzY3pxMW5oaiJ9.VR2bisvTVHxhsF7KZKt1qA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 0
});

map.on("load", async () => {
  const geojson = await getLocation();
  map.addSource("bus", {
    type: "geojson",
    data: geojson
  });
  map.addLayer({
    id: "bus",
    type: "symbol",
    source: "bus",
    layout: {
      "icon-image": "car-11",
      'icon-size': 2
    }
  });

  const findMyBusEndpoint =
    "https://1vslxwttna.execute-api.eu-west-1.amazonaws.com/test/coordinates";
  // response format :
  // [
  //   {
  //     "bus": "666",
  //     "lon": "4.665001173838925",
  //     "updated": "2022-03-12T07:13:40.427Z",
  //     "lat": "52.30193710699808"
  //   },
  //   {
  //     "bus": "667",
  //     "lon": "4.665001173838925",
  //     "updated": "2022-03-11T21:05:16.724Z",
  //     "lat": "52.30193710699808"
  //   }
  // ]

  // Update the source from the API every 2 seconds.
  // const updateSource = setInterval(async () => {
  //   console.log("Start getting location");
  //   const geojson = await getLocation(updateSource);
  //   map.getSource("iss").setData(geojson);
  // }, 2000);
  
  function mapFeature(bus) {
    console.log("Bus : " + bus)
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [bus.lon, bus.lat]
      }
    }
  }
  
  async function getLocation(updateSource) {
    try {
      let headers = new Headers();

      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const url = "https://1vslxwttna.execute-api.eu-west-1.amazonaws.com/test/coordinates";
      const proxy = "https://corsanywhere.herokuapp.com/";

      const response = await fetch(
        proxy + url,
        // url,
        { 
          mode: 'cors',
          method: 'GET',
          headers: headers
        }
      );
      console.log("print buses : ");
      const buses = await response.json();
      const { lat, lon } = buses[0];
      
      map.flyTo({
        center: [lon, lat],
        speed: 0.5
      });
      return {
        type: "FeatureCollection",
        features: buses.map(mapFeature)
      };
    } catch (err) {
      console.log("Err " + err)
      // If the updateSource interval is defined, clear the interval to stop updating the source.
      if (updateSource) clearInterval(updateSource);
      throw new Error(err);
    }
  }
});
