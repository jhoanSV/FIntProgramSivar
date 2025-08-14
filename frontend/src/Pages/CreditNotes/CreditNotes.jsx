import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { TheAlert } from '../../Components';
import { getCreditNotesApi } from '../../api';
import { priceValue, dateFormat, toRealExcel } from '../../InternalFunctions';
import { PPurchases } from '../../Components/Modals'
import "./_CreditNotes.scss";

export function CreditNotes(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [list, setList] = useState([]);
    const [showData, setShowData] = useState(false);
    const [filter, setFilter] = useState('');
    const refList = useRef([]);
    const [dateSearch, setDateSearch] = useState({
        "FInicio": "", 
        "Ffinal": ""
    });
    const opcionesFiltro = [
        { label: "N° de pedido", key: "N_Pedido"},
        { label: "Ferreteria", key: "Ferreteria"},
        { label: "Consecutivo DIAN", key: "ConDian"},
        { label: "Factura electrónica", key: "FElectronica"},
        { label: "Fecha interna", key: "FechaInterna"},
        { label: "Fecha DIAN", key: "FechaDian"}
    ];

    const getCreditN = async()=>{
        const CreditN = await getCreditNotesApi()
        setList(CreditN);
        refList.current = CreditN
    };

    useEffect(() => {
        getCreditN()
    }, []);
    
    

    const handleDateData = (item, value) => {
        setDateSearch((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return 
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.Consecutivo}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.N_Pedido}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Ferreteria}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaInterna)}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.Total)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Motivo}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.ConDian}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaDian)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.FElectronica}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.ConsecutivoEn}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.PrefDian}
                </td>
            </>
        );
    };

    const CreditNotesHeader = [
        {
            header: 'Consecutivo',
            key: 'consecutivo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'N° de pedido',
            key: 'ndepedido',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Ferreteria',
            key: 'ferreteria',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha interna',
            key: 'fechainterna',
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
            header: 'Motivo',
            key: 'motivo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Con DIAN',
            key: 'condian',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha DIAN',
            key: 'fechadian',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'F. Electronica',
            key: 'felectronica',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Con Entrada',
            key: 'saldo',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Pref DIAN',
            key: 'prefdian',
            defaultWidth: '10%',
            type: 'text',
        },

    ];

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

    return (
        <div>
            <div 
                style={{
                    display: 'flex',
                    marginLeft: '15px',
                    marginTop: '5px',
                    marginBottom: '5px',
                    alignItems: 'center',    // Centra horizontalmente
                    //justifyContent: 'center', // Centra verticalmente
                    gap: '10px'
                }}>
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
                    <div 
                        style={{
                            width: '40%'
                        }}>
                        <input
                            type="text"
                            className=""
                            style={{width: '100%'}}
                            value={searchText}
                            onChange={(e)=>filterPurchase(e.target.value)}
                        />
                    </div>
                }
                { showData && 
                    <div>
                        <label>Fecha inicial:</label>
                        <input
                            type="date"
                            className=""
                            value={dateSearch.FInicio}
                            onChange={(e)=>{handleDateData("FInicio", e.target.value)}}
                        />
                        <label>Fecha final:</label>
                        <input
                            type="date"
                            className=""
                            value={dateSearch.Ffinal}
                            onChange={(e)=>{handleDateData("Ffinal", e.target.value)}}
                        />
                    </div>
                }
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
                headers={CreditNotesHeader}
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