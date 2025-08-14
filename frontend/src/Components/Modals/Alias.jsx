import React, { useEffect, useState, useRef } from 'react';
import { Flatlist, TheAlert } from '..';
import { getAliasListApi, postNewAliasApi } from '../../api';
import { TheInput } from '../../Components/InputComponent'
import "./_PPurchases.scss";
import { priceValue, dateFormat } from '../../InternalFunctions';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

export function Alias( {show, Cod} ){
    const [selectedfila, setSelectedfila] = useState(0);
    const [aliasText, setAliasText] = useState('');
    const [list, setList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    const refList = useRef([]);
    const AliasHeader = [
        {
            header: 'Alias',
            key: 'Alias',
            defaultWidth: '100%',
            type: 'text',
        }
    ];

    const GetList = async()=>{
        const AliasList = await getAliasListApi({
            Cod: Cod
        })
        setList(AliasList)
        refList.current = AliasList
    };

    useEffect(() => {
        GetList()
    }, []);

    const filterProduct = (text) => {
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
                item.Alias.toLowerCase().includes(text.toLowerCase())
                // Filter products based on the text
                const TFiltro1 = proData.filter(filterByText);

                setList(TFiltro1)
                return TFiltro1;
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setList([])
        }
    };

    const newAlias = async()=>{
        const NAlias = await postNewAliasApi({
            'Cod': Cod,
            'Alias': aliasText
        })
        if (NAlias.sucess) {
            TheAlert(' Se agregó alias con extito')
            refList.current.push([aliasText])
            console.log(refList.current)
            setList([...refList.current])
        } else {
            TheAlert('Ocurrio uin error al crear el alias, error: ' + NAlias.error)
        }
    }

    const RowOrder = (item, index, columnsWidth) => {
        if (!item) return null;
        return (
        <>
            <td onDoubleClick={()=>{}}>
                <label>
                    {item.Alias}
                </label>
            </td>
        </>
        );
    };

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '90%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Alias</h1>
                </div>
                <div>
                    <input
                        type="text"
                        className=""
                        value={aliasText}
                        style={{'width': '65%'}}
                        placeholder='Buscar'
                        onChange={(e)=>{setAliasText(e.target.value)}}>
                    </input>
                    <button
                        className='btnStnd btn1'
                        onClick={()=>{}}
                    >
                        Cancelar
                    </button>
                    <button
                        className='btnStnd btn1'
                        onClick={()=>{}}
                    >
                        Eliminar
                    </button>
                </div>
                <div>
                    <label><strong>Buscar:</strong></label>
                    <input
                        type="text"
                        className=""
                        value={searchText}
                        style={{'width': '65%'}}
                        placeholder='Buscar'
                        onChange={(e)=>{filterProduct(e.target.value)}}>
                    </input>
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
                        headers={AliasHeader}
                        row={RowOrder}
                        Height={'100%'}
                        selectedRow={selectedfila}
                        setSelectedRow={setSelectedfila}
                        rowStyles='alternative'
                    />
                </div>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{newAlias()}}
                >
                    Nuevo alias
                </button>
            </div>
        </div>
    )
}