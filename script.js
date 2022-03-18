mapboxgl.accessToken =
  "pk.eyJ1IjoidmlzaW9uLXRlYW0iLCJhIjoiY2sycDZxbG1uMDEybDNocnVzY3pxMW5oaiJ9.VR2bisvTVHxhsF7KZKt1qA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 0
});

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

function readToken() {
  // for some reason params are passed as url fragment after `#` and not as url params after `?`
  // const urlFragment = window.location.search;
  const urlFragment = window.location.hash.substring(1);
  const params = new URLSearchParams(urlFragment);

  const idToken = params.get('id_token');
  const accessToken = params.get('access_token');
  const expires = params.get('expires_in');
  const type = params.get('token_type');

  console.log("1: " + idToken);
  console.log("2: " + accessToken);
  console.log("3: " + expires);
  console.log("4 : " + type);

  return idToken;
}

async function getLocation(updateSource) {
  try {
    let headers = new Headers();

    const token = readToken();
    console.log("Token : " + token);

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', token);

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
    const buses = await response.json();
    console.log("buses : " + buses);
// response format :
// [
//   {
//     "bus": "666",
//     "lon": "4.665001173838925",
//     "updated": "2022-03-12T07:13:40.427Z",
//     "lat": "52.30193710699808"
//   },
//   ...
// ]

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

///// 

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

  // const updateSource = setInterval(async () => {
  //   console.log("Start getting location");
  //   const geojson = await getLocation(updateSource);
  //   map.getSource("iss").setData(geojson);
  // }, 10000);
});