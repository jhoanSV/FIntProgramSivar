import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Flatlist, TheAlert } from '../../Components';
import { getPendingListApi } from '../../api';
import "./_PendingList.scss"
import { priceValue, dateFormat, toRealExcel, formatDateForInput } from '../../InternalFunctions';
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';

export function PendingList(){
    const [searchText, setSearchText] = useState('');
    const [selectedfila, setSelectedfila] = useState(0);
    const [list, setList] = useState([]);
    const [showData, setShowData] = useState(false);
    const [dateSearch, setDateSearch] = useState({
        "FInicio": "", 
        "Ffinal": ""
    });
    const [filter, setFilter] = useState({
        "ValueText":'Código',
        "filterV": 'Codigo'
    });
    const opcionesFiltro = [
        { label: "Código", key: "Codigo" },
        { label: "Descripción", key: "Descripcion" },
        { label: "Costo", key: "PCosto" },
        { label: "Ferreteria", key: "Ferreteria" },
        { label: "Proveedor", key: "Proovedor" },
        { label: "Fecha de entrega", key: "FechaDeEntrega" }
    ];
    const { usD, setPurchaseData } = useTheContext();
    const refList = useRef([]);

    const navigate = useNavigate(); // dentro del componente
    
    const getList = async() =>{
        const PendList = await getPendingListApi()
        PendList.map((item) => {
            item.aCompras = false
        })
        setList(PendList)
        refList.current = PendList;
    };

    useEffect(() => {
        getList()
    }, []);

    const filterPending = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let proData = refList.current//The whole table "products".
        //let aliasData = refAliasList.current//The whole table "alias".
        try {
            setSearchText(text)
            if (text === '' || text.length < 2) {
                setList(proData);
                return []
            }else{
                // Define a case-insensitive text filter function
                const filterByText = (item) =>
                String(item[filter.filterV]).toLowerCase().includes(text.toLowerCase());
                // Filter products based on the text
                const TFiltro1 = proData.filter(filterByText);
                setList(TFiltro1)
                //setFilteredProducts(sortedJson);
                return TFiltro1;
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setList([])
        }
    }

    const handleData = (index, key, value) => {
        setList((prevList) => {
            const newList = prevList.map((supplier, i) =>
                i === index ? { ...supplier, [key]: value } : supplier
            );
            return newList
        })
    };

    const handleDateData = (item, value) => {
        setDateSearch((prev) => ({
            ...prev,
            [item]: value,
        }));
    };
    
    const pendingListHeader = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Codigo',
            key: 'codigo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '40%',
            type: 'text',
        },
        {
            header: 'Costo',
            key: 'costo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Ferreteria',
            key: 'ferreteria',
            defaultWidth: '30%',
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'proveedor',
            defaultWidth: '30%',
            type: 'text',
        },
        {
            header: 'Fecha de entrega',
            key: 'fechadeentrega',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'A Compras',
            key: 'acompras',
            defaultWidth: '10%',
            type: 'text',
        }
        
    ];

    const toSendPurchase = () =>{
        
        const sendLsit = list.filter((item)=>{
            return item.aCompras === true
        })
        if (sendLsit.length !== 0) {
            let NewList = []
            sendLsit.map((item)=>{
                NewList.push({
                    'Cantidad': item.cantidad,
                    'Codigo': item.Codigo,
                    'Descripcion': item.Descripcion,
                    'Costo': item.PCosto,
                    'Iva': 0,
                    'UIva': item.PCosto,
                    'Total': (item.cantidad * item.PCosto).toFixed(2),
                    'CostoLP': item.PCosto
                })
            })
            NewList.push({
                        'Cantidad': '',
                        'Codigo': '',
                        'Descripcion': '',
                        'Costo': '',
                        'Iva': '',
                        'UIva': '',
                        'Total': '',
                        'CostoLP': ''
                    })
            const DataCenter = {
                headerData: {
                    'Nfactura': '',
                    'Date': dateFormat(new Date()),
                    'InvoiceDate': formatDateForInput(new Date()),
                    'ExpirationDate': formatDateForInput(new Date()),
                    'CodSupplier': sendLsit[0].CodPro,
                    'Supplier': sendLsit[0].Proovedor,
                    'SupplierPhone': sendLsit[0].Telefono,
                    'SupplierAddress': sendLsit[0].Direccion,
                    'ResponsibleCode': usD.Cod,
                    'Responsible': usD.Nombre + ' ' + usD.Apellido,
                    'CreditDays': 0,
                    'Iva': false,
                    'Retefuente': '',
                    'Consecutive': '',
                    'ContadoOCredito': 'Contado'
                },
                PurchaseList: NewList
                };
            setPurchaseData(DataCenter)
            navigate('/NewPurchase');
        } else {
            TheAlert('No hay productos seleccionados para la compra.')
        }
    };

    const filterByData = (FInicio, Ffinal) => {
        if (FInicio !== '' && Ffinal !== '') {
            const proData = refList.current;
            const inicio = new Date(FInicio);
            const final = new Date(Ffinal);

            try {
                const TFiltro1 = proData.filter((item) => {
                    const fechaItem = new Date(item[filter.filterV]);
                    return (
                        !isNaN(fechaItem) &&
                        fechaItem >= inicio &&
                        fechaItem <= final
                    );
                });

                setList(TFiltro1);
                return TFiltro1;
            } catch (error) {
                console.log('error-->' + error);
                setList([]);
            }
        }
    };

    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return
        const BackColor = item.aCompras ? 'yellow': ''
        const textColor = item.aCompras ? 'black': ''
        return (
        <>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {item.cantidad}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {item.Codigo}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {item.Descripcion}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    $ {priceValue(item.PCosto)}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {item.Ferreteria}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {item.Proovedor}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <label>
                    {dateFormat(item.FechaDeEntrega)}
                </label>
            </td>
            <td onDoubleClick={()=>{}} style={{ backgroundColor: BackColor, color: textColor }}>
                <input
                    type='checkbox'
                    checked={item.aCompras}
                    onChange={(e)=>{handleData(index,'aCompras', e.target.checked)}}
                    >
                </input>
            </td>
        </>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', margin: '5px', gap: '5px'}}>
                <button
                    className='btnStnd btn1'
                    style={{marginLeft: '20px'}}
                    onClick={()=>{toRealExcel(list)}}
                >
                    Exportar a excel
                </button>
                <button
                    className='btnStnd btn1'
                    style={{marginLeft: '20px'}}
                    onClick={()=>{toSendPurchase()}}
                >
                    Enviar a compras
                </button>
                <label><strong>Filtrar por:</strong></label>
                <select
                    value={filter.ValueText}
                    onChange={(e) => {
                        const selected = opcionesFiltro.find(o => o.label === e.target.value);
                        setList(refList.current)
                        setFilter({
                            ValueText: selected.label,
                            filterV: selected.key
                        });
                        setShowData(selected.key === 'FechaDeEntrega');
                    }}
                    style={{ width: '20%' }}
                    >
                    {opcionesFiltro.map((op, idx) => (
                        <option key={idx} value={op.label}>{op.label}</option>
                    ))}
                </select>
                { !showData && 
                    <div>
                        <input
                            type="text"
                            className=""
                            value={searchText}
                            onChange={(e)=>filterPending(e.target.value)}
                        />
                    </div>
                }
                { showData && 
                    <div style={{gap: '5px'}}>
                        <label><strong>Fecha inicial:</strong></label>
                        <input
                            type="date"
                            className=""
                            value={dateSearch.FInicio}
                            style={{marginLeft: '5px', marginRight: '5px'}}
                            onChange={(e)=>{
                                handleDateData("FInicio", e.target.value);
                                filterByData(e.target.value, dateSearch.Ffinal)
                            }}
                        />
                        <label><strong>Fecha final:</strong></label>
                        <input
                            type="date"
                            className=""
                            value={dateSearch.Ffinal}
                            style={{marginLeft: '5px', marginRight: '5px'}}
                            onChange={(e)=>{
                                handleDateData("Ffinal", e.target.value);
                                filterByData(dateSearch.FInicio, e.target.value)
                            }}
                        />
                    </div>
                }
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '80vh',
                width: '100%'           // Ocupa toda la altura de la ventana
            }}>
                <Flatlist
                    data={list}
                    headers={pendingListHeader}
                    row={RowOrder}
                    Height={'100%'}
                    Width={'98%'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
        </div>   
    )
}