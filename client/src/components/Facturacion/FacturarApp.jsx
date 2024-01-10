import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import { Link, useNavigate } from 'react-router-dom';
import { GiExitDoor } from "react-icons/gi";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import '../../css/FacturarApp.css';

export function FacturarApp() {
    // -----> Mostrar los datos del administrador logeado actuales <----- //
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const navegacion = useNavigate();
    
    // -----> Cerrar La Sesión Actual <----- //
    const handleLogout = () => {
        // Alerta para indicar que la sesión se va a cerrar
        const MySwalS = withReactContent(Swal);
        MySwalS.fire({
            title: 'Cerrando sesión',
            timer: 2000, // Tiempo en milisegundos (2 segundos)
            timerProgressBar: true,
            didOpen: () => {
                MySwalS.showLoading();
            },
        }).then(() => {
            // Elimina los datos del administrador de sessionStorage
            sessionStorage.removeItem("userData");
            // Redirige al usuario al inicio
            navegacion("/");
        });
    };

    // -----> Componente funcional para la alerta de "No has iniciado sesión  <----- //
    const SweetAlertNoSesion = () => {
        const MySwal = withReactContent(Swal);

        MySwal.fire({
            title: 'No has iniciado sesión',
            text: 'Por favor, inicia sesión para continuar.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                navegacion('/');
            }
        });
        return null;
    };

    // -----> Enviar datos ingresados en el formulario a la base de datos  <----- //
    const [ fecha, setFecha ] = useState();
    const [ cliente, setCliente ] = useState();
    const [ cedulaNit, setCedulaNit ] = useState();
    const [ descripcion, setDescripcion ] = useState();
    const [ cantidad, setCantidad ] = useState(0);
    const [ precioUnitario, setPrecioUnitario ] = useState(0);
    const [ precioTotal, setPrecioTotal ] = useState(0);
    const [ serverResponse, setServerResponse ] = useState();
    const navigated = useNavigate();

    const handleSubmitFactura = async () => {
        const form = document.querySelector(".FormFactura");
        if (form.checkValidity()) {
          try {
            const response = await axios.post("http://localhost:3001/CreateFactura", {
              fecha: fecha,
              cliente: cliente,
              cedulaNit: cedulaNit,
              descripcion: descripcion,
              cantidad: cantidad,
              precioUnitario: precioUnitario,
              precioTotal: precioTotal,
            });
    
            setServerResponse(response.data.message);
            Swal.fire({
              icon: "success",
              title: "Factura creada exitosamente",
              text: response.data.message
            });
          } catch (error) {
            console.error(error);
            setServerResponse("Error al crear la factura");
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error al crear la factura",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Por favor, complete todos los campos obligatorios.",
          });
        }
        // Limpiar el formulario
        setFecha('');
        setCliente('');
        setCedulaNit('');
        setDescripcion('');
        setCantidad('');
        setPrecioUnitario('');
        setPrecioTotal('');
    };
    
    // -----> Calcular el precioTotal con la Cantidad y el PrecioUnitario <----- //
    const handleCantidad = (e) => {
        const newCantidad = parseInt(e.target.value) || 0;
        setCantidad(newCantidad);
        calcularPrecioTotal(newCantidad, precioUnitario);
    };

    const handlePrecioUnitario = (e) => {
        const newPrecioUnitario = parseInt(e.target.value) || 0;
        setPrecioUnitario(newPrecioUnitario);
        calcularPrecioTotal(cantidad, newPrecioUnitario);
    };

    const calcularPrecioTotal = (cantidad, precioUnitario) => {
        const newPrecioTotal = cantidad * precioUnitario;
        setPrecioTotal(newPrecioTotal);
    };

    return(
        <div>
            {userData ? (
                <div className="FacturarContent">
                    <div className="nav">
                        <GiExitDoor size={25} onClick={handleLogout} className="iconLogout"/>
                        <h3>Facturación</h3>
                    </div>
                    <section className="form-facturar">
                        <h2>Crear Factura</h2>
                        <Form className="FormFactura">
                            {/* Datos del Cliente */}
                            <div className="client-form">
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control 
                                        type="date"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre Cliente</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        value={cliente}
                                        onChange={(e) => setCliente(e.target.value)}
                                        required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>C.C / Nit</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        value={cedulaNit}
                                        onChange={(e) => setCedulaNit(e.target.value)}
                                        required/>
                                </Form.Group>
                            </div>
                            {/* Datos de la Factura */}   
                            <div className="fact-form">
                                <Form.Group className="mb-3 description">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={2}
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        value={cantidad}
                                        onChange={handleCantidad}
                                        required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio Unitario</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        value={precioUnitario}
                                        onChange={handlePrecioUnitario}
                                        required/>
                                </Form.Group>
                                <Form.Group className="mb-3 total">
                                    <Form.Label>Valor Total</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        value={precioTotal}
                                        readOnly
                                        required/>
                                </Form.Group>
                            </div>
                            <div className="btn-buttons">
                                <Button className="Btn-enviar" 
                                    onClick={handleSubmitFactura}>
                                    Enviar
                                </Button>
                                <Link className="Btn-enviar"
                                    to="/Facturas">
                                    Ver Facturas
                                </Link>
                            </div>
                        </Form>
                    </section>
                </div>
                ) : (
                    <SweetAlertNoSesion/>
                )}
        </div>
    )
}