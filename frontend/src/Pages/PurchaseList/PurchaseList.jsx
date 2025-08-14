import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { TheAlert } from '../../Components';
import {
    getPurchaselistApi,
    PPPurchaseApi,
    getSpecificPurchaseApi
} from '../../api';
import {
    priceValue,
    dateFormat,
    toRealExcel,
    formatDateForInput } from '../../InternalFunctions';
import { PPurchases } from '../../Components/Modals';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';
import "./_PurchaseList.scss";

export function PurchaseList(){
    const [selectedfila, setSelectedfila] = useState(0);
    const navigate = useNavigate(); // dentro del componente
    const { usD, purchaseData, setPurchaseData } = useTheContext();
    const [searchText, setSearchText] = useState('');
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState({
            "ValueText":'Consecutivo',
            "filterV": 'Consecutivo'});
    const [showData, setShowData]= useState(false);
    const [dateSearch, setDateSearch] = useState({
        "FInicio": "", 
        "Ffinal": ""
    });
    const [showPP, setShowPP] = useState(false);
    const [ppData, setPpData] = useState({
        "Consecutivo": '',
        "FechaFactura": '',
        "CodProveedor": '',
        "Proveedor": '',
        "FechaDeVencimiento": '',
        "Total": ''
    })
    const [total, setTotal] = useState(0)
    const [saldos,setSaldos] = useState('Mixto')
    const opcionesFiltro = [
        { label: "Consecutivo", key: "Consecutivo" },
        { label: "Fecha", key: "Fecha" },
        { label: "Fecha factura", key: "FechaFactura" },
        { label: "Cod proveedor", key: "CodProveedor" },
        { label: "Proveedor", key: "Proovedor" },
        { label: "Contado o crédito", key: "ContadoCredito" },
        { label: "Fecha de vencimiento", key: "FechaVencimiento" }
    ];
    const refList = useRef([]);
    const refAllData = useRef([]);
    const purChList = useRef([]);

    const handleDateData = (item, value) => {
        setDateSearch((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const getList = async() => {
        const purchL = await getPurchaselistApi();
        purChList.current = purchL
        const abonosList = await PPPurchaseApi(); // lista con saldos
        createtable(purchL, abonosList)
    };

    const createtable = async (purchL, abonosList) => {
        // Indexar saldos por Consecutivo para acceso rápido
        const abonosMap = new Map();
        abonosList.forEach(item => {
            abonosMap.set(item.Consecutivo, item.Saldo);
        });

        // Fusionar listas y calcular campo pendiente
        const mergedList = purchL.map(item => {
            const saldo = abonosMap.get(item.Consecutivo) ?? 0;
            const total = parseFloat(item.Total) || 0;
            const pendiente = total - saldo;

            return {
                ...item,
                Saldo: pendiente
            };
        });

        setList(mergedList);
        refList.current = mergedList;
        refAllData.current = mergedList;
    };

    useEffect(() => {
      getList()
    }, []);
    
    const filterPurchase = (text) => {
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

    const PurchaseListHeader = [
        {
            header: 'Consecutivo',
            key: 'consecutivo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha',
            key: 'fecha',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha factura',
            key: 'fecha factura',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Cod Prov',
            key: 'codprv',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'proveedor',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Contado/Crédito',
            key: 'contadocredito',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha vencimiento',
            key: 'fechavencimiento',
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
            header: 'Saldo',
            key: 'saldo',
            defaultWidth: '10%',
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        const doAPP = () =>{
            setPpData(
                {
                    "Consecutivo": item.Consecutivo,
                    "FechaFactura": dateFormat(item.FechaFactura),
                    "CodProveedor": item.CodProveedor,
                    "Proveedor": item.Proovedor,
                    "FechaDeVencimiento": dateFormat(item.FechaVencimiento),
                    "Total": item.Total
                }
            );
            setShowPP(true)
        }
        return (
            <>
                <td onDoubleClick={()=>{doAPP()}}>
                    {item.Consecutivo}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {dateFormat(item.Fecha)}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {dateFormat(item.FechaFactura)}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {item.CodProveedor}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {item.Proovedor}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {item.ContadoCredito}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    {dateFormat(item.FechaVencimiento)}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    $ {priceValue(item.Total)}
                </td>
                <td onDoubleClick={()=>{doAPP()}}>
                    $ {priceValue(item.Saldo)}
                </td>
            </>
        );
    };

    const TotalSum = () => {
        let countTotal = 0;
        list.forEach((item) => {
            const saldo = item.Saldo;
            countTotal += saldo
        });
        setTotal(countTotal);
    };

    useEffect(() => {
        TotalSum()
    }, [list])

    const updateBalance = async() => {
        const abonosList = await PPPurchaseApi(); // lista con saldos
        createtable(purChList.current, abonosList)
    }

    const sendToUpdatePurchase = async()=>{
        const getThisPurchase = await getSpecificPurchaseApi({Consecutivo : list[selectedfila].Consecutivo})
        getThisPurchase.push({
                    'Cantidad': '',
                    'Codigo': '',
                    'Descripcion': '',
                    'Costo': 0,
                    'Iva': 0,
                    'UIva': 0,
                    'Total': 0,
                    'CostoLP': 0
                })
        const data = {
            headerData: {
                'Nfactura': list[selectedfila].NFactura,
                'Date': list[selectedfila].Fecha,
                'InvoiceDate': formatDateForInput(new Date(list[selectedfila].FechaFactura)),
                'ExpirationDate': formatDateForInput(new Date(list[selectedfila].FechaVencimiento)),
                'CodSupplier': list[selectedfila].CodProveedor,
                'Supplier': list[selectedfila].Proovedor,
                'SupplierPhone': list[selectedfila].Telefono,
                'SupplierAddress': list[selectedfila].Direccion,
                'ResponsibleCode': list[selectedfila].CodResponsable,
                'Responsible': list[selectedfila].Responsable,
                'CreditDays': list[selectedfila].Dias,
                'Iva': list[selectedfila].Iva === 0? false: true,
                'Retefuente': list[selectedfila].RTF,
                'Consecutive': list[selectedfila].Consecutivo,
                'ContadoOCredito': list[selectedfila].ContadoCredito
            },
            PurchaseList: getThisPurchase
        }
        console.log('data: ', data)
        setPurchaseData(data);
        navigate('/NewPurchase');
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    margin: '5px',
                    alignItems: 'center',    // Centra horizontalmente
                    //justifyContent: 'center', // Centra verticalmente
                    gap: '5px'
                }}>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{sendToUpdatePurchase()}}
                >
                    Modificar compra
                </button>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{}}
                >
                    Abonar a compra
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
                        setShowData(selected.key === 'Fecha' || selected.key === 'FechaFactura' || selected.key === 'FechaVencimiento');
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
                            onChange={(e)=>filterPurchase(e.target.value)}
                        />
                    </div>
                }
                { showData && 
                    <div>
                        <label><strong>Fecha inicial:</strong></label>
                        <input
                            type="date"
                            className=""
                            value={dateSearch.FInicio}
                            style={{marginLeft: '5px', marginRight: '5px'}}
                            onChange={(e)=>{
                                handleDateData("FInicio", e.target.value)
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
                                handleDateData("Ffinal", e.target.value)
                                filterByData(dateSearch.FInicio, e.target.value)
                            }}
                        />
                    </div>
                }
                <select
                    id="mi-select"
                    value={saldos}
                    onChange={(e) => {
                        setSaldos(e.target.value)
                        const newTable = refAllData.current
                        if (e.target.value === 'ConSaldo') {
                            const New = newTable.filter((item)=>{
                                return item.Saldo > 0
                            })
                            setList(New)
                            refList.current = New
                        } else if (e.target.value === 'SinSaldo') {
                            const New = newTable.filter((item)=>{
                                return item.Saldo === 0
                            })
                            setList(New)
                            refList.current = New
                        } else {
                            setList(refAllData.current)
                            refList.current = refAllData.current
                        }
                    }}
                    style={{width: '10%'}}
                >
                    <option value="Mixto" >Mixto</option>
                    <option value="ConSaldo" >Con saldo</option>
                    <option value="SinSaldo" >Sin saldo</option>
                </select>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '80vh',           // Ocupa toda la altura de la ventana
                width: '100%'
            }}>
            <Flatlist
                data={list}
                headers={PurchaseListHeader}
                row={RowOrder}
                Height={'100%'}
                Width={'98%'}
                selectedRow={selectedfila}
                setSelectedRow={setSelectedfila}
                rowStyles='alternative'
            />
            </div>
            <div style={{width: '20%', marginLeft: 'auto'}}>
                <div className='Row' style={{marginBottom: '3px'}}>
                    <div className='_column1Customer'>
                        <label><strong>Saldo total:</strong></label>
                    </div>
                    <div className='_column2Customer'>
                        <label>$ {priceValue((total).toFixed(2))}</label>
                    </div>
                </div>
            </div>
            {showPP && 
                <PPurchases
                    show={setShowPP}
                    PpData={ppData}
                    Action={updateBalance}
                    type={'Compras'}
                />
            }
        </div>
    )
}