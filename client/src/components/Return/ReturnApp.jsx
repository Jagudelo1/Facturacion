import React from "react";
import { GiReturnArrow } from "react-icons/gi";
import { Link } from 'react-router-dom';
import '../../css/ReturnApp.css';

export function ReturnApp() {
    return(
        <div className="Return">
            <Link to='/'>
                <GiReturnArrow size={30} title="Regresar" className="IconReturn"/>
            </Link>
        </div>
    )
}