import React, { useState } from 'react';

export default function Poliza() {
  const [tipoPago, setTipoPago] = useState('');

  const handleTipoPagoChange = (e) => {
    setTipoPago(e.target.value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Formulario de Pago de Póliza</h1>

      <div className="mb-4">
        <label htmlFor="tipoPago" className="block text-sm font-medium mb-2">
          Tipo de Pago
        </label>
        <select
          id="tipoPago"
          value={tipoPago}
          onChange={handleTipoPagoChange}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">Selecciona un tipo de pago</option>
          <option value="cuota">Por Cuota</option>
        </select>
      </div>

      {tipoPago === 'cuota' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Selecciona el método de pago</h2>
          <div className="mb-4">
            <input
              type="radio"
              id="pagoQR"
              name="metodoPago"
              value="QR"
              onChange={() => setTipoPago('QR')}
            />
            <label htmlFor="pagoQR" className="ml-2">QR</label>
          </div>
          <div className="mb-4">
            <input
              type="radio"
              id="pagoPayPal"
              name="metodoPago"
              value="PayPal"
              onChange={() => setTipoPago('PayPal')}
            />
            <label htmlFor="pagoPayPal" className="ml-2">PayPal</label>
          </div>
          <div className="mb-4">
            <input
              type="radio"
              id="pagoStream"
              name="metodoPago"
              value="Stream"
              onChange={() => setTipoPago('Stream')}
            />
            <label htmlFor="pagoStream" className="ml-2">Stream</label>
          </div>
          <div className="mb-4">
            <input
              type="radio"
              id="pagoLibelula"
              name="metodoPago"
              value="Libélula"
              onChange={() => setTipoPago('Libélula')}
            />
            <label htmlFor="pagoLibelula" className="ml-2">Libélula</label>
          </div>

          {tipoPago && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Formulario para {tipoPago}</h3>
              {tipoPago === 'QR' && (
                <div>
                  <label className="block mb-2">Escanea el código QR para pagar</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              )}
              {tipoPago === 'PayPal' && (
                <div>
                  <label className="block mb-2">Ingresa tu correo de PayPal</label>
                  <input
                    type="email"
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="tu_correo@ejemplo.com"
                  />
                </div>
              )}
              {tipoPago === 'Stream' && (
                <div>
                  <label className="block mb-2">Detalles de pago con Stream</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Ingresa los detalles aquí"
                  />
                </div>
              )}
              {tipoPago === 'Libélula' && (
                <div>
                  <label className="block mb-2">Número de cuenta de Libélula</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Número de cuenta"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
