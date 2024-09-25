// src/utils/proveedorUtil.js

export const fetchProveedores = async () => {
    // Implementa la lógica para obtener los proveedores desde tu API
    const response = await fetch('/api/proveedores'); // Ajusta la ruta de acuerdo a tu API
    if (!response.ok) {
        throw new Error('Error al obtener los proveedores');
    }
    return await response.json();
};

export const createProveedor = async (proveedor) => {
    // Implementa la lógica para crear un nuevo proveedor en tu API
    const response = await fetch('/api/proveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor),
    });
    if (!response.ok) {
        throw new Error('Error al crear el proveedor');
    }
    return await response.json();
};

export const deleteProveedor = async (proveedorId) => {
    // Implementa la lógica para eliminar un proveedor en tu API
    const response = await fetch(`/api/proveedores/${proveedorId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el proveedor');
    }
    return await response.json();
};

export const updateProveedor = async (proveedor) => {
    // Implementa la lógica para actualizar un proveedor en tu API
    const response = await fetch(`/api/proveedores/${proveedor.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedor),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el proveedor');
    }
    return await response.json();
};
