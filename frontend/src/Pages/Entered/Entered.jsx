import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { TheAlert } from '../../Components';
import { EnteredListApi } from '../../api';
import { OrderPreparationList } from '../../Components';
import { priceValue, dateFormat, toRealExcel } from '../../InternalFunctions';
import "./_Entered.scss";

export function Entered(){
    const [selectedfilaEntered, setSelectedfilaEntered] = useState(0);
    const [selectedfilaVerify, setSelectedfilaVerify] = useState(0);
    const [listEntered, setListEntered] = useState([]);
    const [listVerify, setListVerify] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [showOrderP, setShowOrderP] = useState(false);
    const enterList = useRef([]);

    const getEnteredL = async()=>{
        const GEntered = await EnteredListApi()
        setListEntered(GEntered)
        enterList.current = GEntered
        setListVerify([])
    };

    useEffect(() => {
        getEnteredL()
    }, []);
    
    const EnteredHeader = [
        {
            header: 'N° de pedido',
            key: 'ndepedido',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Cliente',
            key: 'cliente',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'F O pedido',
            key: 'fopedido',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'F de entrega',
            key: 'fdeentrega',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '10%',
            type: 'text',
        }
    ];

    const OrderPreparation = () => {
        if (listVerify.length === 0) {
            TheAlert('No hay pedidos para alistar');
        } else {
            const pedidos = listVerify.map(item => item.NDePedido); // solo extrae los NDePedido
            setOrderList(pedidos); // si estás usando React, esto actualiza el estado
            setShowOrderP(true);   // muestra lo que necesites mostrar
            return pedidos;        // retorna la lista por si la necesitas
        }
    };

    const RowOrderEntered = (item, index, columnsWidth) => {
        if (!item) return null;
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.NDePedido}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cliente}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaOdePedido)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaDeEntrega)}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.Total)}
                </td>
            </>
        );
    };

    const RowOrderVerify = (item, index, columnsWidth) => {
        if (!item) return null;
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.NDePedido}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cliente}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaOdePedido)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaDeEntrega)}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.Total)}
                </td>
            </>
        );
    };

    const adelante = () => {
        if (selectedfilaEntered == null && listEntered.length === 0) return;

        const itemToMove = listEntered[selectedfilaEntered];

        const newListVerify = [...listVerify, itemToMove]; // ✅ agrega sin mutar
        const newListEntered = listEntered.filter((_, i) => i !== selectedfilaEntered); // ✅ elimina sin mutar

        setListVerify(newListVerify);
        setListEntered(newListEntered);
        if (selectedfilaEntered === listEntered.length - 1){
            setSelectedfilaEntered(newListEntered.length - 1)
        }
    };

    const atras = () => {
        if (selectedfilaVerify == null && listVerify.length === 0) return;

        const itemToMove = listVerify[selectedfilaVerify];

        const newListEntered = [...listEntered, itemToMove]; // ✅ agrega sin mutar
        const newListVerify = listVerify.filter((_, i) => i !== selectedfilaVerify); // ✅ elimina sin mutar

        setListVerify(newListVerify);
        setListEntered(newListEntered);

        if (selectedfilaVerify === listVerify.length - 1){
            setSelectedfilaVerify(newListVerify.length - 1)
        }
    };

    return (
        <div>
            <div style={{display: 'flex'}}>
            
                <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '80vh',           // Ocupa toda la altura de la ventana
                    width: '45%'
                }}>
                <Flatlist
                    data={listEntered}
                    headers={EnteredHeader}
                    row={RowOrderEntered}
                    Height={'100%'}
                    selectedRow={selectedfilaEntered}
                    setSelectedRow={setSelectedfilaEntered}
                    rowStyles='alternative'
                />
                </div>
                <div>
                    <button
                        className='btnStnd btn1'
                        style={{backgroundColor: 'green'}}
                        onClick={()=>{atras()}}
                    >
                        atras
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{backgroundColor: 'green'}}
                        onClick={()=>{adelante()}}
                    >
                        Adelante
                    </button>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '80vh',           // Ocupa toda la altura de la ventana
                    width: '45%'
                }}>
                <Flatlist
                    data={listVerify}
                    headers={EnteredHeader}
                    row={RowOrderVerify}
                    Height={'100%'}
                    selectedRow={selectedfilaVerify}
                    setSelectedRow={setSelectedfilaVerify}
                    rowStyles='alternative'
                />
                </div>
            </div>
            <div>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'red'}}
                    onClick={()=>{getEnteredL()}}
                >
                    Cancelar
                </button>
                <button
                    className='btnStnd btn1'
                    style={{backgroundColor: 'green'}}
                    onClick={()=>{OrderPreparation()}}
                >
                    Alistar
                </button>
            </div>
            {showOrderP &&
                <OrderPreparationList
                    show={setShowOrderP}
                    lista={orderList}
                    update={getEnteredL}
                />
            }

        </div>
    )
}