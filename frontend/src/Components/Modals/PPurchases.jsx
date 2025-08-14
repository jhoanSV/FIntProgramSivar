import React, { useEffect, useState, useRef } from 'react';
import { Flatlist, TheAlert } from '..';
import { PPPurchaseDetailApi, postMakePPApi } from '../../api';
import { TheInput } from '../../Components/InputComponent'
import "./_PPurchases.scss";
import { priceValue, dateFormat } from '../../InternalFunctions';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

export function PPurchases( {show, PpData, Action, type} ){
    const [selectedfila, setSelectedfila] = useState(0);
    const [list, setList] = useState([]);
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    const [total, setTotal] = useState(0)
    let Newsaldo = 0
    const getPP = async() => {
        const PP = await PPPurchaseDetailApi({
            "type": type,
            "Consecutivo": PpData.Consecutivo
        })
        setList(PP)
    };

    const [sendData, setSendData] = useState(
        {
            "Consecutivo": PpData.Consecutivo,
            "RC": "",
            "Fecha": new Date(),
            "CodProveedor": PpData.CodProveedor,
            "Abono": 0
        }
    );

    const handlesaleData = (item, value) => {
        setSendData((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const TotalSum = () => {
        let countTotal = 0;
        list.forEach((item) => {
            const saldo = item.Abono;
            countTotal += saldo
        });
        Newsaldo = PpData.Total - countTotal
        handlesaleData("Abono", Newsaldo)
        setTotal(countTotal);
    };

    useEffect(() => {
        TotalSum()
    }, [list])

    useEffect(() => {
        getPP()
    }, [PpData])
    
    const PPurchasesHeader = [
        {
            header: 'Fecha',
            key: 'fecha',
            defaultWidth: '33%',
            type: 'text',
        },
        {
            header: 'Recibo de caja',
            key: 'recibodecaja',
            defaultWidth: '33%',
            type: 'text',
        },
        {
            header: 'Abono',
            key: 'abono',
            defaultWidth: '33%',
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return null;
        return (
        <>
            <td onDoubleClick={()=>{}}>
                <label>
                    {dateFormat(item.Fecha)}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    {item.RC}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    $ {priceValue(item.Abono)}
                </label>
            </td>
        </>
        );
    };

    const makeAPP= async()=>{
        if (sendData.RC === '' ) {
            TheAlert('Falta ingresar un recibo de caja.')
        } else if (sendData.Abono === 0 || sendData.Abono === '') {
            TheAlert('Falta ingresar un abono.')
        } else {
            const repeat = list.filter((item)=>{
                return item.RC == sendData.RC
            })
            if (repeat.length > 0) {
                TheAlert('Ya existe el recibo de caja ' + sendData.RC)
                return
            } else {
                const makepp = await postMakePPApi(sendData)
                if (makepp.sucess){
                    TheAlert('Se realizó correctamente el abono.')
                    getPP()
                    Action()
                    handlesaleData('Abono', 0)
                    handlesaleData('RC', '')
                } else {
                    TheAlert('Ocurrio un error al realizar el abono.')
                }
            }
        }
    };

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '90%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Abonos de {type === 'Compras'? 'compras': 'ventas'}</h1>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>{type === 'Compras' ? 'Consecutivo': 'N° de pedido'}</strong></label>
                    </div >
                    <div className='_column2Customer'>
                        <label>{PpData.Consecutivo}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>Fecha factura</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>{PpData.FechaFactura}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>{type === 'Compras' ? 'Cod proveedor': 'Cod cliente'}</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>{PpData.CodProveedor}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>{type === 'Compras' ? 'Proveedor': 'Cliente'}</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>{PpData.Proveedor}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>Fecha de vencimiento</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>{PpData.FechaDeVencimiento}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>Total</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>$ {priceValue(PpData.Total)}</label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='_column1Customer'>
                        <label><strong>Saldo:</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>$ {priceValue(PpData.Total - total)}</label>
                    </div>
                </div>
                <h3>Datos de abono</h3>
                <div className='Row'>
                    <div className='_column1Customer' style={{display: 'flex'}}>
                        <div style={{width: '20%'}}>
                            <label><strong>R.C: </strong></label>
                        </div>
                        <div style={{width: '70%'}}>
                            <input
                                type="number"
                                className=""
                                value={sendData.RC}
                                style={{'width': '90%'}}
                                placeholder='Recibo de caja'
                                onChange={(e)=>{handlesaleData('RC', e.target.value)}}>
                            </input>
                        </div>
                    </div>

                    <div className='_column2Customer' style={{display: 'flex'}}>
                        <div style={{width: '20%'}}>
                            <label><strong>Valor:</strong></label>
                        </div>
                        <div style={{width: '70%'}}>
                            <input
                                type="number"
                                className=""
                                value={sendData.Abono}
                                min={0}
                                max={PpData.Total - total}
                                style={{'width': '90%'}}
                                placeholder='Recibo de caja'
                                onChange={(e)=>{handlesaleData('Abono', e.target.value)}}
                                onBlur={(e)=>{
                                    if (e.target.value > PpData.Total - total) {
                                        handlesaleData('Abono', PpData.Total - total)
                                    } else if (e.target.value < 0) {
                                        handlesaleData('Abono', PpData.Total - total)
                                    }
                                }}
                                >
                            </input>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '45vh'           // Ocupa toda la altura de la ventana
                }}>
                    <Flatlist
                        data={list}
                        headers={PPurchasesHeader}
                        row={RowOrder}
                        Height={'100%'}
                        selectedRow={selectedfila}
                        setSelectedRow={setSelectedfila}
                        rowStyles='alternative'
                    />
                </div>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{makeAPP()}}
                >
                    Abonar a factura
                </button>
            </div>
        </div>
    )
}