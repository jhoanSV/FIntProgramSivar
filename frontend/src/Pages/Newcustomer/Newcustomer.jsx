import React, { useEffect, useRef, useState } from 'react';
import { Flatlist, TheAlert } from '../../Components';
import { DotProduct } from '../../App';
import { ClientList, RutesList, AdvisorsList, newClientApi, updateClientApi } from '../../api';
import "./_Newcustomer.scss";

export function Newcustomer(){
    const WeightDian = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3]
    const refList = useRef([]);
    const [selectedfila, setSelectedfila ] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [customerList, setCustomerList ] = useState([])
    const [routes, setRoutes] = useState([])
    const [advisors, setAdvisors] = useState([])
    const ResFiscalData = { "Gran contribuyente": "O-13",
                            "Autorretenedor" : "O-15",
                            "Agente de retención IVA": "O-23",
                            "Régimen simple de tributación":"O-47",
                            "No responsable":"R-99-PN"
                          }
    const ResFiscalOptions = Object.entries(ResFiscalData).map(([label, value]) => ({
        label,
        value
    }));

    const GetResFiscalName = (resFiscal) => {
        const entry = Object.entries(ResFiscalData).find(([key, value]) => value === resFiscal);
        return entry ? entry[0] : ''; // Devuelve la key si la encuentra, o null si no.
    };
    const [dataCustomer, setDataCustomer] = useState({
        'Cod':'',
        'TDocumento': '',
        'NitCC': '', 
        'CV': '',
        'Ferreteria': '',
        'Contacto':'',
        'Celular': '',
        'Telefono': '',
        'Email': '',
        'Direccion': '',
        'Barrio': '',
        'CodRuta': '',
        'NameRuta': '',
        'CodVendedor': '',
        'NameVendedor': '',
        'Geolocalizacion': '',
        'Estado': 'OPERANDO',
        'Iva': '',
        'Pos': '',
        'ResFiscalName': '',
        'ResFiscal': '',
        'NResolucion': '',
        'FInicio': '',
        'FFinal': '',
        'Prefijo': '',
        'NInicial': '',
        'NFinal': '',
        'ClaveTecnica': '',
        'Api': '',
        'Usuario': '',
        'Clave': '',
        'Nota': '',
        'ElectronicPos': false
    })

    const handleData = (item, value) => {
        if (item === 'NitCC') {
            const verification = VerifyCodNit(value);
            setDataCustomer((prev) => ({
            ...prev,
            CV: verification,
            [item]: value,
            }));
        } else {
            setDataCustomer((prev) => ({
            ...prev,
            [item]: value,
            }));
        }
    };


    const VerifyCodNit = (value) =>{
        let CodVe = value
        const digitList = Array.from(CodVe).filter(char => /\d/.test(char)).map(Number);
        // Completar digitList con ceros al principio para que tenga 15 entradas
        const filledDigitList = new Array(15 - digitList.length).fill(0).concat(digitList);
        const dot = DotProduct(filledDigitList, WeightDian)
        const result = 11-( dot % 11)
        //console.log(result)
        //setVerCod(result)
        return result
    }

    const RowOrder = (item, index, columnsWidth) => {
        //const rowIndex = index;
        
        const FillData =(data)=>{
            const selectedOption = ResFiscalOptions.find(
                                        (option) => option.value === data.ResFiscal
                                    );
            const NewData = {
                'Cod': data.Cod,
                'TDocumento': data.Tipo === 0? 'Cedula': 'Nit',
                'NitCC': data.Nit, 
                'CV': data.VerificacionNit,
                'Ferreteria': data.Ferreteria,
                'Contacto':data.Contacto,
                'Celular': data.Telefono,
                'Telefono': data.Cel,
                'Email': data.Email,
                'Direccion': data.Direccion,
                'Barrio': data.Barrio,
                'CodRuta': data.CodRuta,
                'NameRuta': data.nombreRuta,
                'CodVendedor': data.CodVendedor,
                'NameVendedor': data.Vendedor,
                'Geolocalizacion': data.Geolocalizacion,
                'Estado': data.Estado,
                'Iva': data.Iva,
                'Pos': data.Pos,
                'ResFiscalName': data.ResFiscal !== ''? GetResFiscalName(data.ResFiscal): '',
                'ResFiscal': data.ResFiscal,
                'NResolucion': data.NumeroResolucion,
                'FInicio': data.FechaInicio,
                'FFinal': data.FechaFinal,
                'Prefijo': data.Prefijo,
                'NInicial': data.NumeroInicial,
                'NFinal': data.NumeroFinal,
                'ClaveTecnica': data.ClaveTecnica,
                'Api': data.Api,
                'Usuario': data.Usuario,
                'Clave': data.Clave,
                'Nota': data.Nota,
                'ElectronicPos': data.ElectronicPos
            }
        setDataCustomer(NewData)
        };
        
        return (
        <>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Cod}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Ferreteria}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Contacto}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Telefono}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Email}
                </label>
            </td>
        </>
        );
    };

    const GetClientL =async()=>{
      const ClientL = await ClientList()
      setCustomerList(ClientL)
      refList.current = ClientL
    }

    useEffect(() => {

      const getRoutesList = async()=>{
        const RList = await RutesList()
        setRoutes(RList)
      }

      const getAdvisorsData = async()=>{
        const RList = await AdvisorsList()
        setAdvisors(RList)
      }
      
      GetClientL()
      getRoutesList()
      getAdvisorsData()
      
      return () => {
      }
    }, [])

    const Cancel =()=>{
        let data = {
            'Cod':'',
            'TDocumento': '',
            'NitCC': '', 
            'CV': '',
            'Ferreteria': '',
            'Contacto':'',
            'Celular': '',
            'Telefono': '',
            'Email': '',
            'Direccion': '',
            'Barrio': '',
            'CodRuta': '',
            'NameRuta': '',
            'CodVendedor': '',
            'NameVendedor': '',
            'Geolocalizacion': '',
            'Estado': 'OPERANDO',
            'Iva': '',
            'Pos': '',
            'ResFiscalName': '',
            'ResFiscal': '',
            'NResolucion': '',
            'FInicio': '',
            'FFinal': '',
            'Prefijo': '',
            'NInicial': '',
            'NFinal': '',
            'ClaveTecnica': '',
            'Api': '',
            'Usuario': '',
            'Clave': '',
            'Nota': '',
            'ElectronicPos': false
        }
        setDataCustomer(data)
    }

    const CustomerHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Ferreteria',
            key: 'ferreteria',
            defaultWidth: '35%',
            type: 'text',
        },
        {
            header: 'Contacto',
            key: 'contacto',
            defaultWidth: '30%',
            type: 'text',
        },
        {
            header: 'Cel',
            key: 'cel',
            defaultWidth: '20%',
            type: 'text',
        },
        {
            header: 'Email',
            key: 'email',
            defaultWidth: '50%',
            type: 'text',
        }
    ];

    const filterClient = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let CustomerData = refList.current//The whole table "Clients".
        try {
            if (text === '' || text < 2) {
                setCustomerList(refList.current);
            }else{
              // Define a case-insensitive text filter function
              const filterByText = (item) =>
                item.Cod.toString().toLowerCase().includes(text.toLowerCase()) ||
                item.Ferreteria.toString().toLowerCase().includes(text.toLowerCase()) ||
                item.Contacto.toString().toLowerCase().includes(text.toLowerCase());
              // Filter products based on the text
              const TFiltro1 = CustomerData.filter(filterByText);
              setCustomerList(TFiltro1)
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setCustomerList(false)
        }
    };

    function verificarCamposVacios(camposRequeridos) {
        const camposVacios = camposRequeridos.filter(
            campo => !String(dataCustomer[campo] ?? '').trim()
        );
        return camposVacios;
    };
    
    const ToNewCustomer = async() =>{
        if (dataCustomer.Cod !== ''){
            TheAlert('No se puede crear un cliente que ya tiene codigo')
        } else {
            const camposRequeridos = ['TDocumento','NitCC','Ferreteria','Contacto','Telefono','Email','Direccion','CodVendedor','ResFiscal'];
            const camposFaltantes = verificarCamposVacios(camposRequeridos);
            if ( camposFaltantes.length > 0) {
                TheAlert('No se puede crear el cliente sin el campo: ', camposFaltantes[0] )
            } else {
                if (dataCustomer.ElectronicPos === true ){
                    const ElectronicInvoicesDataRequired = ['ResFiscalName',
                                                            'ResFiscal',
                                                            'NResolucion',
                                                            'FInicio',
                                                            'FFinal',
                                                            'Prefijo',
                                                            'NInicial',
                                                            'NFinal',
                                                            'ClaveTecnica',
                                                            'Api',
                                                            'Usuario',
                                                            'Clave'];
                    const camposFaltantesPos = verificarCamposVacios(camposRequeridos);
                    if (camposFaltantesPos.length >0){
                        TheAlert('No se puede crear al cliente con factura elecectronica sin el campo: ', ElectronicInvoicesDataRequired[0])
                    } else {
                        const sucess = await newClientApi(dataCustomer)
                        console.log(sucess.sucess)
                        if (sucess.sucess) {
                            TheAlert('Cliente creado con exito')
                            GetClientL()
                            Cancel()
                        } else {
                            TheAlert('Error al clear cliente: ', sucess.error)
                        }
                    }
                } else {
                    console.log('dataCustomer: ', dataCustomer)
                    const sucess = await newClientApi(dataCustomer)
                    console.log(sucess.sucess)
                    if (sucess.sucess) {
                        TheAlert('Cliente creado con exito')
                        GetClientL()
                        Cancel()
                    } else {
                        TheAlert('Error al clear cliente: ', sucess.error)
                    }
                }
            }
        }
    };

    const updateCustomer = async() =>{
        const camposRequeridos = ['TDocumento','NitCC','Ferreteria','Contacto','Telefono','Email','Direccion','CodVendedor','ResFiscal'];
        const camposFaltantes = verificarCamposVacios(camposRequeridos);
        if ( camposFaltantes.length > 0) {
            TheAlert('falta el campo ', camposFaltantes[0], ' para poder actualizar al cliente con Factura electrónica Pos.' )
        } else {
            const updateCus = await updateClientApi(dataCustomer)
            console.log('updateCus', updateCus)
            if (updateCus.sucess) {
                TheAlert('Cliente actualizado con exito')
                GetClientL()
                Cancel()
            } else if (updateCus.sucess) {
                TheAlert('Error al actualizar el cliente ', updateCus.error)
            }
        }
    };

    return (
        <div className="_DataInputs" style={{margin: '10px'}}>
            <div>
                <h3>Cod: {dataCustomer.Cod}</h3>
            </div>
            <div className='Row'>
                <div className='_column1Customer' style={{display: 'flex',
                                                          flexDirection: 'column',
                                                          gap: '3px'
                                                        }}>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Tipo de documento</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                className=""
                                value={dataCustomer.TDocumento}
                                onChange={(e)=>{handleData('TDocumento', e.target.value)}}
                            >
                                <option value="" disabled={true}>Selecciona una opción </option>
                                <option value="Cedula">Cedula</option>
                                <option value="Nit">Nit</option>
                            </select>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Nit/C.C</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                className=""
                                value={dataCustomer.NitCC}
                                onChange={(e)=>{handleData('NitCC', e.target.value)}}
                            />
                            <label>-{dataCustomer.CV}</label>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Ferreteria</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Ferreteria}
                                onChange={(e)=>{handleData('Ferreteria', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Contacto</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Contacto}
                                onChange={(e)=>{handleData('Contacto', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Celular</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Celular}
                                onChange={(e)=>{handleData('Celular', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Telefono</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Telefono}
                                onChange={(e)=>{handleData('Telefono', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>E-mail</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Email}
                                onChange={(e)=>{handleData('Email', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Dirección</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Direccion}
                                onChange={(e)=>{handleData('Direccion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Barrio</labe>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Barrio}
                                onChange={(e)=>{handleData('Barrio', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Ruta</labe>
                        </div>
                        <div className='_column2Customer' style={{display: 'flex', gap: '2px'}}>
                            <input
                                type="number"
                                className=""
                                value={dataCustomer.CodRuta}
                                onChange={(e)=>{handleData('CodRuta', e.target.value)}}
                                onBlur={(e)=>{
                                    const codRuta = parseInt(e.target.value, 10);
                                    const selectedOption = routes.find(
                                        (option) => option.CodRuta === codRuta
                                    );
                                    handleData('NameRuta', selectedOption.nombreRuta)
                                }}
                                style={{width: '50px'}}
                            />
                            <select
                                id="mi-select"
                                value={dataCustomer.NameRuta}
                                onChange={(e) => {
                                    const selectedNombreRuta = e.target.value;
                                    const selectedOption = routes.find(
                                        (opcion) => opcion.nombreRuta === selectedNombreRuta
                                    );
                                    if (selectedOption) {
                                        handleData('NameRuta', selectedOption.nombreRuta);
                                        handleData('CodRuta', selectedOption.CodRuta);
                                    }
                                }}
                                style={{width: '77%'}}
                            >
                                <option value="" disabled={true} >Selecciona una opción</option>
                                {routes.map((opcion) => (
                                    <option
                                        key={opcion.CodRuta}
                                        value={opcion.nombreRuta}>
                                        {opcion.nombreRuta}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <labe>Vendedor</labe>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={dataCustomer.CodVendedor}
                                onChange={(e) => {
                                    const selectedAdvisor = parseInt(e.target.value, 10);
                                    const selectedOption = advisors.find(
                                        (opcion) => opcion.Cod === selectedAdvisor
                                    );
                                    if (selectedOption) {
                                        handleData('CodVendedor', selectedOption.Cod);
                                        handleData('NameVendedor', selectedOption.Nombre);
                                    }
                                }}
                            >
                                <option value="" disabled={true}>Selecciona una opción</option>
                                {advisors.map((opcion) => (
                                    <option
                                        key={opcion.Cod}
                                        value={opcion.Cod}>
                                        {opcion.Cod}
                                    </option>
                                ))}
                            </select>
                            <select
                                id="mi-select"
                                value={dataCustomer.NameVendedor}
                                onChange={(e) => {
                                    const selectedAdvisor = e.target.value;
                                    const selectedOption = advisors.find(
                                        (opcion) => opcion.Nombre === selectedAdvisor
                                    );
                                    if (selectedOption) {
                                        handleData('CodVendedor', selectedOption.Cod);
                                        handleData('NameVendedor', selectedOption.Nombre);
                                    }
                                }}
                            >
                                <option value="" disabled={true}>Selecciona una opción</option>
                                {advisors.map((opcion) => (
                                    <option
                                        key={opcion.Cod}
                                        value={opcion.Nombre}>
                                        {opcion.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Geolocalización</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataCustomer.Geolocalizacion}
                                onChange={(e)=>{handleData('Geolocalizacion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Estado</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                className=""
                                value={dataCustomer.Estado}
                                onChange={(e)=>{handleData('Estado', e.target.value)}}
                                defaultValue="OPERANDO"
                            >
                                {/*<option value="">Selecciona una opción</option>*/}
                                <option value="OPERANDO">OPERANDO</option>
                                <option value="CERRADO">CERRADO</option>
                                <option value="BLOQUEADO">BLOQUEADO</option>    
                            </select>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Responsabildad fiscal</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={dataCustomer.ResFiscal}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    const selectedOption = ResFiscalOptions.find(
                                        (option) => option.value === selectedValue
                                    );
                                    if (selectedOption) {
                                    handleData('ResFiscal', selectedOption.value);
                                    handleData('ResFiscalName', selectedOption.label);
                                    }
                                }}
                                >
                                <option value="" disabled={true} >Selecciona una opción</option>
                                {ResFiscalOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Factura con iva</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                checked={dataCustomer.Iva === 1}
                                onChange={(e)=>{handleData('Iva', e.target.checked ? 1 : 0)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Pos</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                checked={dataCustomer.Pos === 1}
                                onChange={(e)=>{
                                    handleData('Pos', e.target.checked ? 1 : 0); handleData('ElectronicPos', false)
                                }}
                            />
                        </div>
                    </div>
                    { dataCustomer.Pos ?
                        <>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Factura electrónica Pos</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="checkbox"
                                        className=""
                                        checked={dataCustomer.ElectronicPos === 1}
                                        onChange={(e)=>{handleData('ElectronicPos', e.target.checked ? 1 : 0)}}
                                    />
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                    }
                    { dataCustomer.ElectronicPos && dataCustomer.Pos ? 
                        <>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>N resolución</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="number"
                                        className=""
                                        value={dataCustomer.NResolucion}
                                        onChange={(e)=>{handleData('NResolucion', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Fecha de inicio</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="date"
                                        className=""
                                        value={dataCustomer.FInicio}
                                        onChange={(e)=>{handleData('FInicio', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Fecha final</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="date"
                                        className=""
                                        value={dataCustomer.FFinal}
                                        onChange={(e)=>{handleData('FFinal', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Prefijo</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="text"
                                        className=""
                                        value={dataCustomer.Prefijo}
                                        onChange={(e)=>{handleData('Prefijo', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>N inicial</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input 
                                        type="number"
                                        className=""
                                        value={dataCustomer.NInicial}
                                        onChange={(e)=>{handleData('NInicial', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>N final</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="number"
                                        className=""
                                        value={dataCustomer.NFinal}
                                        onChange={(e)=>{handleData('NFinal', e.target.value)}}
                                        />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Clave tecnica</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="text"
                                        className=""
                                        value={dataCustomer.ClaveTecnica}
                                        onChange={(e)=>{handleData('ClaveTecnica', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Api</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="text"
                                        className=""
                                        value={dataCustomer.Api}
                                        onChange={(e)=>{handleData('Api', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Usuario</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="text"
                                        className=""
                                        value={dataCustomer.Usuario}
                                        onChange={(e)=>{handleData('Usuario', e.target.value)}}
                                    />
                                </div>
                            </div>
                            <div className='Row'>
                                <div className='_column1Customer'>
                                    <label>Clave</label>
                                </div>
                                <div className='_column2Customer'>
                                    <input
                                        type="text"
                                        className=""
                                        value={dataCustomer.Clave}
                                        onChange={(e)=>{handleData('Clave', e.target.value)}}
                                        />
                                </div>
                            </div>
                        
                        </>

                        :
                        <>
                        </>
                    }
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Nota</label>
                        </div>
                        <div className='_column2Customer'>
                            <textarea
                                id='nctaId'
                                type="textbox"
                                className="taStnd ncTextArea"
                                placeholder="Notas/Detalles del cliente"
                                value={dataCustomer.Nota}
                                onChange={(e)=>handleData('Nota', e.target.value)}
                                style={{width: '90%', height: '149px'}}

                                //disabled={showAlertCustomers}
                            />
                        </div>
                    </div>
                </div>
                <div className='_column2Customer'>
                    <div style={{display: 'flex', width: '100%' }}>
                        <label>Buscar:</label>
                        <div style={{width: '100%'}}>
                            <input
                                type="text"
                                className=""
                                value={searchText}
                                onChange={(e)=>{
                                    setSearchText(e.target.value);
                                    filterClient(e.target.value);
                                }}
                                style={{width: '90%'}}
                            />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', // Coloca los elementos en columna
                        alignItems: 'center',    // Centra horizontalmente
                        justifyContent: 'center', // Centra verticalmente
                        height: '80vh'           // Ocupa toda la altura de la ventana
                    }}>
                        <Flatlist
                            data={customerList}
                            headers={CustomerHeader}
                            row={RowOrder}
                            Height={'90%'}
                            selectedRow={selectedfila}
                            setSelectedRow={setSelectedfila}
                            rowStyles='alternative'
                        />
                    </div>
                </div>
            </div>
            <div style={{justifyContent: 'flex-end', display: 'flex', gap: '5px', marginRight: '5px'}}>
                <button
                    className='btnStnd btn1'
                    style={{marginLeft: '20px'}}
                    disabled={dataCustomer.Cod !== '' || dataCustomer.Ferreteria === '' || dataCustomer.NitCC === ''}
                    onClick={()=>{ToNewCustomer()}}
                >
                    Nuevo
                </button>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'green'}}
                    disabled={dataCustomer.Cod === '' || dataCustomer.Ferreteria === '' || dataCustomer.NitCC === ''}
                    onClick={()=>{updateCustomer()}}
                >
                    Modificar
                </button>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'red'}}
                    onClick={()=>{Cancel()}}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}