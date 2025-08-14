import React, { useEffect, useState ,useRef } from 'react';
import { Flatlist } from '../../Components';
import {GetProductListApi,
        SupplierListApi,
        NewPurchaseApi
 } from '../../api';
import { TheAlert } from '../../Components';
import { ListBox } from '../../Components/ListBox';
import { useTheContext } from '../../TheProvider';
import { TheInput } from '../../Components';
import {
        priceValue,
        dateFormat,
        formatDateForInput,
        calcularDiferenciaDias,
        verificarCamposVacios } from '../../InternalFunctions';
import "./_NewPurchase.scss";
import { useLocation } from 'react-router-dom';

export function NewPurchase(){
    const {setSection } = useTheContext()
    const [selectedfila, setSelectedfila] = useState(0);
    const [products, setProducts] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalIva, setTotalIva] = useState(0);
    const prodList = useRef([]);
    const suppList = useRef([]);
    const { usD, purchaseData, setPurchaseData } = useTheContext();
    const [focusFlatlist, setFocusFlatlist] = useState(0);
    const [invoiceData, setInvoiceData] = useState({
        'Nfactura': '',
        'Date': '',
        'InvoiceDate': formatDateForInput(new Date()),
        'ExpirationDate': formatDateForInput(new Date()),
        'CodSupplier': '',
        'Supplier': '',
        'SupplierPhone': '',
        'SupplierAddress': '',
        'ResponsibleCode': usD.Cod,
        'Responsible': usD.Nombre + ' ' + usD.Apellido,
        'CreditDays': 0,
        'Iva': false,
        'Retefuente': '',
        'Consecutive': '',
        'ContadoOCredito': 'Contado'
    });
    const [list, setList ] = useState([
        {
            'Cantidad': '',
            'Codigo': '',
            'Descripcion': '',
            'Costo': 0,
            'Iva': 0,
            'UIva': 0,
            'Total': 0,
            'CostoLP': 0
        }
    ]);

    const defaultData = {
        headerData: {
            'Nfactura': '',
            'Date': '',
            'InvoiceDate': formatDateForInput(new Date()),
            'ExpirationDate': formatDateForInput(new Date()),
            'CodSupplier': '',
            'Supplier': '',
            'SupplierPhone': '',
            'SupplierAddress': '',
            'ResponsibleCode': usD.Cod,
            'Responsible': usD.Nombre + ' ' + usD.Apellido,
            'CreditDays': 0,
            'Iva': false,
            'Retefuente': '',
            'Consecutive': '',
            'ContadoOCredito': 'Contado'
        },
        PurchaseList: [
            {
                'Cantidad': '',
                'Codigo': '',
                'Descripcion': '',
                'Costo': 0,
                'Iva': 0,
                'UIva': 0,
                'Total': 0,
                'CostoLP': 0
            }
        ]
    };
    
    const handleInvoiceData = (item, value) => {
        setInvoiceData((prevInvoiceData) => {
            const updatedHeaderData = {
                ...prevInvoiceData,
                [item]: value,
            };

            // Reflejar el cambio también en purchaseData
            setPurchaseData((prevPurchaseData) => ({
                ...prevPurchaseData,
                headerData: updatedHeaderData,
            }));

            return updatedHeaderData;
        });
    };
    
    const GetProductL = async()=>{
        const productL = await GetProductListApi()
        setProducts(productL)
        prodList.current = productL
    };

    const GetSupplierL =async()=>{
        const supplierL = await SupplierListApi()
        setSupplier(supplierL)
        suppList.current = supplierL
    }

    useEffect(() => {
        const init = async () => {
            await GetProductL()
            await GetSupplierL()
            const date = new Date();
            handleInvoiceData('Date', dateFormat(date))
            if (purchaseData !== null && purchaseData !== defaultData) {
                setInvoiceData(purchaseData.headerData)
                setList(purchaseData.PurchaseList)
            }
        }

        init()
        setSection('Nueva compra')
    }, []);

    const deleteFila = () => {
        if (list.length > 1) {
            const newList = [...list];
            newList.splice(selectedfila, 1); // esto sí modifica la copia
            setList(newList);
        } else {
            setList([
                {
                    'Cantidad': '',
                    'Codigo': '',
                    'Descripcion': '',
                    'Costo': 0,
                    'Iva': 0,
                    'UIva': 0,
                    'Total': 0,
                    'CostoLP': 0
                }
            ]);
        }
    };

    useEffect(() => {
        setPurchaseData((prevListData) => ({
            ...prevListData,
            PurchaseList: list,
        }));
    }, [list]);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (focusFlatlist) {
                if (e.key === 'Delete') {
                    e.preventDefault();
                    console.log('Borrar fila', selectedfila);
                    deleteFila()
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusFlatlist, selectedfila]);

    const constPlusIva = (cost, iva) =>{
        const TheIva = parseFloat(iva) || 0
        const TheCost = parseFloat(cost) || 0
        const Iva = 1 + TheIva/100
        let CpusIva = TheCost
        if (invoiceData.Iva) {
            CpusIva = TheCost * Iva
        }
        return CpusIva.toFixed(2)
    };

    const TotalSum = () => {
        let countTotal = 0;
        let countTotalIva = 0;
        list.forEach((item) => {
            const base = item.Cantidad * item.Costo;
            const iva = invoiceData.Iva ? base * (item.Iva / 100) : 0;
            const tIva = item.Cantidad * constPlusIva(item.Costo, item.Iva);
            countTotal += base + iva;
            countTotalIva += iva
        });
        setTotal(countTotal);
        setTotalIva(countTotalIva);
    };

    useEffect(() => {
      TotalSum()
    }, [list, invoiceData])
    

    const purchaseHeader = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Código',
            key: 'codigo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '30%',
            type: 'text',
        },
        {
            header: 'Costo',
            key: 'costo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Iva',
            key: 'iva',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'U+Iva',
            key: 'uiva',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Costo L.P',
            key: 'costolp',
            defaultWidth: '10%',
            type: 'text',
        }
    ];

    const Cancel = () => {
        const date = new Date();
        setInvoiceData({
            'Date': date,
            'InvoiceDate': formatDateForInput(new Date()),
            'ExpirationDate': formatDateForInput(new Date()),
            'CodSupplier': '',
            'Supplier': '',
            'SupplierPhone': '',
            'SupplierAddress': '',
            'ResponsibleCode': usD.Cod,
            'Responsible': usD.Nombre + ' ' + usD.Apellido,
            'CreditDays': 0,
            'Iva': false,
            'Retefuente': '',
            'Consecutive': '',
            'ContadoOCredito': 'Contado'
        });

        setList([
            {
                'Cantidad': '',
                'Codigo': '',
                'Descripcion': '',
                'Costo': 0,
                'Iva': 0,
                'CostoLP': 0
            }
        ])
    };

    const SendNewPurchase = async() => {
        const newlist = list.slice(0, -1).map((item) => ({
            ...item,
            UIva: constPlusIva(item.Costo, item.Iva),
            TotalIva: invoiceData.Iva? (item.Costo * (item.Iva/100)).toFixed(2) : (item.Costo).toFixed(2)
        }));
        const date = new Date()
        if (invoiceData.Consecutive !== '') {
            TheAlert('No se puede crear una conpra con un consecutivo ya asignado.')
        } else if (newlist.length === 0) {
            TheAlert('No hay productos para ingresar.')
        } else {
            const camposRequeridos = [
                                    'Nfactura',
                                    'CodSupplier',
                                    'Supplier',
                                    ]
            const camposFaltantes = verificarCamposVacios(invoiceData,camposRequeridos);
            if (camposFaltantes.length > 0) {
                TheAlert('Falta ingresar ' + camposFaltantes[0] )
            } else {
                const sendData = {...invoiceData}
                sendData.Total = total
                sendData.PurchaseEntranseL = newlist
                sendData.Date = date
                console.log(sendData)
                const NPurchase = await NewPurchaseApi(sendData)
                if (NPurchase.sucess) {
                    TheAlert('La compra se registró con exito, con consecutivo: ' + String(NPurchase.Consecutivo))
                    Cancel()
                } else {
                    TheAlert('Ocurrio un error al regitrar la compra, error:' + NPurchase.error)
                }
            }
        }
        
    }

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
                        'CostoLP': 0
                    });
                }
                return newList;
            });
        };

        const selectedProduct =(item)=>{
            handleData(index, 'Codigo' , item.Cod)
            handleData(index, 'Descripcion' , item.descripcion)
            handleData(index, 'CostoLP' , item.PCosto)
            handleData(index, 'Iva' , item.Iva)
        };
        const UpIva = constPlusIva(item.Costo,item.Iva)

        return (
        <>
            <td onDoubleClick={()=>{}}>
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.Cantidad}
                    style={{width: '100%'}}
                    onChange={(e)=>{handleData(index, 'Cantidad' , e.target.value)}}
                    onBlur={(e)=>{}}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <input
                    type="text"
                    min="1"
                    className=""
                    style={{width: '100%'}}
                    value={item.Codigo}
                    onChange={(e)=>handleData(index, 'Codigo' , e.target.value)}
                    onBlur={(e)=>{
                        const selectedProduct = e.target.value;
                        if (selectedProduct !== ''){
                            const selectedOption = products.find(
                                (opcion) => String(opcion.Cod).toLowerCase() === String(selectedProduct).toLowerCase()
                            );
                            if (selectedOption){
                                handleData(index, 'Codigo' , selectedOption.Cod)
                                handleData(index, 'Descripcion' , selectedOption.descripcion)
                                handleData(index, 'CostoLP' , selectedOption.PCosto)
                                handleData(index, 'Iva' , selectedOption.Iva)
                            } else {
                                TheAlert("No se encuentra el producto con código " + item.e.target.value)
                            }
                        }
                    }}
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
                <input
                    type="number"
                    min="1"
                    className=""
                    style={{width: '100%'}}
                    value={item.Costo}
                    onChange={(e)=>handleData(index, 'Costo', e.target.value)}
                    onBlur={(e)=>{}}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    $ {invoiceData.Iva? priceValue((item.Costo*(item.Iva/100)).toFixed(2)): priceValue((0).toFixed(2))}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{backgroundColor: (UpIva > item.CostoLP? 'red': (UpIva < item.CostoLP? 'green': ''))}}>
                <label>
                    $ {priceValue(UpIva)}
                </label>
            </td>
            <td onDoubleClick={()=>{}}  >
                <label>
                    $ {invoiceData.Iva? priceValue((item.Cantidad*(item.Costo*(1.19))).toFixed(2)): priceValue((item.Cantidad*item.Costo).toFixed(2))}
                </label>
            </td>
            <td onDoubleClick={()=>{}}>
                <label>
                    $ {priceValue((item.CostoLP).toFixed(2))}
                </label>
            </td>
        </>
        );
    };

    const RetefuenteValue = (valor) => {
        handleInvoiceData('Retefuente',valor)
    }

    return (
        <div className="newproduct" 
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <div
                style={{
                    display: 'flex',
                    width: '98%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '5px'
                }}>
                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Fecha:</label>
                        </div>
                        <label>
                            {dateFormat(invoiceData.Date)}
                        </label>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Fecha factura: </label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="date"
                                className=""
                                value={invoiceData.InvoiceDate}
                                onChange={(e)=>{handleInvoiceData('InvoiceDate',e.target.value)}}
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
                                value={invoiceData.CodSupplier}
                                onChange={(e)=>{
                                    handleInvoiceData('CodSupplier',e.target.value)
                                }}
                                onBlur={(e)=>{
                                    const selectedSupplier = e.target.value;
                                    const selectedOption = supplier.find(
                                        (opcion) => String(opcion.Cod) === String(selectedSupplier)
                                    );
                                    if (selectedOption) {
                                        handleInvoiceData('Supplier', selectedOption.Proovedor);
                                        handleInvoiceData('CodSupplier', selectedOption.Cod);
                                        handleInvoiceData('SupplierPhone', selectedOption.Telefono);
                                        handleInvoiceData('SupplierAddress', selectedOption.Direccion);
                                    } else {
                                        TheAlert('No existe el proveedor con codigo: ' + e.target.value)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Proveedor: </label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={invoiceData.Supplier}
                                onChange={(e) => {
                                    const selectedSupplier = e.target.value;
                                    const selectedOption = supplier.find(
                                        (opcion) => opcion.Proovedor === selectedSupplier
                                    );
                                    if (selectedOption) {
                                        handleInvoiceData('Supplier', selectedOption.Proovedor);
                                        handleInvoiceData('CodSupplier', selectedOption.Cod);
                                        handleInvoiceData('SupplierPhone', selectedOption.Telefono);
                                        handleInvoiceData('SupplierAddress', selectedOption.Direccion);
                                    }
                                }}
                                style={{width: '90%'}}
                            >
                                <option value="" disabled={true} >--Proveedor--</option>
                                {supplier.map((opcion) => (
                                    <option
                                        key={opcion.Cod}
                                        value={opcion.Proovedor}>
                                        {opcion.Proovedor}
                                    </option>
                                ))}
                            </select>
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
                                value={invoiceData.SupplierPhone}
                                onChange={(e)=>handleInvoiceData('SupplierPhone',e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='_columnNewProduct'>                
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Cod responsable: </label>
                        </div>
                        <div className='_column2Customer'>
                            <label>{invoiceData.ResponsibleCode}</label>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Responsable: </label>
                        </div>
                        <div className='_column2Customer'>
                            <label>{invoiceData.Responsible}</label>
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
                                value={invoiceData.SupplierAddress}
                                onChange={(e)=>handleInvoiceData('SupplierAddress',e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Contado o crédito: </label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={invoiceData.ContadoOCredito}
                                onChange={(e) => {
                                    handleInvoiceData('ContadoOCredito',e.target.value)
                                    if (e.target.value === 'Contado'){
                                        const actualDate = invoiceData.InvoiceDate
                                        handleInvoiceData('CreditDays', 0)
                                        handleInvoiceData('ExpirationDate', actualDate)
                                    }
                                }}
                                style={{width: '50%'}}
                            >
                                <option value="Contado">Contado</option>
                                <option value="Credito">Crédito</option>
                            </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Dias de crédito: </label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                disabled={invoiceData.ContadoOCredito === 'Contado'}
                                min={0}
                                value={invoiceData.CreditDays}
                                onChange={(e)=>{
                                    const dias = parseInt(e.target.value) || 0;
                                    const expiration = new Date(invoiceData.InvoiceDate);
                                    expiration.setDate(expiration.getDate() + dias);
                                    handleInvoiceData('CreditDays', dias);
                                    handleInvoiceData('ExpirationDate', formatDateForInput(expiration));
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Consecutivo: </label>
                        </div>
                        <div className='_column2Customer'>
                            <label>{invoiceData.Consecutive}</label>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>N° de factura: </label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={invoiceData.Nfactura}
                                onChange={(e)=>{handleInvoiceData('Nfactura', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Iva: </label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                checked={invoiceData.Iva}
                                onChange={(e)=>handleInvoiceData('Iva',e.target.checked)}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Retefuente: </label>
                        </div>
                        <div className='_column2Customer'>
                            <TheInput
                                val={invoiceData.Retefuente}
                                onchange={RetefuenteValue}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Fecha vencimiento: </label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="date"
                                className=""
                                disabled={invoiceData.ContadoOCredito === 'Contado'}
                                value={invoiceData.ExpirationDate}
                                onChange={(e)=>{
                                    const expiration = formatDateForInput(new Date(e.target.value))
                                    const days = calcularDiferenciaDias(invoiceData.InvoiceDate, expiration)
                                    handleInvoiceData('ExpirationDate', expiration)
                                    handleInvoiceData('CreditDays', days)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{width: '10%', display: 'flex', flexDirection: 'column'}}>
                    <button
                        className='btnStnd btn1'
                        style={{margin: '20px'}}
                        onClick={()=>{Cancel()}}
                    >
                        Cancelar
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{margin: '20px'}}
                        disabled={invoiceData.Consecutive !== ''}
                        onClick={()=>{SendNewPurchase()}}
                    >
                        Guardar
                    </button>
                </div>
            </div>
            <div 
                onClick={() => setFocusFlatlist(true)}
                onBlur={() => setFocusFlatlist(false)}
                style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '60vh',           // Ocupa toda la altura de la ventana
                width: '100%'
            }}>
                <Flatlist
                    data={list}
                    headers={purchaseHeader}
                    row={RowOrder}
                    Width={'98%'}
                    Height={'100%'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
            <div style={{display: 'flex', width: '95%', }}>
                <div>
                    <button
                        className='btnStnd btn1'
                        disabled={invoiceData.Consecutive === ''}
                        onClick={()=>{}}
                    >
                        Modificar
                    </button>
                </div>
                <div style={{width: '20%', marginLeft: 'auto'}}>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label><strong>Total:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <label>$ {priceValue((total).toFixed(2))}</label>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label><strong>Total Iva:</strong></label>
                        </div>
                        <div className='_column2Customer'>
                            <label>$ {priceValue((totalIva).toFixed(2))}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}