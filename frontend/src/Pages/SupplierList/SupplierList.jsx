import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { SupplierListApi } from '../../api';
import "./_SupplierList.scss";
import { TheAlert } from '../../Components';

export function SupplierList(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [lista, setLista] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [objetive, setObjetive] = useState('Proovedor');
    const refList = useRef([]);

    const GetSupplierL =async()=>{
        const ClientL = await SupplierListApi()
        setLista(ClientL)
        refList.current = ClientL
        console.log(ClientL)
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
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Proovedor',
            key: 'Proovedor',
            defaultWidth: 200,
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
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Telefono',
            key: 'telefono',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Email',
            key: 'email',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Web',
            key: 'web',
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
            header: 'Ruta',
            key: 'ruta',
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
                    {item.Proovedor}
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
                    {item.Web}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Direccion}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Ruta}
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

    const filterSupplier = (text) => {
        const suppData = refList.current;
        setSearchText(text);

        if (text === '' || text.length < 2) {
            GetSupplierL()
            setLista(suppData);
            return [];
        }

        const lowerText = text.toLowerCase();

        try {
            let TFiltro1;

            TFiltro1 = suppData.filter((item) =>
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
                <option value="Proovedor" >Proveedor</option>
                <option value="Contacto">Contacto</option>
                <option value="Ruta">Ruta</option>
            </select>

            <input
                type="text"
                className=""
                value={searchText}
                onChange={(e)=>{filterSupplier(e.target.value)}}
            />

            <button
                className='btnStnd btn1'
                style={{backgroundColor: 'green'}}
                onClick={()=>{}}
            >
                Exportar a excel
            </button>

            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '85vh',           // Ocupa toda la altura de la ventana
                width: '98%'
            }}>
                <Flatlist
                    data={lista}
                    headers={CustomerHeader}
                    row={RowOrder}
                    Height={'100%'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
        </div>
    );
}