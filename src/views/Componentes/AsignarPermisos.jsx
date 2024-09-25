import React, { useEffect, useState } from 'react';
import Permisos from './Permisos'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const AsignarPermisos = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://backend-seguros.campozanodevlab.com/api/roles');
                if (!response.ok) {
                    throw new Error('Error al obtener los roles');
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
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
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.body}>
            <h1 style={styles.h1}>ASIGNAR PERMISOS</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre Rol</th>
                        <th style={styles.th}>Permisos</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role, index) => (
                        <tr key={role.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td style={styles.td}>{role.id}</td>
                            <td style={styles.td}>{role.nombre}</td>
                            <td style={styles.td}>
                                <Permisos />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AsignarPermisos;
