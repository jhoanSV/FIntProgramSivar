import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { TheAlert } from '../../Components';
import {
    StatusListApi,
    WorkerListApi,
    onTheRouteApi
} from '../../api';
import {
    priceValue,
    dateFormat,
    toRealExcel
} from '../../InternalFunctions';
import "./_Status.scss";

export function Status(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [list, setList] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [delibery, setDelibery] = useState([]);
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
        { label: "N° de pedido", key: "NDePedido" },
        { label: "Código", key: "CodCliente" },
        { label: "Cliente", key: "Cliente" },
        { label: "Fecha", key: "FechaFactura" },
        { label: "Tipo de pago", key: "TipoDePago" },
        { label: "Estado", key: "Estado" },
        { label: "Fecha de estado", key: "FechaDeEstado" },
        { label: "Fecha de entrega", key: "FechaDeEntrega" },
        { label: "Proceso del pedido", key: "ProcesoDelPedido" },
        { label: "Repartidor", key: "Repartidor" }
    ];
    const refList = useRef([])
    const GetStatus = async()=>{
        const StatusL = await StatusListApi()
        setList(StatusL);
        refList.current = StatusL
    };

    const getWorkers = async()=>{
        const workerL = await WorkerListApi()
        setWorkers(workerL)
        const deL = workerL.filter((item)=>{
            return item.Cargo === 'Entregas'
        })
        console.log(deL)
        setDelibery(deL)
    };

    const AssignDeliveryPerson = async(NPedido, CodDeliveryP)=>{
        const DeliveryP = delibery.find(p => p.Cod == CodDeliveryP)?.Nombre || '';
        const absoluteIndex = refList.current.findIndex((item)=> item.NDePedido === NPedido);
        const relativeIndex = list.findIndex((item)=> item.NDePedido === NPedido);
        const NewAbsoluteList = [...refList.current]
        const NewRelativeList = [...list]
        //To the absolute List change

        NewAbsoluteList[absoluteIndex].NombreRepartidor = DeliveryP
        NewAbsoluteList[absoluteIndex].Repartidor = CodDeliveryP
        NewAbsoluteList[absoluteIndex].ProcesoDelPedido = "En ruta"

        NewRelativeList[relativeIndex].NombreRepartidor = DeliveryP
        NewRelativeList[relativeIndex].Repartidor = CodDeliveryP
        NewAbsoluteList[absoluteIndex].ProcesoDelPedido = "En ruta"
        refList.current = NewAbsoluteList
        setList(NewRelativeList)
        const UDelivery = await onTheRouteApi({
            'CodDelivery': CodDeliveryP,
            'NDePedido': NPedido
        })
        if (UDelivery.sucess === false) {
            TheAlert('Se presento un error al poner el pedido en ruta')
        }
    };

    const handleDateData = (item, value) => {
        setDateSearch((prev) => ({
            ...prev,
            [item]: value,
        }));
    };

    const filterStatus = (text) => {
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

    useEffect(() => {
        GetStatus()
        getWorkers()
    }, [])
    
    const StatusHeader = [
        {
            header: 'N° pedido',
            key: 'npedido',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'cod',
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
            header: 'Fecha',
            key: 'fecha',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Valor',
            key: 'valor',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Tipo de pago',
            key: 'tipodepago',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Estado',
            key: 'estado',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Valor final',
            key: 'Valor final',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha de estado',
            key: 'fechadeestado',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Fecha de entrega',
            key: 'fechadeentrega',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Proceso del pedido',
            key: 'proceso del pedido',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Repartidor',
            key: 'repartidor',
            defaultWidth: '10%',
            type: 'text',
        }
    ];
    
    const updelivery = async(CodDelivery, NDePedido) =>{
        
    }

    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return null;
        const deliveryPerson = item.NombreRepartidor
        function colorsState(Estado){
            let color = ''
            if (Estado === 'Cerrado'){
                color = 'green'
            } else if (Estado === 'Anulado'){
                color = 'White'
            } else if (Estado === 'Verificado'){
                color = 'Orange'
            } else if (Estado === 'Ingresado'){
                color = 'yellow'
            } else if (Estado === 'Alistado'){
                color = 'yellow'
            }
            return color
        }

        function colorsProcess(Process){
            let color = ''
            if (Process === 'Entregado'){
                color = '#4DBE25'
            } else if (Process === 'En ruta'){
                color = '#FABD1F'
            } else if (Process === 'No entregado'){
                color = '#DA4404'
            }
            return color
        }
        return (
            <>
                <td onDoubleClick={()=>{}}>
                    {item.NDePedido}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.CodCliente}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.Cliente}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaFactura)}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.Valor)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {item.TipoDePago}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: colorsState(item.Estado)}}>
                    {item.Estado}
                </td>
                <td onDoubleClick={()=>{}}>
                    $ {priceValue(item.ValorFinal)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaDeEstado)}
                </td>
                <td onDoubleClick={()=>{}}>
                    {dateFormat(item.FechaDeEntrega)}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: colorsProcess(item.ProcesoDelPedido)}}>
                    {item.ProcesoDelPedido}
                </td>
                <td onDoubleClick={()=>{}}>
                    <select
                        value={deliveryPerson}
                        onChange={(e) => {const nombreSeleccionado = e.target.value;
                        const repartidor = delibery.find(d => d.Nombre === nombreSeleccionado);
                        if (repartidor) {
                            AssignDeliveryPerson(item.NDePedido, repartidor.Cod);
                        }
                        }}
                    >
                        <option value="" disabled={true}>-Repartidor-</option>
                        {delibery.map(d => (
                        <option key={d.Cod} value={d.Nombre}>
                            {d.Nombre}
                        </option>
                        ))}
                    </select>
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
                        setList(refList.current)
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
                            onChange={(e)=>filterStatus(e.target.value)}
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
                    disabled={list.length === 0}
                    style={{backgroundColor: 'green'}}
                    onClick={()=>{toRealExcel(list)}}
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
                data={list}
                headers={StatusHeader}
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