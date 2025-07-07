import React, { useEffect, useRef, useState } from 'react';
import "./_newsupplier.scss";
import { Flatlist, TheAlert } from '../../Components';
import { VerifyCodNit } from '../../App'
import { SupplierListApi, newSupplierApi, updSupplierApi } from '../../api';
import { verificarCamposVacios } from '../../InternalFunctions';
export function Newsupplier(){
    const [selectedfila, setSelectedfila ] = useState(0);
    const [searchText, setSearchText] = useState('')
    const [supplierList, setSupplierList ] = useState([]);
    const [dataSupplier, setDataSupplier] = useState({
        'Cod': '',
        'NitCc': '',
        'CV': '',
        'Proveedor': '',
        'Contacto': '',
        'Cel': '',
        'Telefono': '',
        'Email': '',
        'Web': '',
        'Direccion': '',
        'Ruta': '',
        'Geolocalizacion': '',
        'Nota': ''
    });
    const refList = useRef([]);
    
    const handleData =(item, value)=>{
        if (item === 'NitCc') {
            const verification = VerifyCodNit(value);
            setDataSupplier((prev) => ({
                ...prev,
                ['NitCc']: value,
                ['CV']: verification
            }));
        } else {
            setDataSupplier((prev) => ({
                ...prev,
                [item]: value,
            }));

        }
    }

    const SupplierHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'ferreteria',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'Contacto',
            key: 'contacto',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'Cel',
            key: 'cel',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Email',
            key: 'email',
            defaultWidth: 50,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        //const rowIndex = index;
        const FillData =(data)=>{
            const NewData = {
                'Cod': item.Cod,
                'NitCc': item.Nit,
                'CV': item.VerificacionNit,
                'Proveedor': item.Proovedor,
                'Contacto': item.Contacto,
                'Cel': item.Cel,
                'Telefono': item.Telefono,
                'Email': item.Email,
                'Web': item.Web,
                'Direccion': item.Direccion,
                'Ruta': item.Ruta,
                'Geolocalizacion': item.Geolocalizacion,
                'Nota': item.Nota
            }
            setDataSupplier(NewData)
        }
        return (
        <>
            <td onDoubleClick={()=>{FillData()}}>
                <label>
                    {item.Cod}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData()}}>
                <label>
                    {item.Proovedor}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData()}}>
                <label>
                    {item.Contacto}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData()}}>
                <label>
                    {item.Telefono}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData()}}>
                <label>
                    {item.Email}
                </label>
            </td>
        </>
        );
    };

    const Cancel =()=>{
        let data = {
            'Cod': '',
            'NitCc': '',
            'CV': '',
            'Proveedor': '',
            'Contacto': '',
            'Cel': '',
            'Telefono': '',
            'Email': '',
            'Web': '',
            'Direccion': '',
            'Ruta': '',
            'Geolocalizacion': '',
            'Nota': ''
        }
        setDataSupplier(data)
    };

    const filterSupplier = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let SupplierData = refList.current//The whole table "Suppliers".
        try {
            if (text === '' || text < 2) {
                setSupplierList(refList.current);
            }else{
              // Define a case-insensitive text filter function
              const filterByText = (item) =>
                item.Cod.toString().toLowerCase().includes(text.toLowerCase()) ||
                item.Proovedor.toString().toLowerCase().includes(text.toLowerCase()) ||
                item.Contacto.toString().toLowerCase().includes(text.toLowerCase());
              // Filter products based on the text
              const TFiltro1 = SupplierData.filter(filterByText);
              setSupplierList(TFiltro1)
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setSupplierList(false)
        }
    }

    const GetSupplierL =async()=>{
        const ClientL = await SupplierListApi()
        setSupplierList(ClientL)
        refList.current = ClientL
    }
    useEffect(() => {
        GetSupplierL()

        return () => {
        }
    }, []);

    const newSupplier = async() => {
        const camposRequeridos = ['Proveedor', 'Contacto','Cel'];
        const camposFaltantes = verificarCamposVacios( dataSupplier ,camposRequeridos);
        if (camposFaltantes.length > 0 ) {
            TheAlert('No se puede crear el proveedor sin el campo: ' + camposFaltantes[0] )
        } else {
            const newSupp = await newSupplierApi(dataSupplier)
            if (newSupp.sucess) {
                TheAlert('Proveedor creado con exito')
                Cancel()
                GetSupplierL()
            } else {
                TheAlert('Error al crear el proveedor, error: ' + newSupp.error)
            }
        }
    };

    const updateSupplier = async() =>{
        const camposRequeridos = ['Proveedor', 'Contacto','Cel'];
        const camposFaltantes = verificarCamposVacios( dataSupplier ,camposRequeridos);
        if (camposFaltantes.length > 0 ) {
            TheAlert('No se puede actualizar el proveedor sin el campo: ' + camposFaltantes[0] )
        } else {
            const UpdSupp = await updSupplierApi(dataSupplier)
            if (UpdSupp.sucess) {
                TheAlert('Proveedor actualizado con exito')
                Cancel()
                GetSupplierL()
            } else {
                TheAlert('Error al actualizar el proveedor, error: ' + UpdSupp.error)
            }
        }
    }

    return (
        <div className="newSupplier" style={{margin: '10px'}}>
            <div>
                <h3>Cod: {dataSupplier.Cod}</h3>
            </div>
            <div className='Row'>
                <div className='_column1Customer' style={{display: 'flex',
                                                          flexDirection: 'column',
                                                          gap: '3px'
                                                        }}>
                    <div></div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Nit</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataSupplier.NitCc}
                                onChange={(e)=>{handleData('NitCc', e.target.value)}}
                            />
                            <label>-{dataSupplier.CV}</label>
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Proveedor</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Proveedor}
                                onChange={(e)=>{handleData('Proveedor', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Contacto</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Contacto}
                                onChange={(e)=>{handleData('Contacto', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Cel</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Cel}
                                onChange={(e)=>{handleData('Cel', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Telefono</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Telefono}
                                onChange={(e)=>{handleData('Telefono', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>E-mail</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Email}
                                onChange={(e)=>{handleData('Email', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Web</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Web}
                                onChange={(e)=>{handleData('Web', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Dirección</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Direccion}
                                onChange={(e)=>{handleData('Direccion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Ruta</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataSupplier.Ruta}
                                onChange={(e)=>{handleData('Ruta', e.target.value)}}
                            />
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
                                value={dataSupplier.Geolocalizacion}
                                onChange={(e)=>{handleData('Geolocalizacion', e.target.value)}}
                            />
                        </div>
                    </div>
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
                                value={dataSupplier.Nota}
                                onChange={(e)=>handleData('Nota', e.target.value)}
                                style={{width: '90%', height: '149px'}}
                                //disabled={showAlertCustomers}
                            />
                        </div>
                    </div>
                </div>
                <div className='_column2Customer'>
                    <div style={{display: 'flex'}}>
                        <label>Buscar:</label>
                        <div style={{width: '90%'}}>
                            <input
                                type="text"
                                className=""
                                value={searchText}
                                onChange={(e)=>{
                                    setSearchText(e.target.value);
                                    filterSupplier(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', // Coloca los elementos en columna
                        alignItems: 'center',    // Centra horizontalmente
                        justifyContent: 'center', // Centra verticalmente
                        height: '50vh'           // Ocupa toda la altura de la ventana
                    }}>
                        <Flatlist
                            data={supplierList}
                            headers={SupplierHeader}
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
                    style={{}}
                    disabled={dataSupplier.Cod !== ''}
                    onClick={()=>{newSupplier()}}
                >
                    Nuevo
                </button>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'green'}}
                    disabled={dataSupplier.Cod === ''}
                    onClick={()=>{updateSupplier()}}
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
    )
}