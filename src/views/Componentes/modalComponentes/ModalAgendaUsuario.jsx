import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Spin, Modal, List } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import '../CSS/ModalAgendaUsuario.css';

const ModalAgendaUsuario = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCitas, setSelectedCitas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [ip, setIp] = useState("");

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citasResponse = await axios.get("https://backend-seguros.campozanodevlab.com/api/citas");
        const citasDelUsuario = citasResponse.data.filter(cita => cita.solicitante_id === userId);
        setCitas(citasDelUsuario);

        const usuariosResponse = await axios.get("https://backend-seguros.campozanodevlab.com/api/usuarios");
        const usuariosData = {};
        usuariosResponse.data.forEach(usuario => {
          usuariosData[usuario.id] = { nombre: usuario.nombre, apellido: usuario.apellido };
        });
        setUsuarios(usuariosData);

      } catch (err) {
        setError('Error al cargar las citas o usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const citasPorFecha = () => {
    return citas.reduce((acc, cita) => {
      const fechaCita = dayjs(cita.fecha).format('DD/MM/YYYY');
      if (!acc[fechaCita]) {
        acc[fechaCita] = [];
      }
      acc[fechaCita].push({
        ...cita,
        Fecha: dayjs(cita.fecha).format('DD/MM/YYYY, HH:mm:ss'),
        FechaCreada: dayjs(cita.fechaCreacion).format('DD/MM/YYYY'),
      });
      return acc;
    }, {});
  };

  const fetchIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIp(data.ip);
    } catch (error) {
      console.error("Error al obtener la IP:", error);
    }
  };

  const registrarBitacora = async () => {
    const userId = parseInt(localStorage.getItem("userId"), 10);

    const bitacoraEntry = {
      usuario_id: userId,
      accion: "Visitó Agenda",
      detalles: "Revisó Citas",
      ip: ip,
    };

    try {
      const response = await fetch(
        "https://backend-seguros.campozanodevlab.com/api/bitacora",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bitacoraEntry),
        }
      );
      if (!response.ok) throw new Error("Error al registrar en bitácora");
      console.log("Registro en bitácora exitoso");
    } catch (error) {
      console.error("Error al registrar en bitácora:", error);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  useEffect(() => {
    if (ip) {
      registrarBitacora();
    }
  }, [ip]);

  const getListData = (value) => {
    const fechaActual = value.format('DD/MM/YYYY');
    const citasDelDia = citasPorFecha()[fechaActual] || [];

    citasDelDia.sort((a, b) => dayjs(a.fecha).diff(dayjs(b.fecha)));

    return citasDelDia.map((cita) => {
      const solicitante = usuarios[cita.solicitante_id] || { nombre: 'Desconocido', apellido: '' };
      const recepcionista = usuarios[cita.recepcion_id] || { nombre: 'Desconocido', apellido: '' };

      return {
        type: cita.estado === 'atendido' ? 'success' : 'warning',
        content: `${cita.motivo || 'Cita'} - ${dayjs(cita.fecha).format('HH:mm')} (${solicitante.nombre} ${solicitante.apellido} / ${recepcionista.nombre} ${recepcionista.apellido})`,
      };
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    const hasCitas = listData.length > 0;

    return (
      <ul className={`events ${hasCitas ? 'has-citas' : ''}`}>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelectDate = (value) => {
    const fechaActual = value.format('DD/MM/YYYY');
    const citasDelDia = citasPorFecha()[fechaActual] || [];
    citasDelDia.sort((a, b) => dayjs(a.fecha).diff(dayjs(b.fecha)));
    setSelectedCitas(citasDelDia);
    setSelectedDate(fechaActual);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const calendarContainerStyle = {
    width: '100%',
    maxWidth: '1000px',
    height: '650px',
    overflow: 'hidden',
    transform: 'scale(1)',
    transformOrigin: 'bottom',
    margin: '0 auto',
  };

  if (loading) {
    return <Spin tip="Cargando citas..." />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div style={calendarContainerStyle}>
        <Calendar cellRender={cellRender} onSelect={onSelectDate} />
      </div>

      <Modal
        title={`Citas para el día ${selectedDate}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedCitas.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedCitas}
            renderItem={(cita) => {
              const solicitante = usuarios[cita.solicitante_id] || { nombre: 'Desconocido', apellido: '' };
              const recepcionista = usuarios[cita.recepcion_id] || { nombre: 'Desconocido', apellido: '' };

              return (
                <List.Item>
                  <List.Item.Meta
                    title={`Motivo: ${cita.motivo || 'No especificado'}`}
                    description={`Fecha Creada: ${dayjs(cita.fechaCreacion).format('DD/MM/YYYY')} - Hora: ${dayjs(cita.fecha).format('HH:mm:ss')} - Duración: ${cita.duracion} minutos - Solicitud: ${solicitante.nombre} ${solicitante.apellido} - Recepcionista: ${recepcionista.nombre} ${recepcionista.apellido}`}
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <p>No hay citas para esta fecha.</p>
        )}
      </Modal>
    </div>
  );
};

export default ModalAgendaUsuario;
