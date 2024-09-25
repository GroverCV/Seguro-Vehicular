import React, { useEffect, useState } from 'react';


const GestionarUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('https://backend-seguros.campozanodevlab.com/api/usuarios');
                if (!response.ok) throw new Error('Error al obtener los usuarios');
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch('https://backend-seguros.campozanodevlab.com/api/roles');
                if (!response.ok) throw new Error('Error al obtener los roles');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsuarios();
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

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
        setFormData(usuario);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`https://backend-seguros.campozanodevlab.com/api/usuarios/${id}`, {
                method: 'DELETE',
            });
            setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        } catch (error) {
            setError('Error al eliminar el usuario');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://backend-seguros.campozanodevlab.com/api/usuarios/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const updatedUser = await response.json();
            setUsuarios((prev) => prev.map((usuario) => (usuario.id === updatedUser.id ? updatedUser : usuario)));
            setEditingUser(null);
        } catch (error) {
            setError('Error al actualizar el usuario');
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.body}>
            <h1 style={styles.h1}>GESTIONAR USUARIOS</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Apellido</th>
                        <th style={styles.th}>Email</th>
                        
                        <th style={styles.th}>Teléfono</th>
                        <th style={styles.th}>Celular</th>
                        <th style={styles.th}>Dirección</th>
                        <th style={styles.th}>Rol</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr key={usuario.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td style={styles.td}>{usuario.id}</td>
                            <td style={styles.td}>{usuario.nombre}</td>
                            <td style={styles.td}>{usuario.apellido}</td>
                            <td style={styles.td}>{usuario.email}</td>
                            
                            <td style={styles.td}>{usuario.telefono}</td>
                            <td style={styles.td}>{usuario.celular}</td>
                            <td style={styles.td}>{usuario.direccion}</td>
                            <td style={styles.td}>
                                {
                                    roles.find(role => role.id === usuario.rol_id)?.nombre || 'No definido'
                                }
                            </td>
                            <td style={styles.td}>
                                <button style={styles.button} onClick={() => handleEdit(usuario)}>Editar</button>
                                <button style={styles.button} onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <>
                    <div style={styles.overlay} onClick={() => setEditingUser(null)}></div>
                    <div style={styles.modal}>
                        <h2>Editar Usuario</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Inputs for user details */}
                            <input type="text" placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required style={styles.input} />
                            <input type="text" placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} required style={styles.input} />
                            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={styles.input} />
                            <input type="text" placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} required style={styles.input} />
                            <input type="text" placeholder="Celular" value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })} required style={styles.input} />
                            <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} required style={styles.input} />

                            <select value={formData.rol_id} onChange={(e) => setFormData({ ...formData, rol_id: e.target.value })} required style={styles.input}>
                                <option value="">Seleccionar rol</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.nombre}</option>
                                ))}
                            </select>
                            <button type="submit" style={styles.submitButton}>Guardar</button>
                            <button type="button" onClick={() => setEditingUser(null)} style={styles.submitButton}>Cancelar</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default GestionarUsuario;
