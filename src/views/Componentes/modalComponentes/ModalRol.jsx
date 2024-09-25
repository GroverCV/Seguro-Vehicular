import React, { useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { createRol } from '../../utils/postUtil';

const RoleModal = ({getDatos}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (!roleName) {
            error();
            return;
        } else {
            await createRol(roleName);
            getDatos();
            setRoleName('');
            success();
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRoleName('');
    };

    const handleChange = (e) => {
        setRoleName(e.target.value);
    };

    const success = () => {
        messageApi.success('Rol guardado exitosamente');
    };

    const error = () => {
        messageApi.error('Error, tiene que agregar el nombre de un rol');
    };

    return (
        <>
            <Button className="w-full font-bold" onClick={showModal}>
                Agregar Rol
            </Button>
            <Modal
                title="Agregar Rol"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Guardar"
                cancelText="Cerrar"
                okButtonProps={{ disabled: !roleName }}
            >
                <Input
                    placeholder="Nombre del rol..."
                    value={roleName}
                    onChange={handleChange}
                />
                {contextHolder}
            </Modal>
        </>
    );
};

export default RoleModal;
