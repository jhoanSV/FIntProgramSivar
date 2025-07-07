import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { ClientList } from '../../api';
import "./_Customerlist.scss";
import { TheAlert } from '../../Components';
import { toExcel, toRealExcel } from '../../InternalFunctions';

export function Customerlist(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [lista, setLista] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [objetive, setObjetive] = useState('Ferreteria');
    const refList = useRef([]);

    const GetSupplierL =async()=>{
        const ClientL = await ClientList()
        setLista(ClientL)
        refList.current = ClientL
    }

    useEffect(() => {
        GetSupplierL()
        return () => {
        }
    }, []);


    const CustomerHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Nit/CC',
            key: 'nitCc',
            defaultWidth: 400,
            type: 'text',
        },
        {
            header: 'Ferreteria',
            key: 'ferreteria',
            defaultWidth: 150,
            type: 'text',
        },
        {
            header: 'Contacto',
            key: 'contacto',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Celular',
            key: 'celular',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Telefono',
            key: 'telefono',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Email',
            key: 'email',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Dirección',
            key: 'direccion',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Barrio',
            key: 'barrio',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Ruta',
            key: 'ruta',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Vendedor',
            key: 'vendedor',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Geolocalización',
            key: 'geolocalizacion',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Nota',
            key: 'nota',
            defaultWidth: 200,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.Cod}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Nit}
                </td>
                <td onDoubleClick={()=>{}} >
                    {item.Ferreteria}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Contacto}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cel}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Telefono}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Email}
                </td>
                <td onDoubleClick={()=>{}} >
                    {item.Direccion}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Barrio}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.nombreRuta}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Vendedor}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Geolocalizacion}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Nota}
                </td>
            </>
        );
    };

    const filterProduct = (text) => {
        const proData = refList.current;
        setSearchText(text);

        if (text === '' || text.length < 2) {
            GetSupplierL()
            setLista(proData);
            return [];
        }

        const lowerText = text.toLowerCase();

        try {
            let TFiltro1;

            TFiltro1 = proData.filter((item) =>
                (
                    String(item[objetive]).toLowerCase().includes(lowerText)
                )
            );

            setLista(TFiltro1);
            return TFiltro1;

        } catch (error) {
            console.log('error-->', error);
            setLista([]);
        }
    };

    return (
        <div className="_About">
            <label>Filtrar por: </label>
            <select
                className=""
                value={objetive}
                onChange={(e)=>{setObjetive(e.target.value)}}
            >
                <option value="Ferreteria" >Ferreteria</option>
                <option value="Contacto">Contacto</option>
                <option value="Ruta">Ruta</option>
                <option value="Vendedor">Vendedor</option>
            </select>
            <input
                type="text"
                className=""
                value={searchText}
                onChange={(e)=>{filterProduct(e.target.value)}}
            />

            <button
                className='btnStnd btn1'
                style={{backgroundColor: 'green'}}
                onClick={()=>{toRealExcel(lista)}}
            >
                Exportar a excel
            </button>

            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '80%',           // Ocupa toda la altura de la ventana
                width: '98%'
            }}>
                <Flatlist
                    data={lista}
                    headers={CustomerHeader}
                    row={RowOrder}
                    Height={'50%'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
        </div>
    );
}