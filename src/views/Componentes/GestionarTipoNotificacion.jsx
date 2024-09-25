import React, { useEffect, useState } from 'react';

const GestionarTipoNotificacion = () => {
    const [tiposNotificacion, setTiposNotificacion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTipoNotificacion, setEditingTipoNotificacion] = useState(null);
    const [formData, setFormData] = useState({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchTiposNotificacion = async () => {
            try {
                const response = await fetch('https://backend-seguros.campozanodevlab.com/api/tipo_notificacion');
                if (!response.ok) {
                    throw new Error('Error al obtener los tipos de notificación');
                }
                const data = await response.json();
                setTiposNotificacion(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTiposNotificacion();
    }, []);

    const styles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f9f9f9',
            margin: 0,
            padding: '20px',
        },
        h1: {
            textAlign: 'center',
            color: '#333',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        th: {
            padding: '12px 15px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#007bff',
            color: 'white',
        },
        td: {
            padding: '12px 15px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
        },
        trEven: {
            backgroundColor: '#f9f9f9',
        },
        trOdd: {
            backgroundColor: '#ffffff',
        },
        button: {
            marginRight: '10px',
            padding: '5px 10px',
            cursor: 'pointer',
        },
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            width: '400px',
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
        },
        input: {
            width: '100%',
            padding: '10px',
            margin: '5px 0',
            borderRadius: '4px',
            border: '1px solid #ccc',
        },
        submitButton: {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    const handleEdit = (tipoNotificacion) => {
        setEditingTipoNotificacion(tipoNotificacion);
        setFormData(tipoNotificacion);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`https://backend-seguros.campozanodevlab.com/api/tipo_notificacion/${id}`, {
                method: 'DELETE',
            });
            setTiposNotificacion(tiposNotificacion.filter((tipo) => tipo.id !== id));
        } catch (error) {
            console.error('Error al eliminar el tipo de notificación:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(editingTipoNotificacion ? `https://backend-seguros.campozanodevlab.com/api/tipo_notificacion/${editingTipoNotificacion.id}` : 'https://backend-seguros.campozanodevlab.com/api/tipo_notificacion', {
                method: editingTipoNotificacion ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const updatedTipoNotificacion = await response.json();
            setTiposNotificacion((prev) =>
                editingTipoNotificacion
                    ? prev.map((tipo) => (tipo.id === updatedTipoNotificacion.id ? updatedTipoNotificacion : tipo))
                    : [...prev, updatedTipoNotificacion]
            );
            setEditingTipoNotificacion(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error al actualizar o crear el tipo de notificación:', error);
        }
    };

    const handleCancel = () => {
        setEditingTipoNotificacion(null);
        setShowForm(false);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.body}>
            <h1 style={styles.h1}>GESTIONAR TIPO NOTIFICACION</h1>
            <button style={styles.submitButton} onClick={() => { setShowForm(true); setFormData({}); }}>Crear Tipo Notificación</button>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tiposNotificacion.map((tipo, index) => (
                        <tr key={tipo.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td style={styles.td}>{tipo.id}</td>
                            <td style={styles.td}>{tipo.nombre}</td>
                            <td style={styles.td}>{tipo.descripcion}</td>
                            <td style={styles.td}>
                                <button style={styles.button} onClick={() => handleEdit(tipo)}>Editar</button>
                                <button style={styles.button} onClick={() => handleDelete(tipo.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <>
                    <div style={styles.overlay} onClick={handleCancel}></div>
                    <div style={styles.modal}>
                        <h2>{editingTipoNotificacion ? 'Editar Tipo Notificación' : 'Crear Tipo Notificación'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={formData.nombre || ''}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                                style={styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={formData.descripcion || ''}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                style={styles.input}
                            />
                            <button type="submit" style={styles.submitButton}>
                                {editingTipoNotificacion ? 'Actualizar' : 'Crear'}
                            </button>
                            <button type="button" onClick={handleCancel} style={{ ...styles.submitButton, backgroundColor: '#dc3545' }}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default GestionarTipoNotificacion;
