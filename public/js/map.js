mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: 'mapbox://styles/mapbox/satellite-streets-v12', // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
});
// console.log(coordinates);
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: "my-class" })
      
      .setHTML(`<h4>${listing.location}</h4><p><b>Exact location will be provided after booking<b> </p>`)
  )
  .addTo(map);
