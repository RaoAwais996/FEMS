import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";

const AppBar = () => {

    const navigate = useNavigate()

    const logout = async () => {

        await auth.signOut();
        localStorage.removeItem('email');
        localStorage.removeItem('userType');
        localStorage.removeItem('name');
        window.location.href = '/signin';
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#FFCB05'}}>
            <div className="container-fluid" style={{width: '85%'}}>
                <a className="navbar-brand" onClick={() => navigate('/home')} style={{color: 'black'}} href="#">Agjenda
                    e pushimeve</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto ">
                        {
                            localStorage.getItem('userType') === 'hr' ?
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => navigate('/home/manageemployees/')}
                                       style={{color: 'black'}} href="#">Employees</a>
                                </li>
                                : null
                        }
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => navigate('/home/report/')} style={{color: 'black'}}
                               href="#">Report</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={logout} style={{color: 'black'}}
                               href="#">Logout {localStorage.getItem('userType') === 'hr' ? 'Natyra' : localStorage.getItem('name')}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AppBar;
