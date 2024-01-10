import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ReturnApp } from "../Return/ReturnApp";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import Swal from "sweetalert2";
import Modal from 'react-bootstrap/Modal';
import '../../css/RecuperarApp.css';
import '../../App.css';

export function RecuperarApp() {
    // -----> *Pantalla de Carga...* <----- //
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);


    const [usuario, setUsuario] = useState();
    const [correo, setCorreo] = useState();
    const [showModal, setShowModal] = useState(false);
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);
    
    // Verificar los datos ingresados para abrir la siguiente ventana para cambiar la contraseña
    const handleVerificar = async () => {
        try {
            const response = await fetch("http://localhost:3001/verificarCredenciales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, correo }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Credenciales correctas
                Swal.fire({
                    icon: 'success',
                    title: 'Credenciales correctas',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Se muestra la modal
                    setShowModal(true);
                });
            } else {
                // Credenciales incorrectas
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Credenciales incorrectas. Por favor, ingrese credenciales válidas.',
                });
            }
        } catch (error) {
            console.error("Error al verificar las credenciales", error);
        }
    };

    // -----> *Mostrar y Ocultar contraseña* <----- //
    const [ verContrasena, setVerContrasena ] = useState(false);

    const VisibilidadContrasena = () => {
        setVerContrasena(!verContrasena);
    }

    // Modificar contraseña despues de validar los datos ingresados
    const [contrasena, setContrasena] = useState();
    const navigated = useNavigate()

    const handleChangeContrasena = async () => {
        try {
            const response = await fetch("http://localhost:3001/cambiarContrasena", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, contrasena }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Contraseña cambiada con éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña cambiada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigated("/")
                });
            } else {
                // Error al cambiar la contraseña
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cambiar la contraseña. Por favor, inténtelo de nuevo.',
                });
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña", error);
        }
    };

    return(
        <>
            {loading ? (
                <div className="screen-loading">
                    <div className="spinner"></div>
                </div>
            ):(    
                <div style={{ opacity: backgroundOpacity }}>
                    <ReturnApp/>
                    <div className="ContainerRecuperar">
                        <h1>Verifica tu <br />correo y usuario</h1>
                        <Form className="FormRecuperar">
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)} />
                            </Form.Group>
                            <Button onClick={handleVerificar}>Verificar</Button>
                        </Form>
                    </div>
                    <div>    
                        <Modal
                            size="sm"
                            centered
                            show={showModal}
                            backdrop="static"
                            onHide={() => {
                            setShowModal(false);
                            setBackgroundOpacity(1); // Restaura la opacidad al cerrar la modal
                            }}
                            onShow={() => setBackgroundOpacity(0.1)} // Establece la opacidad al abrir la modal
                        >
                            <Modal.Header>
                                <Modal.Title>Credenciales correctas</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="FormCambiarContrasena">
                                    <Form.Group className="mb-3 Password">
                                        <Form.Label>Cambiar contraseña</Form.Label>
                                        <Form.Control
                                            type={verContrasena ? 'text' : 'password'}
                                            onChange={(e) => setContrasena(e.target.value)}
                                            value={contrasena}
                                        />
                                        {verContrasena ? (
                                        <FaEyeSlash size={25} className="EyeIcon1" onClick={VisibilidadContrasena}/>
                                        ):(
                                            <FaEye size={25} className="EyeIcon2" onClick={VisibilidadContrasena}/>
                                        )}
                                    </Form.Group>
                                    <Button onClick={handleChangeContrasena}>
                                        Cambiar
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            )}
        </>
    )
}