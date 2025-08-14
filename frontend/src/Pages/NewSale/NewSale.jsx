import React, { useEffect, useRef, useState } from 'react';
import "./_NewSale.scss";
import { Flatlist, TheAlert, ListBox } from '../../Components';
import { VerifyCodNit } from '../../App'
import { GetProductListApi,
         ClientList,
         AdvisorsList } from '../../api';
import { verificarCamposVacios, calcularDiferenciaDias } from '../../InternalFunctions';
import { useTheContext } from '../../TheProvider';
export function NewSale(){
    const [selectedfila, setSelectedfila] = useState(0);
    const { usD, saleExternalData, setSaleExternalData } = useTheContext();
    const [saleData, setSaleData] = useState({
        'Cliente': '',
        'EnviarA': '',
        'Nit': '',
        'Ciudad': '',
        'Direccion': '',
        'Telefono': '',
        'Celular': '',
        'EMail': '',
        'Barrio': '',
        'Colaborador': '',
        'CodColaborador': '',
        'FOPedido': '',
        'FEntrega': '',
        'TPrecios': 'Contado',
        'TPago':'Contado',
        'FVencimiento': '',
        'ConPaquete': true,
        'Completo': false,
        'CodCliente': '',
        'Iva': false,
        'Nota': ''
    });
    const [productList, setProductList] = useState([]);
    const prodList = useRef([]);
    const clientList = useRef([]);
    const workerList = useRef([]);
    const [list, setList] = useState([
        {
            'Cantidad': '',
            'Codigo': '',
            'Descripcion': '',
            'VrUnitario': 0,
            'Iva': 0,
            'Total': 0,
            'Disponible': 0
        }
    ]);
    const handlesaleData = (item, value) => {
        setSaleData((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const getClientList = async()=>{
        const GetCliL = await ClientList();
        clientList.current = GetCliL
    };

    const getProduct = async() =>{
        const GetPro = await GetProductListApi();
        setProductList(GetPro);
        prodList.current = GetPro
    };

    const getWorkerL = async() =>{
        const GetWor = await AdvisorsList()
        workerList.current = GetWor
    };

    useEffect(() => {
        getProduct();
        getClientList();
        getWorkerL();
        console.log('saleExternalData: ', saleExternalData)
        setSaleData(saleExternalData.headerSale)
        setList(saleExternalData.saleList)

    }, []);

    useEffect(() => {
        setSaleExternalData({
            headerSale: saleData,
            saleList: list
        }
        )
    }, [saleData, list])
    

    const SaleDetailHeader = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Codigo',
            key: 'codigo',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '40%',
            type: 'text',
        },
        {
            header: 'Vr Unitario',
            key: 'vrunitario',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Iva',
            key: 'iva',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Vr Total',
            key: 'vrtotal',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Disponible',
            key: 'disponible',
            defaultWidth: '5%',
            type: 'text',
        }
    ];
    
    const RowOrder = (item, index, columnsWidth) => {
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
                    isEmpty(last.Descripcion)
    
                // Si se está editando la última fila vacía, agregar nueva fila vacía
                if (index === newList.length - 1 && !isLastRowEmpty) {
                    newList.push({
                        'Cantidad': '',
                        'Codigo': '',
                        'Descripcion': '',
                        'VrUnitario': 0,
                        'Iva': 0,
                        'Total': 0,
                        'Disponible': 0
                    });
                }
                return newList;
            });
        };

        const selectedProduct =(item)=>{
            handleData(index, 'Codigo' , item.Cod)
            handleData(index, 'Descripcion' , item.descripcion)
            handleData(index, 'VrUnitario' , item.PventaContado)
            handleData(index, 'Iva' , item.Iva)
        };

        return (
            <>
                <td onDoubleClick={()=>{}}>
                    <input
                        type="number"
                        min="1"
                        className=""
                        value={item.Cantidad}
                        style={{width: '100%'}}
                        onChange={(e)=>{handleData(index,'Cantidad',e.target.value)}}
                        onBlur={(e)=>{}}
                    />
                </td>
                <td onDoubleClick={()=>{}}>
                    <input
                        type="text"
                        min="1"
                        className=""
                        value={item.Cantidad}
                        style={{width: '100%'}}
                        onChange={(e)=>{handleData(index,'Codigo',e.target.value)}}
                        onBlur={(e)=>{}}
                    />
                </td>
                <td onDoubleClick={()=>{}}>
                    <ListBox
                        Value={item.Descripcion}
                        Disabled={false}
                        dataList={prodList.current}
                        Objetive={'descripcion'}
                        OnClick={selectedProduct}
                        Width={'100%'}
                        ListWidth={'50%'}
                    />
                </td>
                <td onDoubleClick={()=>{}}>
                    <label>$ </label>
                </td>
                <td onDoubleClick={()=>{}}>
                    <label>$ </label>
                </td>
                <td onDoubleClick={()=>{}}>
                    <label>$ </label>
                </td>
                <td onDoubleClick={()=>{}} style={{color: item.Cantidad< item.Disponible? 'red': ''}}>
                    <label>{item.Disponible}</label>
                </td>
            </>
        );
    };

    return (
        <div>
            <div
                className='_contentSaleData'
                style={{
                    display: 'flex',
                    width: '98%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5px'
                }}>

                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Cliente:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={saleData.Cliente}
                                onChange={(e) => {
                                    const selectedClient = e.target.value;
                                    const selectedOption = clientList.current.find(
                                        (opcion) => opcion.Ferreteria === selectedClient
                                    );
                                    if (selectedOption) {
                                        handlesaleData('Cliente', selectedOption.Ferreteria)
                                        handlesaleData('EnviarA', selectedOption.Contacto)
                                        handlesaleData('Nit', selectedOption.Nit)
                                        handlesaleData('Direccion', selectedOption.Direccion)
                                        handlesaleData('Telefono', selectedOption.Telefono)
                                        handlesaleData('Celular', selectedOption.Cel)
                                        handlesaleData('EMail', selectedOption.Email)
                                        handlesaleData('Barrio', selectedOption.Barrio)
                                        handlesaleData('Colaborador', selectedOption.Vendedor)
                                        handlesaleData('CodColaborador', selectedOption.CodVendedor)
                                        handlesaleData('CodCliente', selectedOption.Cod)
                                    }
                                }}
                                style={{width: '90%'}}
                            >
                                <option value="" disabled={true} >--Cliente--</option>
                                {clientList.current.map((opcion) => (
                                    <option
                                        key={opcion.Cod}
                                        value={opcion.Ferreteria}>
                                        {opcion.Ferreteria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Enviar a:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={saleData.EnviarA}
                                onChange={(e)=>{handlesaleData('EnviarA', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Nit/CC:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.Nit}
                                onChange={(e)=>{handlesaleData('Nit', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Ciudad:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={saleData.Ciudad}
                                onChange={(e)=>{handlesaleData('Ciudad', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Dirección:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.Direccion}
                                onChange={(e)=>{handlesaleData('Direccion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Telefono:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.Telefono}
                                onChange={(e)=>{handlesaleData('Telefono', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Celular:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.Celular}
                                onChange={(e)=>{handlesaleData('Celular', e.target.value)}}
                            />
                        </div>
                    </div>
                </div>
                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>E-mail:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.EMail}
                                onChange={(e)=>{handlesaleData('EMail', e.target.value)}}
                                />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Barrio:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.Barrio}
                                onChange={(e)=>{handlesaleData('Barrio', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Vendedor:</strong></label>
                        </div>
                        <div className='_column2Customer' style={{display: 'flex'}}>
                            <div style={{width: '70%'}}>
                                <select
                                    id="mi-select"
                                    value={saleData.Colaborador}
                                    onChange={(e) => {
                                        const selectedWorker = e.target.value;
                                        const selectedOption = workerList.current.find(
                                            (opcion) => opcion.Nombre === selectedWorker
                                        );
                                        if (selectedOption) {
                                            handlesaleData('Colaborador', selectedOption.Nombre)
                                            handlesaleData('CodColaborador', selectedOption.Cod)
                                        }
                                    }}
                                    style={{width: '90%'}}
                                >
                                    <option value="" disabled={true} >--Vendedor--</option>
                                    {workerList.current.map((opcion) => (
                                        <option
                                            key={opcion.Cod}
                                            value={opcion.Nombre}>
                                            {opcion.Nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{width: '30%'}}>
                                <input
                                    type="number"
                                    className=""
                                    value={saleData.CodColaborador}
                                    onChange={(e)=>{handlesaleData('CodColaborador', e.target.value)}}
                                    onBlur={(e)=>{
                                        const selectedWorker = e.target.value
                                        const selectedOption = workerList.current.find(
                                            (opcion) => opcion.Cod == selectedWorker
                                        );
                                        if (selectedOption) {
                                            handlesaleData('Colaborador', selectedOption.Nombre)
                                        } else {
                                            TheAlert('No se encuentra vendedor con codigo ' + e.target.value)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer' >
                            <label><strong>Fecha O Pedido:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="date"
                                className=""
                                value={saleData.FOPedido}
                                onChange={(e)=>{handlesaleData('FOPedido', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Fecha entrega:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="date"
                                className=""
                                value={saleData.FEntrega}
                                onChange={(e)=>{handlesaleData('FEntrega', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Tabla de precios:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                            id="mi-select"
                            value={saleData.TPrecios}
                            onChange={(e) => {handlesaleData('TPrecios', e.target.value)}}
                            style={{width: '90%'}}
                        >
                            <option value="Contado">Contado</option>
                            <option value="Credito">Crédito</option>
                            <option value="Proveedor">Proveedor</option>
                        </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Tipo de pago:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={saleData.TPago}
                                onChange={(e) => {handlesaleData('TPago', e.target.value)}}
                                style={{width: '90%'}}
                            >
                                <option value="Contado">Contado</option>
                                <option value="Credito">Crédito</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Fecha de vencimiento:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="date"
                                className=""
                                value={saleData.FVencimiento}
                                onChange={(e)=>{
                                    if (saleData.TPago === 'Credito' && saleData.FOPedido !== '') {
                                        handlesaleData('FVencimiento', e.target.value)
                                        const dias = calcularDiferenciaDias(saleData.FOPedido, saleData.FVencimiento)
                                        handlesaleData('DiasCreditos', dias)
                                    }
                                }}
                                onBlur={(e)=>{}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Dias:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                min={0}
                                value={saleData.DiasCreditos}
                                onChange={(e)=>{handlesaleData('DiasCreditos', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Con paquete:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                checked={saleData.ConPaquete}
                                onChange={(e)=>{handlesaleData('ConPaquete', e.target.checked)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Completo:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                checked={saleData.Completo}
                                onChange={(e)=>{handlesaleData('Completo', e.target.checked)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Cod cliente:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={saleData.CodCliente}
                                onChange={(e)=>{handlesaleData('CodCliente', e.target.value)}}
                                onBlur={(e)=>{
                                    const selectedClient = e.target.value
                                    const selectedOption = clientList.current.find(
                                        (opcion) => opcion.Cod == selectedClient
                                    );
                                    if (selectedOption) {
                                        handlesaleData('Cliente', selectedOption.Ferreteria)
                                        handlesaleData('EnviarA', selectedOption.Contacto)
                                        handlesaleData('Nit', selectedOption.Nit)
                                        handlesaleData('Direccion', selectedOption.Direccion)
                                        handlesaleData('Telefono', selectedOption.Telefono)
                                        handlesaleData('Celular', selectedOption.Cel)
                                        handlesaleData('EMail', selectedOption.Email)
                                        handlesaleData('Barrio', selectedOption.Barrio)
                                        handlesaleData('Colaborador', selectedOption.Vendedor)
                                        handlesaleData('CodColaborador', selectedOption.CodVendedor)
                                        handlesaleData('CodCliente', selectedOption.Cod)
                                    } else {
                                        TheAlert('No se encuentra cliente con codigo ' + e.target.value)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px', alignItems: 'center'}}>
                        <div className='_column1Customer'>
                            <label><strong>Iva:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                value={saleData.Iva}
                                onChange={(e)=>{handlesaleData('Iva', e.target.checked)}}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <button
                            className='btnStnd btn1'
                            style={{backgroundColor: 'green'}}
                            onClick={()=>{}}
                        >
                            Guardar
                        </button>
                    </div>
                    <div>
                        <button
                            className='btnStnd btn1'
                            style={{backgroundColor: 'red'}}
                            onClick={()=>{}}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '50vh',           // Ocupa toda la altura de la ventana
                width: '100%'
            }}>
            <Flatlist
                data={list}
                headers={SaleDetailHeader}
                row={RowOrder}
                Width={'98%'}
                Height={'100%'}
                selectedRow={selectedfila}
                setSelectedRow={setSelectedfila}
                rowStyles='alternative'
            />
            </div>

            <div
                style={{
                    display: 'flex',
                    width: '98%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5px'}}
                >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                        
                    }}>
                    <div>
                        <label><strong>Notas de ventas:</strong></label>
                    </div>
                    <div>
                        <button
                            className='btnStnd btn1'
                            style={{backgroundColor: 'green'}}
                            onClick={()=>{}}
                        >
                            Cotizar
                        </button>
                    </div>
                </div>
                <div style={{'width': '65%'}}>
                    <textarea
                        id='nctaId'
                        type="textbox"
                        className="taStnd ncTextArea"
                        placeholder="Nota de compra"
                        value={saleData.Nota}
                        onChange={(e)=>handlesaleData('Nota', e.target.value)}
                        style={{width: '100%', height: '149px'}}
                    />
                </div>
                <div>
                    <label>Total:</label>
                    <label>$ Total:</label>
                </div>
                <div>
                    <label>Total Iva:</label>
                    <label>$ Total iva:</label>
                </div>
            <div>
            </div>
            </div>
        </div>
    )
}