import React, { useState, useEffect } from 'react';
import { List, Modal, Button, message } from 'antd';

const ImageManager = () => {
    const [imageData, setImageData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch('/imageData.json')
            .then(response => response.json())
            .then(data => setImageData(data))
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
                message.error('Error al cargar la lista de imágenes');
            });
    }, []);

    const showModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={imageData}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={`ID: ${item.id}`}
                            description={<a href={`/${item.url}`} target="_blank" rel="noopener noreferrer">Enlace de la Imagen</a>}
                        />
                        <Button type="primary" onClick={() => showModal(item)}>
                            Ver Imagen
                        </Button>
                    </List.Item>
                )}
            />
            <Modal
                title="Vista Previa de la Imagen"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedImage && (
                    <img
                        src={`/${selectedImage.url}`}
                        alt={`Imagen ID: ${selectedImage.id}`}
                        style={{ width: '100%' }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ImageManager;
