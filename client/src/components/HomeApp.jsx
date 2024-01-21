import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import Axios from 'axios';
import Swal from "sweetalert2";
import '../App.css';

export function HomeApp() {
    // -----> *Pantalla de Carga...* <----- //
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    // -----> *Mostrar y Ocultar contraseña* <----- //
    const [ verContrasena, setVerContrasena ] = useState(false);

    const VisibilidadContrasena = () => {
        setVerContrasena(!verContrasena);
    }

    // -----> *Inicio de sesión* <----- //
    const [ login, setLogin ] = useState({ usuario: '', contrasena: '' })
    const navigation = useNavigate();

    const inputChange = ({ target }) => {
        const { name, value } = target
        setLogin({
            ...login,
            [name]: value
        });
    }

    const loginSubmit = () => {
        Axios.post("http://localhost:3001/Entrar" , login)
        .then(({ data }) => {
            // Comprobación si el servidor ha devuelto un mensaje éxito
            if(data) {
                // Almacena los datos del administrador en sessionStorage
                sessionStorage.setItem("userData", JSON.stringify(data));
                // Muestra una alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    showConfirmButton: false,
                    timer: 1500
                }).then((result) => {
                    navigation("/Facturacion");
                });
            } else {
                // Se muestra una alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario no encontrado',
                    confirmButtonText: 'OK'
                });
            }
        }) .catch(({ response }) => {
            // Muestra una alerta de error genérica en caso de fallo en la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o Contraseña Incorrecta',
                confirmButtonText: 'OK'
            });
        });
    }

    return(
        <>
            {loading ? (
                <div className="screen-loading">
                    <div className="spinner"></div>
                </div>
            ):(
                <div className="ContentHomeApp">
                    <h1>Iniciar Sesión</h1>
                    <Form className="FormLogin">
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="usuario"
                                value={login.usuario}
                                onChange={inputChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3 contrasena">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type={verContrasena ? 'text' : 'password'}
                                name="contrasena"
                                value={login.contrasena}
                                onChange={inputChange} 
                                />
                                {verContrasena ? (
                                    <FaEyeSlash size={25} className="IconEy1" onClick={VisibilidadContrasena}/>
                                ):(
                                    <FaEye size={25} className="IconEy2" onClick={VisibilidadContrasena}/>
                                )}
                        </Form.Group>
                        <Form.Group className="mb-3 Links">
                            <Link to='/Registro'>Crear Usuario</Link>
                            <Link to='/Recuperar' className="Restaurar">Recuperar Contraseña</Link>
                        </Form.Group>
                        <Button onClick={loginSubmit}>Entrar</Button>
                    </Form>
                </div>
            )}
        </>
    )
}