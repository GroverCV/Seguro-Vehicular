import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51QLFmAJtvl47NLZrvLqbZIlqhfprUnbWNiusc06xMgf7cUpdSuGvsQcw4txHcwfA7kvivejP0eID03T4PFzr2EfT00m6z28rA5');

function ConfigStripe() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

export default ConfigStripe;
