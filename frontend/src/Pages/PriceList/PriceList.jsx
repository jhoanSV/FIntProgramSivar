import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { GetProductListApi, quiantityProductListApi } from '../../api';
import { TheAlert } from '../../Components';
import { ListBox } from '../../Components/ListBox';
import "./_PriceList.scss";
import { useTheContext } from '../../TheProvider';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

export function PriceList(){
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('Cod');
    const [selectedfila, setSelectedfila] = useState(0);
    const refList = useRef([]);
    const [lista, setLista] = useState([]);

    useEffect(() => {
      const getProductL = async()=>{
        const quantityL = await quiantityProductListApi()
        refList.current = quantityL
        setLista(quantityL)
      }
      getProductL()
    }, [])

    useEffect(() => {
        setLista(refList.current)
    }, [filter])
    
    const ProductHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '20%',
            type: 'text',
        },
        {
            header: 'U/P',
            key: 'unidad/paquete',
            defaultWidth: '5%',
            type: 'text',
        },
        {
            header: 'Sub Categoria',
            key: 'subcategoria',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'Proveedor',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'P Costo',
            key: 'P Costo',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'P Venta',
            key: 'pventa',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: '% Ganancia',
            key: 'ganancia',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Ubicación',
            key: 'ubicacion',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Minimo',
            key: 'minimo',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Maximo',
            key: 'maximo',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Iva',
            key: 'iva',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Agotado',
            key: 'agotado',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Nota',
            key: 'nota',
            defaultWidth: 100,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        let porcent = ((item.PventaContado-item.PCosto) /item.PCosto * 100).toFixed(2)
        const color = item.Agotado === 1? 'orange' : ''
        return (
            <>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Cod}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Descripcion}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.EsUnidadOpaquete}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.SubCategoria}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.proveedor}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.PCosto}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.PventaContado}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {porcent + '%'}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Ubicación}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: item.Agotado === 1? 'orange' : (item.Cantidad < item.Minimo ? 'red': '')}}>
                    {item.Cantidad}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Minimo}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Maximo}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Iva}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Agotado === 1? 'Agotado': ''}
                </td>
                <td onDoubleClick={()=>{}} style={{backgroundColor: color}}>
                    {item.Nota}
                </td>
            </>
        );
    };

    const filterProduct = (text) => {
        const proData = refList.current;
        setSearchText(text);

        if (text === '' || text.length < 2) {
            setLista(proData);
            return [];
        }

        const lowerText = text.toLowerCase();

        try {
            let TFiltro1;

            if (filter !== 'Agotado' && filter !== 'bajoInventario') {
                TFiltro1 = proData.filter(item =>
                    String(item[filter]).toLowerCase().includes(lowerText)
                );
            } else if (filter === 'Agotado') {
                TFiltro1 = proData.filter((item) =>
                    item.Agotado === 1 &&
                    (
                        String(item.Cod).toLowerCase().includes(lowerText) ||
                        String(item.Descripcion).toLowerCase().includes(lowerText)
                    )
                );
            } else if (filter === 'bajoInventario'){
                TFiltro1 = proData.filter((item) =>
                    item.Cantidad < item.Minimo &&
                    (
                        String(item.Cod).toLowerCase().includes(lowerText) ||
                        String(item.Descripcion).toLowerCase().includes(lowerText)
                    )
                );
            }

            setLista(TFiltro1);
            return TFiltro1;

        } catch (error) {
            console.log('error-->', error);
            setLista([]);
        }
    };
    
    return (
        <>
            <div style={{display: 'flex'}}>
                <label>Buscar por:</label>
                <div>
                    <select
                        id="mi-select"
                        value={filter}
                        onChange={(e) => {setFilter(e.target.value); filterProduct(searchText)}}
                        style={{width: '90%'}}
                    >
                        <option key={'Cod'} value={'Cod'}>Cod</option>
                        <option key={'Descripcion'} value={'Descripcion'}>Descripción</option>
                        <option key={'proveedor'} value={'proveedor'}>Proveedor</option>
                        <option key={'bajoInventario'} value={'bajoInventario'}>Bajo de inventario</option>
                        <option key={'Agotado'} value={'Agotado'}>Agotado</option>
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        className=""
                        value={searchText}
                        onChange={(e)=>{filterProduct(e.target.value)}}
                    />
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '85vh',           // Ocupa toda la altura de la ventana
                width: '98%'
            }}>
                <Flatlist
                    data={lista}
                    headers={ProductHeader}
                    row={RowOrder}
                    Height={'100%'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>
        </>
    )
}