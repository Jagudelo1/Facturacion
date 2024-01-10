import React from "react";
import '../../css/FacturarApp.css';
import Logo from '../../img/Logo.jpeg';
import { useLocation } from 'react-router-dom';
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import Table from "react-bootstrap/esm/Table";

export function FacturaImp() {
    const location = useLocation();
    const { facturasSeleccionadas, numeroFactura } = location.state || {}; // Obtener las facturas seleccionadas
    const totalPrecioTotal = facturasSeleccionadas.reduce((total, factura) => total + factura.precioTotal, 0);

    // Verificar si hay facturas seleccionadas
    if (!facturasSeleccionadas || facturasSeleccionadas.length === 0) {
        return (
            <>
                <div>
                    <h1>No hay facturas seleccionadas</h1>
                </div>
            </>
        );
    }

    // Extraer los datos de la primera factura seleccionada
    const primeraFactura = facturasSeleccionadas[0];

    return (
        <div className="ContentFactImp">
            <div className="title-PLR">
                <h2>Factura #{numeroFactura}</h2>
            </div>
            <div className="Header1">
                <div className="co-header1">
                    <h2>Papelería Bethel</h2>
                    <h6>
                        <FaLocationDot size={20} color="blue"/> Cra 15 # 6 - 34 B/La cabaña
                    </h6>
                    <h6>
                        <MdEmail size={20} color="#D6012C"/> bethelpapeleria9@gmail.com
                    </h6>
                    <h6>
                        <IoLogoWhatsapp size={20} color="#07ea0e"/> +57 3156152301
                    </h6>
                </div>
                <div className="co-header2">
                    <img src={Logo} alt="" />
                </div>
            </div>
            <hr />
            <div className="Contentinfo">
                <div className="info-client">
                    <h4>Facturar A</h4>
                    <h6>{primeraFactura.cliente}</h6>
                    <h6>C.C. o Nit: {primeraFactura.cedulaNit}</h6>
                </div>
                <div className="date-facture">
                    <h6>Fecha de Facturación: {new Date(primeraFactura.fecha).toLocaleDateString()}</h6>    
                </div>
            </div>
            <hr />
            <div className="table-container">
                <Table striped bordered hover className="facture-table">
                    <thead className="thead">
                        <tr>
                            <th>Cantidad</th>
                            <th>Descripción</th>
                            <th>Precio Unitario</th>
                            <th>Precio Total</th>
                        </tr>
                    </thead>
                    <tbody className="tbody">
                        {facturasSeleccionadas.map((factura) => (
                        <tr key={factura.id_fact}>
                            <td>{factura.cantidad}</td>
                            <td>{factura.descripcion}</td>
                            <td>{factura.precioUnitario}</td>
                            <td>{factura.precioTotal}</td>
                        </tr>
                        ))}
                    </tbody>
                    <thead className="thead">
                        <tr>
                            <th colSpan={3}>Valor Total</th>
                            <th>{totalPrecioTotal}</th>
                        </tr>
                    </thead>
                </Table>
            </div>
            <div className="text">
                <h5>Gracias por tu compra 😊</h5>
            </div>
        </div>
    );
}
