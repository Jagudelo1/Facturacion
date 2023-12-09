import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ReturnApp } from "../Return/ReturnApp";
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
                            onHide={() => {
                            setShowModal(false);
                            setBackgroundOpacity(1); // Restaura la opacidad al cerrar la modal
                            }}
                            onShow={() => setBackgroundOpacity(0.1)} // Establece la opacidad al abrir la modal
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Credenciales correctas</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Cambiar contraseña</Form.Label>
                                        <Form.Control type="password"/>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
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