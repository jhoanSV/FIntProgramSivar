import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Flatlist, TheAlert } from '..';
import { getPreparationListApi, postStateFlowApi } from '../../api';
import "./_SearhProduct.scss";
import "./_GeneralModal.scss";
import { toStyledExcel } from '../../InternalFunctions';
import { priceValue, dateFormat, toRealExcel } from '../../InternalFunctions';

export function OrderPreparationList({show, lista, update}){
    const [searchText, setSearchText] = useState('');
    const [selectedfila, setSelectedfila] = useState(0);
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    const [list, setList] = useState([]);

    const getList = async() => {
        const prepList = await getPreparationListApi({"NPedidoList": lista});
        const acumulados = {};
        const result = prepList.map((item) => {
            const codigo = item.Codigo;
            const previo = acumulados[codigo] || 0;

            // Guarda la cantidad actual en el acumulador
            acumulados[codigo] = previo + item.Cantidad;

            // Retorna el objeto con columna adicional "CantidadPrevios"
            return {
                ...item,
                CantidadPrevios: previo
            };
        });
        setList(result);
        //return result;
    };

    useEffect(() => {
      getList()
    }, []);
    
    const sendData = async() => {
        const toSend = await TheAlert('¿Desea mandar a alistar los pedidos?', 1)
        console.log(toSend)
        if (toSend === true) {
            const producstList = []
            const Today = new Date()
            const DateToday = Today.toISOString().split('T')[0];
            const HourToday = Today.toTimeString().split(' ')[0];

            const Data = list.map((item) => {
                //NPedidoList.push(item.NDePedido)
                producstList.push([
                    item.NDePedido,
                    item.Cantidad,
                    item.Codigo,
                    item.VrUnitario,
                    item.Costo,
                    HourToday,
                    item.Disponible - item.CantidadPrevios - item.Cantidad > 0 ? true: false
                ])
            })
            const SendD = {
                "FlowData": producstList,
                "NpedidoList":  lista,
                "Today": Today,
                "Date": DateToday,
                "Hour": HourToday
            }
            console.log(SendD)
            const SendedList = await postStateFlowApi(SendD);
            if (SendedList.sucess) {
                TheAlert('Se registraron los datos correctamente')
                exportToExcel()
                update()
            } else {
                TheAlert('Ocurrio un error en el registro de los datos: Error: ' + SendedList.error)
            }
        }
    }

    const exportToExcel = () =>{
        const producstList = []
        const Today = new Date()
        const DateToday = Today.toISOString().split('T')[0];

        const Data = list.map((item) => {
            //NPedidoList.push(item.NDePedido)
            producstList.push([
                item.Cantidad,
                item.Codigo,
                item.Descripcion,
                item.Costo,
                item.Proveedor,
                dateFormat(item.FechaDeEntrega),
                (item.Cantidad * item.Costo).toFixed(2),
                item.Disponible - item.CantidadPrevios - item.Cantidad > 0 ? false: true
            ])
        })
        toStyledExcel(
            producstList,
            'Pendientes' + String(DateToday) + '.xlsx',
            [
                {header: 'Cantidad', key: 'Cantidad'},
                {header: 'Codigo', key: 'Codigo'},
                {header: 'Descripcion', key: 'Descripcion'},
                {header: 'Costo', key: 'Costo'},
                {header: 'Proveedor', key: 'Proveedor'},
                {header: 'FechaDeEntrega', key: 'FechaDeEntrega'},
                {header: 'Total', key: 'Total'},
                {header: 'Disponible', key: 'Disponible'}
            ],
            ['Disponible', true]  // Segunda columna
            );
    }

    const productHeader = [
        {
            header: 'Ferreteria',
            key: 'ferreteria',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Disponible',
            key: 'disponible',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Posición',
            key: 'posicion',
            defaultWidth: '10%',
            type: 'text',
        }
    ];
    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return
        const color = item.Disponible - item.CantidadPrevios - item.Cantidad > 0 ? '': 'yellow'
        return (
        <>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Ferreteria}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Cantidad}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Codigo}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Descripcion}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Disponible}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: color, color: 'black'}}>
                <label>
                    {item.Ubicación}
                </label>
            </td>
        </>
        );
    };

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '85%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Alistar pedidos</h1>
                </div>
                    <div className='theModal-body' style={{height: '100%'}}>
                        <button
                        className='btnStnd btn1'
                        onClick={()=>{exportToExcel()}}
                    >
                        Exportar a excel
                    </button>
                    <button
                        className='btnStnd btn1'
                        onClick={()=>{sendData()}}
                    >
                        Alistar pedidos
                    </button>
                    <div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column', // Coloca los elementos en columna
                            alignItems: 'center',    // Centra horizontalmente
                            justifyContent: 'center', // Centra verticalmente
                            height: '65vh'           // Ocupa toda la altura de la ventana
                        }}>
                            <Flatlist
                                data={list}
                                headers={productHeader}
                                row={RowOrder}
                                Height={'100%'}
                                selectedRow={selectedfila}
                                setSelectedRow={setSelectedfila}
                                rowStyles='alternative'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}