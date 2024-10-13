import React, { useState } from "react";

const Cloudinary = ({ onImageUpload }) => {
  const preset_name = "vehiculos";
  const cloud_name = "dsdmkmdt2";

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    margin: "auto",
  };

  const titleStyle = {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  };

  const inputStyle = {
    marginBottom: "20px",
    padding: "10px",
    border: "2px solid #007BFF",
    borderRadius: "5px",
    backgroundColor: "#fff",
    transition: "border-color 0.3s",
    outline: "none",
  };

  const loadingTextStyle = {
    color: "#007BFF",
    fontWeight: "bold",
  };

  const imageStyle = {
    marginTop: "20px",
    maxWidth: "100%",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", preset_name);

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const file = await response.json();
      setImage(file.secure_url);
      setLoading(false);

      // Llamamos a la función recibida por props para actualizar la descripción
      onImageUpload(file.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Suba la Imagen de su vehículo</h1>
      <input
        type="file"
        name="file"
        style={inputStyle}
        onChange={(e) => uploadImage(e)}
      />
      {loading ? (
        <h3 style={loadingTextStyle}>Loading...</h3>
      ) : (
        image && <img src={image} alt="imagen subida" style={imageStyle} />
      )}
    </div>
  );
};

export default Cloudinary;
