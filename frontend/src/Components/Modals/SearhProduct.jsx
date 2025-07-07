import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Flatlist } from '..';
import { otherSupplierApi,
        quiantityAndDisponibleApi
 } from '../../api';
import "./_SearhProduct.scss";
import "./_GeneralModal.scss"

export function SearhProduct( {list, ProductSelectedFunction, show, setOtherSupplier, setImgName} ){
    const [searchText, setSearchText] = useState('');
    const [selectedfila, setSelectedfila] = useState(0);
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    const [lista, setLista] = useState(list);

    const productHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripción',
            defaultWidth: 400,
            type: 'text',
        },
        {
            header: 'Sub categoria',
            key: 'subcategoria',
            defaultWidth: 150,
            type: 'text',
        },
        {
            header: 'Nota',
            key: 'cantidad',
            defaultWidth: 200,
            type: 'text',
        }
    ];
    const RowOrder = (item, index, columnsWidth) => {
        const handleProductSelect = async (item) => {
            try {
                const quantityData = (await quiantityAndDisponibleApi({ Cod: item.Cod }))[0];
                const oSupplier = await otherSupplierApi({ Cod: item.Cod });

                const newList = oSupplier.map((sup) => ({
                    ...sup,
                    Porcentaje:
                        sup.PCosto !== 0
                        ? ((item.PventaContado - sup.PCosto) / sup.PCosto * 100).toFixed(2)
                        : 0,
                }));
                newList.push({
                    Cod: '',
                    CodP: '',
                    Proveedor: '',
                    PCosto: '',
                    Cantidad: '',
                    Porcentaje: ''
                });
                setOtherSupplier(newList);
                setImgName(`https://sivarwebresources.s3.amazonaws.com/AVIF/${item.ImgName}.avif?v=${Date.now()}`);

                const proData = {
                Consecutivo: item.Consecutivo,
                Cod: item.Cod,
                Descripcion: item.descripcion,
                EsunidadOpaquete: item.EsUnidadOpaquete,
                Categoria: item.Categoria,
                IdCategoria: item.IDCategoria,
                SubCategoria: item.SubCategoria,
                IdSubCategoria: item.IdSubCategoria,
                Proveedor: item.proveedor,
                CodProveedor: item.CodProovedor,
                PCosto: item.PCosto,
                PventaContado: item.PventaContado,
                PorcenPVentaContado:
                    item.PCosto !== 0
                    ? ((item.PventaContado - item.PCosto) / item.PCosto * 100).toFixed(2)
                    : 0,
                PVentaCredito: item.PVentaCredito,
                PorcenPVentaCredito:
                    item.PCosto !== 0
                    ? ((item.PVentaCredito - item.PCosto) / item.PCosto * 100).toFixed(2)
                    : 0,
                PVentaDistribuidor: item.PVentaDistribuidor,
                PorcenPVentaDistribuidor:
                    item.PCosto !== 0
                    ? ((item.PVentaDistribuidor - item.PCosto) / item.PCosto * 100).toFixed(2)
                    : 0,
                Ubicacion: item.Ubicación,
                Cantidad: quantityData?.Cantidad ?? 0,
                Minimo: item.Minimo,
                Maximo: item.Maximo,
                Iva: item.Iva,
                Agotado: item.Agotado === 0 ? false : true,
                Disponible: quantityData?.Disponible ?? 0,
                SVenta: item.SVenta === 0 ? false : true,
                Clase: '',
                ImgNombre: item.ImgName,
                Pagina: item.Pagina,
                CoordenadaX: item.CoordenadaX,
                CoordenadaY: item.CoordenadaY,
                Nota: item.Nota,
                Detalle: item.Detalle,
                Grupo: '',
                };
                ProductSelectedFunction(proData);
                show(false)
            } catch (error) {
                console.error('Error al seleccionar producto:', error);
            }
        };
        return (
        <>
            <td onDoubleClick={()=>{
                handleProductSelect(item)
            }}>
                <label>
                    {item.Cod}
                </label>
            </td>
            <td onDoubleClick={()=>{handleProductSelect(item)}}>
                <label>
                    {item.descripcion}
                </label>
            </td>
            <td onDoubleClick={()=>{handleProductSelect(item)}}>
                <label>
                    {item.SubCategoria}
                </label>
            </td>
            <td onDoubleClick={()=>{handleProductSelect(item)}}>
                <label>
                    {item.Nota}
                </label>
            </td>
        </>
        );
    };

    const filterProduct = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let proData = list//The whole table "products".
        //let aliasData = refAliasList.current//The whole table "alias".
        try {
            setSearchText(text)
            if (text === '' || text.length < 2) {
                setLista(proData);
                return []
            }else{
                // Define a case-insensitive text filter function
                const filterByText = (item) =>
                item.Cod.toLowerCase().includes(text.toLowerCase()) ||
                item.descripcion.toLowerCase().includes(text.toLowerCase());
                // Filter products based on the text
                const TFiltro1 = proData.filter(filterByText);
                // Filter aliases based on the text
                //const TFiltro2 = aliasData.filter((item) => item.Alias.toLowerCase().includes(text));
                // Extract unique cod values from aliasData
                //const CodAlias = [...new Set(TFiltro2.map((item) => item.Cod))];
                // Filter products based on unique cod values
                //const aliasProducts = proData.filter((item) => CodAlias.includes(item.Cod));
                // Extract unique cod values from aliasProducts
                //const uniqueAliasProducts = [...new Set(aliasProducts.map((item) => item.cod))];
                // Combine the unique cod values from TFiltro1 and aliasProducts
                //const filtro = [...new Set([...TFiltro1, ...aliasProducts])];
                // Convert the json into an array of objects to reorder by score
                //const dataArray = filtro.map((value, key) => ({ key, ...value }));
                // Order the array deppending on the score
                //dataArray.sort((a, b) => b.Score - a.Scote);
                // Convert the array into a json object
                //!const sortedJson = JSON.stringify(dataArray);
                //sortedJson2 = sortedJson
                setLista(TFiltro1)
                //setFilteredProducts(sortedJson);
                //console.log('dataArray: ', dataArray)
                return TFiltro1;
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setLista([])
        }
    }

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '85%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Seleccionar productos</h1>
                </div>
                <div className='theModal-body' style={{height: '100%'}}>
                    <div>
                        <label>
                            Buscar producto:
                        </label>
                        <input
                            type="text"
                            className=""
                            value={searchText}
                            style={{'width': '90%'}}
                            placeholder='Buscar producto'
                            onChange={(e)=>{filterProduct(e.target.value)}}>
                        </input>
                    </div>
                    <div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column', // Coloca los elementos en columna
                            alignItems: 'center',    // Centra horizontalmente
                            justifyContent: 'center', // Centra verticalmente
                            height: '300px'           // Ocupa toda la altura de la ventana
                        }}>
                            <Flatlist
                                data={lista}
                                headers={productHeader}
                                row={RowOrder}
                                Height={'300px'}
                                selectedRow={selectedfila}
                                setSelectedRow={setSelectedfila}
                                rowStyles='alternative'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}