import React, { useEffect, useState ,useRef } from 'react';
import { Flatlist } from '../../Components';
import { GetProductListApi } from '../../api';
import { ListBox } from '../../Components/ListBox';
import "./_NewPurchase.scss";

export function NewPurchase(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [products, setProducts] = useState([]);
    const prodList = useRef([]);
    
    const GetProductL = async()=>{
        const productL = await GetProductListApi()
        setProducts(productL)
        prodList.current = productL
    };

    useEffect(() => {
      GetProductL()
      return () => {
      }
    }, [])
    
    const [list, setList ] = useState([
            {
                'Cantidad': '',
                'Codigo': '',
                'Descripcion': '',
                'Costo': '',
                'Iva': '',
                'UIva': '',
                'Total': '',
                'CostoLP': ''
            }]);

    const purchaseHeader = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '2%',
            type: 'text',
        },
        {
            header: 'Código',
            key: 'codigo',
            defaultWidth: '2%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '54%',
            type: 'text',
        },
        {
            header: 'Costo',
            key: 'costo',
            defaultWidth: '8%',
            type: 'text',
        },
        {
            header: 'Iva',
            key: 'iva',
            defaultWidth: '8%',
            type: 'text',
        },
        {
            header: 'U+Iva',
            key: 'uiva',
            defaultWidth: '8%',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '8%',
            type: 'text',
        },
        {
            header: 'Costo L.P',
            key: 'costolp',
            defaultWidth: '10%',
            type: 'text',
        }
    ];

    const handleData = (index, key, value) => {
        setList((prevList) => {
            const newList = prevList.map((supplier, i) =>
                i === index ? { ...supplier, [key]: value } : supplier
            );

            const last = newList[newList.length - 1];

            const isEmpty = (v) =>
                v === '' || v === null || v === undefined || v === 0;

            const isLastRowEmpty =
                isEmpty(last.Cantidad) &&
                isEmpty(last.Codigo) &&
                isEmpty(last.Descripcion) &&
                isEmpty(last.Costo) && 
                isEmpty(last.CostoLP)

            // Si se está editando la última fila vacía, agregar nueva fila vacía
            if (index === newList.length - 1 && !isLastRowEmpty) {
                newList.push({
                    'Cantidad': '',
                    'Codigo': '',
                    'Descripcion': '',
                    'Costo': '',
                    'Iva': '',
                    'UIva': '',
                    'Total': '',
                    'CostoLP': ''
                });
            }
            return newList;
        });
    };

    const RowOrder = (item, index, columnsWidth) => {
        return (
        <>
            <td onDoubleClick={()=>{}}>
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.Cantidad}
                    onChange={(e)=>{handleData(index, 'Cantidad' , e.target.value)}}
                    onBlur={(e)=>{}}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <input
                    type="text"
                    min="1"
                    className=""
                    value={item.Codigo}
                    onChange={(e)=>{}}
                    onBlur={(e)=>{}}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <ListBox
                    Value={item.Descripcion}
                    Disabled={false}
                    dataList={products}
                    Objetive={'descripcion'}
                    OnClick={{}}
                    Width={'350px'}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.Costo}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    {(item.Costo/0.19).toFixed(2)}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    {(item.Costo*(1 + 1/0.19)).toFixed(2)}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    {(item.Cantidad*(item.Costo*(1 + 1/0.19))).toFixed(2)}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    {}
                </label>
            </td>
        </>
        );
    };


    return (
        <div className="newproduct">
           <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Fecha:</label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Fecha factura: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="number"
                        min="1"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Dirección proveedor: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Fecha vencimiento: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Cod proveedor: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Proveedor: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Cod responsable: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Responsable: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Telefono proveedor: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Fecha vencimiento: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Dias de crédito: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Iva: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Retefuente: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Consecutivo: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div className='Row' style={{marginBottom: '3px'}}>
                <div className='_column1Customer'>
                    <label>Contado o crédito: </label>
                </div>
                <div className='_column2Customer'>
                    <input
                        type="text"
                        className=""
                        value={''}
                        onChange={(e)=>{}}
                    />
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '50%',           // Ocupa toda la altura de la ventana
                width: '80%'
            }}>
                <Flatlist
                    data={list}
                    headers={purchaseHeader}
                    row={RowOrder}
                    Height={'300px'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
        </div>
    )
}