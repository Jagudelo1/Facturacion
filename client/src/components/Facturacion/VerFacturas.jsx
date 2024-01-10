import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogOut } from 'react-icons/bi';
import { GiReturnArrow } from "react-icons/gi";
import withReactContent from 'sweetalert2-react-content';
import Table from 'react-bootstrap/table';
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import '../../css/FacturarApp.css';

export function VerFacturas() {
    
    // -----> Mostrar los datos del administrador logeado actuales <----- //
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const navegacion = useNavigate();
    
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

    // -----> Mostrar las facturas creadas <----- //
    const [ facturasC, setFacturasC ] = useState([]);
    useEffect(() => {
        // Hacer la solicitud GET al servidor para obtener los datos de facturas
        fetch("http://localhost:3001/facturas")
            .then(response => response.json())
            .then(data => {
                // Actualizar el estado con los datos obtenidos
                setFacturasC(data);
            })
            .catch(error => {
                console.log('Error al obtener los datos de facturas:' , error);
            });
    }, []);


    //-----> Seleccionar Facturas <----- //
    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState([]);
    
    const handleFacturaSeleccionada = (facturaId) => {
        // Verifica si la factura ya está seleccionada
        const facturaIndex = facturasSeleccionadas.indexOf(facturaId);
    
        if (facturaIndex === -1) {
        // Si no está seleccionada, agrégala a la lista de selecciones
        setFacturasSeleccionadas([...facturasSeleccionadas, facturaId]);
        } else {
        // Si ya está seleccionada, quítala de la lista de selecciones
        const nuevasFacturasSeleccionadas = [...facturasSeleccionadas];
        nuevasFacturasSeleccionadas.splice(facturaIndex, 1);
        setFacturasSeleccionadas(nuevasFacturasSeleccionadas);
        }
    };

    const handleEnviarFacturasSeleccionadas = () => {
        // Filtra las facturas seleccionadas
        const facturasSeleccionadasData = facturasC.filter((factura) =>
          facturasSeleccionadas.includes(factura.id_factura)
        );
      
        // Agrega el número de factura al objeto de estado
        const estadoFacturas = {
          facturasSeleccionadas: facturasSeleccionadasData,
          numeroFactura: numeroFactura,
        };
      
        // Envia las facturas seleccionadas al componente FacturaImp
        navegacion("/FacturaImp", {
          state: estadoFacturas,
        });
    };      

    // -----> Recibir y Enviar numero Factura <-----  //
    const [numeroFactura, setNumeroFactura] = useState("");

    // -----> Modal input <-----  //
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div>
            {userData ? (
                <section>
                    <div className="nav2">
                        <Link to="/Facturacion" className="returnForm">
                            <GiReturnArrow size={25}/>
                        </Link>
                        <BiSolidLogOut size={30} onClick={handleLogout} className="Logout"/>
                    </div>
                    <div className='TableContentFact'>
                        <h2>Facturas Creadas</h2>
                        <div className="Container-table">
                            <Table bordered striped className="facture-table">
                                <thead className="thead">
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>C.C / Nit</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unidad</th>
                                        <th>Precio Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facturasC.map((factura)=>(
                                        <tr key={factura.id_factura}>
                                            <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                                            <td>{factura.cliente}</td>
                                            <td>{factura.cedulaNit}</td>
                                            <td>{factura.descripcion}</td>
                                            <td>{factura.cantidad}</td>
                                            <td>{factura.precioUnitario}</td>
                                            <td>{factura.precioTotal}</td>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    onChange={() => handleFacturaSeleccionada(factura.id_factura)} 
                                                    checked={facturasSeleccionadas.includes(factura.id_factura)}
                                                />
                                            </td>
                                        </tr>
                                ))}</tbody>
                            </Table>
                        </div>
                        <Button className="ButtonVer" variant="primary" onClick={handleShow}>
                            Imprimir Factura
                        </Button>
                    </div>
                    <Modal size="sm" centered show={show} onHide={handleClose}>
                        <Modal.Body>
                            <Form.Group className="mb-3 form-groupd" controlId="formBasicEmail">
                                <Form.Label>Numero Facturación</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={numeroFactura}
                                    onChange={(e) => setNumeroFactura(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                className="btn ButtonFactura"
                                onClick={handleEnviarFacturasSeleccionadas}
                            >
                                Mostrar Factura
                            </Button>
                        </Modal.Body>
                    </Modal>
                </section>
                ) : (
                    <SweetAlertNoSesion/>
                )}
        </div>
    )
}