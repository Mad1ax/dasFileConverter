import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

const LeafletMap = ({ markerData }) => {
  const [markers, setMarkers] = useState([]);

  //   const markers = [
  //     { geocode: [56.468156, 84.983309], popup: 'marker1',},
  //     { geocode: [56.471944, 84.983265], popup: 'marker2' },
  //     { geocode: [56.466213, 84.959924], popup: 'marker3' },
  //     { geocode: [56.091639, 38.852167], popup: 'marker4' },
  //   ];

//   setMarkers(markerData)

  const customIcon = new Icon({
    // iconUrl: markerIcon,
    iconUrl: require('../img/location-pin.png'),
    iconSize: [32, 32],
  });

  //   'https://cdn-icons-png.flaticon.com/32/5591/5591266.png'

  return (
    <div
      style={{
        height: '50vh',
        width: '95%',
        margin: '1%',
        border: '2px solid #ced4da',
        borderRadius: '2px',
      }}
    >
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[56.466525, 84.982564]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />


        {markers.map((marker) => (
          <Marker
            position={marker.geocode}
            icon={customIcon}
            key={marker.geocode}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}


      </MapContainer>
    </div>
  );
};

export default LeafletMap;
