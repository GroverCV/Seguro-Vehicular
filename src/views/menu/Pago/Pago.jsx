import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

// Cargar la clave pública de Stripe
const stripePromise = loadStripe(
  "pk_test_51QLFmAJtvl47NLZrvLqbZIlqhfprUnbWNiusc06xMgf7cUpdSuGvsQcw4txHcwfA7kvivejP0eID03T4PFzr2EfT00m6z28rA5"
);

const Pago = () => {
  return (
    <Elements stripe={stripePromise}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', // Centra horizontalmente, pero alinea al inicio verticalmente
          height: '100vh', // Para que ocupe todo el alto de la pantalla
          textAlign: 'center', // Centra el título
          paddingTop: '20px', // Añade un pequeño margen superior
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '600px', // Define un ancho máximo para el formulario
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1>Pagar con Stripe</h1>
          <PaymentForm />
        </div>
      </div>
    </Elements>
  );
};

export default Pago;
