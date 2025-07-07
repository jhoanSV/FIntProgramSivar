import React, { useEffect, useRef, useState } from 'react';
import { Flatlist } from '../../Components';
import { WorkerListApi } from '../../api';

export function NewWorker () {
    const [selectedfila, setSelectedfila ] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [workerList, setWorkerList ] = useState([]);
    const [dataWorker, setDataWorker] = useState({
        'Cod': '',
        'Nombre': '',
        'Apellido': '',
        'Cargo': '',
        'Telefono': '',
        'Cel': '',
        'Email': '',
        'Direccion': '',
        'Nota': '',
        'Contraseña': '',
        'Usuario': '',
        'Activo': false
    });

    const refList = useRef([]);

    const WorkerHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Nombre',
            key: 'Nombre',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'Apellido',
            key: 'apellido',
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

    const Cancel =()=>{
        const NewData = {
            'Cod': '',
            'Nombre': '',
            'Apellido': '',
            'Cargo': '',
            'Telefono': '',
            'Cel': '',
            'Email': '',
            'Direccion': '',
            'Nota': '',
            'Contraseña': '',
            'Usuario': '',
            'Activo': false
        }
        setDataWorker(NewData)
    };

    const RowOrder = (item, index, columnsWidth) => {
        //const rowIndex = index;
        const FillData =(data)=>{
        const NewData = {
            'Cod': data.Cod,
            'Nombre': data.Nombre,
            'Apellido': data.Apellido,
            'Cargo': data.Cargo,
            'Telefono': data.Telefono,
            'Cel': data.Cel,
            'Email': data.Email,
            'Direccion': data.Direccion,
            'Nota': data.Nota,
            'Contraseña': data.Contraseña,
            'Usuario': data.Usuario,
            'Activo': data.Activo
        }
        setDataWorker(NewData)
        }
        return (
        <>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Cod}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Nombre}
                </label>
            </td>
            <td onDoubleClick={()=>{FillData(item)}}>
                <label>
                    {item.Apellido}
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

    const filterWorker = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let CustomerData = refList.current//The whole table "Clients".
        try {
            if (text === '' || text < 2) {
                setWorkerList(refList.current);
            }else{
              // Define a case-insensitive text filter function
              const filterByText = (item) =>
                item.Cod.toString().toLowerCase().includes(text.toLowerCase()) ||
                item.Ferreteria.toString().toLowerCase().includes(text.toLowerCase());
              // Filter products based on the text
              const TFiltro1 = CustomerData.filter(filterByText);
              setWorkerList(TFiltro1)
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setWorkerList(false)
        }
    };

    useEffect(() => {
        const GetWorkerL =async()=>{
            const WorkerL = await WorkerListApi()
            setWorkerList(WorkerL)
            refList.current = WorkerL
        }
        GetWorkerL()
        return () => {
        }
    }, []);

    const handleData = (item, value) => {
        setDataWorker((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    return (
        <div className="_newWorker" style={{margin: '10px'}}>
            <h3>Cod: {dataWorker.Cod}</h3>
            <div className='Row' >
                <div className='_column1Customer' style={{display: 'flex',
                                                          flexDirection: 'column',
                                                          gap: '3px'
                                                        }}>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Nombre</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Nombre}
                                onChange={(e)=>{handleData('Nombre', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Apellido</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Apellido}
                                onChange={(e)=>{handleData('Apellido', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Cargo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Cargo}
                                onChange={(e)=>{handleData('Cargo', e.target.value)}}
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
                                value={dataWorker.Telefono}
                                onChange={(e)=>{handleData('Telefono', e.target.value)}}
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
                                value={dataWorker.Cel}
                                onChange={(e)=>{handleData('Cel', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Email</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Email}
                                onChange={(e)=>{handleData('Email', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Direccion</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Direccion}
                                onChange={(e)=>{handleData('Direccion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Contraseña</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataWorker.Contraseña}
                                onChange={(e)=>{handleData('Contraseña', e.target.value)}}
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
                                value={dataWorker.Usuario}
                                onChange={(e)=>{handleData('Usuario', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row'>
                        <div className='_column1Customer'>
                            <label>Activo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                value={dataWorker.Activo}
                                onChange={(e)=>{handleData('Activo', e.target.value)}}
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
                                value={dataWorker.Nota}
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
                                    filterWorker(e.target.value);
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
                            data={workerList}
                            headers={WorkerHeader}
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
                    onClick={()=>{}}
                >
                    Nuevo
                </button>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'green'}}
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