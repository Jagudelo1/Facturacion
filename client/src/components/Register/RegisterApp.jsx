import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import { ReturnApp } from "../Return/ReturnApp";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import Swal from "sweetalert2";
import '../../css/RegisterApp.css';
import '../../App.css';

export function RegisterApp() {
    // -----> *Pantalla de Carga...* <----- //
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    // -----> *Validación de Campos del Formulario de Registro* <----- //
    const [ validated, setValidated ] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if(form.checkValidity() === false){
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    }

    // -----> *Mostrar y Ocultar contraseña* <----- //
    const [ verContrasena, setVerContrasena ] = useState(false);

    const VisibilidadContrasena = () => {
        setVerContrasena(!verContrasena);
    }

    // -----> *Envió de datos a la bd para registrar usuarios* <----- //
    const [ nombre, setNombre ] = useState()
    const [ correo, setCorreo ] = useState()
    const [ usuario, setUsuario ] = useState()
    const [ contrasena, setContrasena ] = useState()
    const navigate = useNavigate();

    const createUser = () => {
        Axios.post("http://localhost:3001/Enviar", {
            nombre: nombre,
            correo: correo,
            usuario: usuario,
            contrasena: contrasena
        }).then((response) => {
            if(response.data.success) {
                //Registro exitoso, muestra una alerta y luego redirige al login
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario registrado con éxito',
                    showConfirmButton: false,
                    timer: 1500 // Duración de la alerta en milisegundos
                }).then(() => {
                    navigate("/")
                });
            } else {
                // Alerta de Error al registrar (usuario o correo ya están registrado)
                if(response.data.message === "El usuario o correo ingresado ya se encuentran registrados") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El usuario o correo ingresado ya se encuentran registrados',
                        confirmButtonText: 'OK'
                    });
                } else if (response.data.message === "Error al registrar el usuario") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al registrar el usuario',
                        confirmButtonText: 'OK'
                    });
                } else {
                    alert(response.data.message);
                }
            }
        });
    }

    return(
        <>
            {loading ? (
                <div className="screen-loading">
                    <div className="spinner"></div>
                </div>
            ):(    
                <div>
                    <ReturnApp/>
                    <div className="ContentRegister">
                        <h1>Regístrate</h1>
                        <Form className="FormRegister" noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    onChange={(event) => {
                                        setNombre(event.target.value);
                                    }}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    onChange={(event) => {
                                        setCorreo(event.target.value);
                                    }}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    onChange={(event) => {
                                        setUsuario(event.target.value);
                                    }}/>
                            </Form.Group>
                            <Form.Group className="mb-3 password">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control 
                                    type={verContrasena ? 'text' : 'password'} 
                                    onChange={(event) => {
                                        setContrasena(event.target.value);
                                    }}/>
                                    {verContrasena ? (
                                        <FaEyeSlash size={25} className="IconEye1" onClick={VisibilidadContrasena}/>
                                    ):(
                                        <FaEye size={25} className="IconEye2" onClick={VisibilidadContrasena}/>
                                    )}
                            </Form.Group>
                        </Form>
                        <Button 
                            onClick={createUser}
                        >
                            Registrarme
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}