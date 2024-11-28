import React, { useState } from 'react';
import Mapa from './Mapa';

const MiFormulario = () => {
  const [formData, setFormData] = useState({
    ubicacion: "",
  });

  const handleLocationSelect = (link) => {
    setFormData({ ...formData, ubicacion: link });
  };

  const styles = {
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%',
      marginTop: '10px',
    }
  };

  return (
    <form>
      <label>
        Ubicación:
        <Mapa onLocationSelect={handleLocationSelect} />
        <input
          type="text"
          style={styles.input}
          value={formData.ubicacion || ""}
          onChange={(e) =>
            setFormData({ ...formData, ubicacion: e.target.value })
          }
        />
      </label>
    </form>
  );
};

export default MiFormulario;
