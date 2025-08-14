import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { TheAlert } from '../../Components';
import { getEntrantsListApi } from '../../api';
import { priceValue, dateFormat, toRealExcel } from '../../InternalFunctions';
import "./_ListOfEntrants.scss";
export function ListOfEntrants(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState({
        "ValueText":'Consecutivo',
        "filterV": 'Consecutivo'});
    const [lista, setLista] = useState([]);
    const [showData, setShowData]= useState(false);
    const [dateSearch, setDateSearch] = useState({
        "FInicio": "", 
        "Ffinal": ""
    });
    const opcionesFiltro = [
        { label: "Consecutivo", key: "Consecutivo" },
        { label: "Cod producto", key: "Cod" },
        { label: "Producto", key: "Descripcion" },
        { label: "Cod proveedor", key: "CodProveedor" },
        { label: "Proveedor", key: "Proveedor" },
        { label: "Fecha", key: "Fecha" },
        { label: "Fecha factura", key: "FechaFactura" },
        { label: "N° factura", key: "NFactura" },
    ];
    const refList = useRef([]);
    const getList = async()=>{
        const EntransL = await getEntrantsListApi()
        setLista(EntransL)
        refList.current = EntransL
        const today = new Date();
        const formatDate = today.toISOString().split('T')[0]; // "2025-06-21"

        setDateSearch({
            FInicio: '',
            Ffinal: ''
        });
    };

    useEffect(() => {
        getList()
    }, []);

    const handleDateData = (item, value) => {
        setDateSearch((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const filterDate = () => {
        if (dateSearch.FInicio === '' || dateSearch.Ffinal === '') {
            return refList.current;
        }

        const startDate = new Date(dateSearch.FInicio);
        const endDate = new Date(dateSearch.Ffinal);
        endDate.setHours(23, 59, 59, 999); // Para incluir todo el día

        const filtrados = refList.current.filter(item => {
            const rawFecha = item[filter.filterV]; // Asegúrate de que filterV esté bien seteado
            if (!rawFecha) return false; // Ignora si no tiene fecha

            const fechaItem = new Date(rawFecha);
            return fechaItem >= startDate && fechaItem <= endDate;
        });

        return filtrados;
    };

    useEffect(() => {
        const datosFiltrados = filterDate();
        setLista(datosFiltrados);
    }, [dateSearch]);

    const filterProduct = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let proData = refList.current//The whole table "products".
        //let aliasData = refAliasList.current//The whole table "alias".
        try {
            setSearchText(text)
            if (text === '' || text.length < 2) {
                setLista(proData);
                return []
            }else{
                console.log(filter.filterV)
                // Define a case-insensitive text filter function
                const filterByText = (item) =>
                String(item[filter.filterV]).toLowerCase().includes(text.toLowerCase());
                // Filter products based on the text
                const TFiltro1 = proData.filter(filterByText);
                setLista(TFiltro1)
                //setFilteredProducts(sortedJson);
                return TFiltro1;
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setLista([])
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

                setLista(TFiltro1);
                return TFiltro1;
            } catch (error) {
                console.log('error-->' + error);
                setLista([]);
            }
        }
    };
    
    const EntrantsHeader = [
        {
            header: 'Consecutivo',
            key: 'consecutivo',
            defaultWidth: '10%',
            type: 'text',
        },
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
            key: 'descripción',
            defaultWidth: '20%',
            type: 'text',
        },
        {
            header: 'Vr Univario',
            key: 'vrunitario',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Cod Proveedor',
            key: 'codproveedor',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'proveedor',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Fecha',
            key: 'fecha',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Fecha Factura',
            key: 'fechafactura',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'N° Factura',
            key: 'nfactura',
            defaultWidth: 100,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.Consecutivo}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cantidad}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cod}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Descripcion}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.VrUnitario)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.CodProveedor}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Proveedor}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.Fecha)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaFactura)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.NFactura}
                </td>
            </>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', margin: '5px', gap: '5px', width:'98%'}}>
                <label><strong>Filtrar por: </strong></label>
                <select
                    value={filter.ValueText}
                    onChange={(e) => {
                        const selected = opcionesFiltro.find(o => o.label === e.target.value);
                        setLista(refList.current)
                        setFilter({
                            ValueText: selected.label,
                            filterV: selected.key
                        });
                        setShowData(selected.key === 'Fecha' || selected.key === 'FechaFactura');
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
                            onChange={(e)=>filterProduct(e.target.value)}
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
                <button
                    className='btnStnd btn1'
                    disabled={lista.length === 0}
                    style={{backgroundColor: 'green'}}
                    onClick={()=>{toRealExcel(lista)}}
                >
                    Exportar a excel
                </button>
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
                    data={lista}
                    headers={EntrantsHeader}
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