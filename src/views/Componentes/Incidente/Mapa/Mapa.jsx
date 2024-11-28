import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Mapa = ({ onLocationSelect, isSelecting }) => {
  // Personalizamos el evento para capturar clics en el mapa y agregar un marcador solo si estamos seleccionando
  function ClickEventos() {
    useMapEvents({
      click(e) {
        if (isSelecting) {
          const newLocation = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            link: `https://www.google.com/maps?q=${e.latlng.lat},${e.latlng.lng}`, // Generar enlace
          };
          onLocationSelect(newLocation.link);  // Llamamos a la función que pasamos como prop
        }
      },
    });

    return null;
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickEventos />
    </MapContainer>
  );
};

export default Mapa;
