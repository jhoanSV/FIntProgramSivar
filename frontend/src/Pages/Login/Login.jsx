import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./_Login.scss";
import { TheAlert } from '../../Components';
import { checkLogindDataApi } from '../../api';
import { useTheContext } from '../../TheProvider';

export function Login(){
    const { setLogged, setUsD, setCategories } = useTheContext()
    const navigate = useNavigate();
    const [showPasword, setshowPasword] = useState(false)
    const [Data, setData] = useState({
        User: '',
        Password: ''
    })
    
    const changeData =(data, value)=>{
        let NewData = {...Data}
        NewData[data] = value
        setData(NewData)
        console.log(NewData)
    }
    const LoginHandle = async()=>{
        const userData = await checkLogindDataApi(Data)
        if(!userData){
            TheAlert('Problema de conexión, intente de nuevo más tarde');
            return;
        }
        if(userData.Cod){
            setLogged(true);
            setUsD(userData);
            navigate('/')
        }else{
            TheAlert('Usuario o contraseña incorrectos');
        }
        /*const userData = await LoginInt({
            "EmailUser": Data.User,
            "Password": Data.Password
        });*/
        navigate('/NewCustomer')
    }

    return (
        <div className="_About">
            <header className="_Box-loging">
                <h1 className="_About-header-title">Iniciar sesión</h1>
                <label>Usuario</label>
                <input
                    placeholder='Nombre de usuario'
                    onChange={(e)=>{changeData('User',e.target.value)}}></input>
                <label>Contraseña</label>
                <input
                    type={showPasword?'text':'password'}
                    placeholder='Contraseña'
                    onChange={(e)=>{changeData('Password',e.target.value)}}></input>
                    <i
                        class={showPasword?'bi bi-eye':'bi bi-eye-slash'}
                        onClick={()=>{setshowPasword(!showPasword)}}></i>
                <div>
                    <button onClick={{}}>Cancelar</button>
                    <button onClick={()=>{LoginHandle()}}>Acceptar</button>
                </div>
            </header>
        </div>
    );
}