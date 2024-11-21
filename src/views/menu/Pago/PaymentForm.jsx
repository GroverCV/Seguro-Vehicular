import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Cargar la clave pública de Stripe
const stripePromise = loadStripe(
  "pk_test_51QLFmAJtvl47NLZrvLqbZIlqhfprUnbWNiusc06xMgf7cUpdSuGvsQcw4txHcwfA7kvivejP0eID03T4PFzr2EfT00m6z28rA5"
);

const PaymentForm = () => {
  // Lista de productos con imágenes
  const products = [
    {
      id: "price_1QNNGyJtvl47NLZrTT5y6s1l",
      name: "Producto 1 - Auto",
      price: "1000.00",
      image: "https://static.vecteezy.com/system/resources/previews/023/192/562/non_2x/sport-car-running-on-the-road-in-future-city-created-with-generative-ai-free-photo.jpg",
    },
    {
      id: "price_1QNMAcJtvl47NLZrSoKw6fBZ",
      name: "Producto 2 - Auto Rojo",
      price: "2000.00",
      image: "https://media.istockphoto.com/id/1157655660/es/foto/suv-rojo-gen%C3%A9rico-sobre-un-fondo-blanco-vista-lateral.jpg?s=612x612&w=0&k=20&c=0I2xA9oCnNUfluy5m1ErkM4NwHQOkhDUr2HwKXNO1z8=",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]); // Producto por defecto
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    setIsProcessing(true);
    setMessage("");
  
    const stripe = await stripePromise;
  
    try {
      const result = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: selectedProduct.id, // Usa el ID del precio seleccionado
            quantity: 1,
          },
        ],
        mode: "payment",
        successUrl: window.location.origin + "/success",
        cancelUrl: window.location.origin + "/cancel",
      });
  
      console.log(result); // Agregar esta línea para ver el resultado completo
  
      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      }
    } catch (error) {
      setMessage("Error al redirigir al Checkout");
      console.error("Error al redirigir al Checkout:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Seleccionar Producto y Pagar</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheckout();
        }}
      >
        <div>
          <label>
            Escoge un producto:
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const product = products.find((p) => p.id === e.target.value);
                setSelectedProduct(product);
              }}
              required
              style={{ margin: "10px", padding: "5px" }}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* Mostrar la imagen del producto seleccionado */}
        <div style={{ margin: "20px 0" }}>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: isProcessing ? "not-allowed" : "pointer",
          }}
        >
          {isProcessing ? "Procesando..." : "Pagar"}
        </button>
      </form>
      {message && <p style={{ color: "red", marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default PaymentForm;
