
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const FormularioStripe = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js no ha cargado aún
    }

    const cardElement = elements.getElement(CardElement);

    // Crear un token de la tarjeta
    const {token, error} = await stripe.createToken(cardElement);

    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Token:', token);
      // Aquí podrías enviar el token al servidor para realizar el cargo
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={loading || !stripe}>Pagar</button>
    </form>
  );
};

export default FormularioStripe;
