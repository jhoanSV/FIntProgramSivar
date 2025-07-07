import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Flatlist, TheAlert } from '..';
import { CategoryListApi,
         newCategoryApi,
         updateCategoryApi} from '../../api';
import "./_SearhProduct.scss";
import "./_AddTo.scss"

export function AddTo({show}){
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    //const [lista, setLista] = useState(list);
    const [toShow, setToShow] = useState(
        {
            'Categoria': true,
            'SubCategoria': false,
            'Ubicación': false
        }
    );

    const AddCategria = ({}) => {
        const [searchCategoria, setSearchCategoria] = useState('');
        const [selectedfilaCategoria, setSelectedfilaCategoria] = useState(0);
        const [categoria, setCategoria] = useState({Cod: '', Categoria: ''});
        const [categoryList, setCategoryList] = useState([]);
        const catList = useRef([])
        const handleCategoria = (item, value) => {
            setCategoria((prev) => ({
                ...prev,
                [item]: value,
            }));
        };

        const newCat = async()=>{
            const newCat = await newCategoryApi(categoria)
            if (newCat.sucess){
                TheAlert('Se creó la categoría con exito.')
                getCatList()
                Cancel()
            } else {
                TheAlert('Ocurrio un error al crear la cartegoría ' + newCat.error)
            }
        };

        const updateCat = async()=>{
            const updCat = await updateCategoryApi(categoria)
            if (updCat.sucess){
                TheAlert('Se actualizó la categoría con exito.')
                getCatList()
                Cancel()
            } else {
                TheAlert('Ocurrio un error al actualizar la cartegoría ' + updCat.error)
            }
        };

        const deteleCat = async()=>{
            const deCat = await TheAlert('¿Esta seguro de eliminar esta categoría? esto podria causar problemas en los productos que la tienen asignada', 1)
            console.log('dealert :', deCat)
        }

        const filterCategory = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
            let proData = catList.current//The whole table "products".
            //let aliasData = refAliasList.current//The whole table "alias".
            try {
                setSearchCategoria(text)
                if (text === '' || text.length < 2) {
                    setCategoryList(proData);
                    return []
                }else{
                    // Define a case-insensitive text filter function
                    const filterByText = (item) =>
                    String(item.IDCategoria).toLowerCase().includes(text.toLowerCase()) ||
                    String(item.Categoria).toLowerCase().includes(text.toLowerCase());
                    // Filter products based on the text
                    const TFiltro1 = proData.filter(filterByText);
                    setCategoryList(TFiltro1)
                    return TFiltro1;
                }
            } catch (error) {
                //sortedJson2 = false
                console.log('error--> Category List' + error);
                setCategoryList([])
            }
        }

        const getCatList = async()=>{
            const catL = await CategoryListApi()
            setCategoryList(catL)
            catList.current = catL
        };

        const Cancel = () => {
            setCategoria({Cod: '', Categoria: ''})
            filterCategory('')
        };

        useEffect(() => {
          getCatList()
        
          return () => {
          }
        }, []);
        
        const RowOrderCategoria = (item, index, columnsWidth) => {
        
            return (
                <>
                    <td onDoubleClick={()=>setCategoria({Cod: item.IDCategoria, Categoria: item.Categoria})}>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.IDCategoria}
                        </label>
                    </td>
                    <td onDoubleClick={()=>setCategoria({Cod: item.IDCategoria, Categoria: item.Categoria})}>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.Categoria}
                        </label>
                    </td>
                </>
            );
        };

        const categoryHeader = [
            {
                header: 'Id',
                key: 'id',
                defaultWidth: '10%',
                type: 'text',
            },
            {
                header: 'Categoria',
                key: 'categoria',
                defaultWidth: '90%',
                type: 'text',
            }
        ];
        return (
            <div>
                <h1>Categoria</h1>
                <div>
                    <label>Cod:</label>
                    <input
                        type="number"
                        className=""
                        min={1}
                        value={categoria.Cod}
                        style={{'width': '10%'}}
                        placeholder='Codigo'
                        onChange={(e)=>{handleCategoria('Cod',e.target.value)}}>
                    </input>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        className=""
                        value={categoria.Categoria}
                        style={{'width': '70%'}}
                        placeholder='Nombre'
                        onChange={(e)=>{handleCategoria('Categoria',e.target.value)}}>
                    </input>
                    
                </div>
                <div>
                    <label>Buscar:</label>
                    <input
                        type="text"
                        className=""
                        value={searchCategoria}
                        style={{'width': '90%'}}
                        placeholder='Buscar Categoria'
                        onChange={(e)=>{filterCategory(e.target.value)}}>
                    </input>
                </div>
                <div
                    onClick={() => {}}
                    onBlur={() => {}}
                    style={{
                        display: 'flex',
                        flexDirection: 'column', // Coloca los elementos en columna
                        alignItems: 'center',    // Centra horizontalmente
                        justifyContent: 'center', // Centra verticalmente
                        height: '70%',           // Ocupa toda la altura de la ventana
                        width: '90%',
                    }}
                >
                    <Flatlist
                        data={categoryList}
                        headers={categoryHeader}
                        row={RowOrderCategoria}
                        Height={'100%'}
                        selectedRow={selectedfilaCategoria}
                        setSelectedRow={setSelectedfilaCategoria}
                        rowStyles='alternative'
                    />
                </div>
                <div>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        disabled={categoria.Cod !== '' || categoria.Categoria === ''}
                        onClick={()=>newCat()}
                    >
                        Nuevo
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        disabled={categoria.Cod === '' || categoria.Categoria === ''}
                        onClick={()=>updateCat()}
                    >
                        Actualizar
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>Cancel()}
                    >
                        Cancelar
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        disabled={categoria.Cod === ''}
                        onClick={()=>deteleCat()}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        )
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
                        <button
                            className='btnStnd btn1'
                            //style={{marginLeft: '20px'}}
                            onClick={()=>{}}
                        >
                            Categoría
                        </button>
                        <button
                            className='btnStnd btn1'
                            //style={{marginLeft: '20px'}}
                            onClick={()=>{}}
                        >
                            Sub categoría
                        </button>
                        <button
                            className='btnStnd btn1'
                            //style={{marginLeft: '20px'}}
                            onClick={()=>{}}
                        >
                            Ubicación
                        </button>
                    </div>
                    {toShow.Categoria && 
                        <AddCategria/>
                    }

                </div>
            </div>
        </div>
    )
}