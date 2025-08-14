import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Flatlist, TheAlert } from '..';
import {CategoryListApi,
        newCategoryApi,
        updateCategoryApi,
        deleteCategoryApi,
        SubCategoryListApi,
        newSubCategoryApi,
        updateSubCategoryApi,
        deleteSubCategoryApi
    } from '../../api';
import "./_SearhProduct.scss";
import "./_AddTo.scss"

export function AddTo({show, action}){
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    //const [lista, setLista] = useState(list);
    const [toShow, setToShow] = useState(
        {
            'Categoria': true,
            'SubCategoria': false
        }
    );

    const selectToShow = (key) => {
        setToShow((prev) => {
            const newState = {};
            Object.keys(prev).forEach(k => {
                newState[k] = (k === key);
            });
            return newState;
        });
    };

    //!Categoty
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
                action()
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
                action()
                Cancel()
            } else {
                TheAlert('Ocurrio un error al actualizar la cartegoría ' + updCat.error)
            }
        };

        const DeteleCat = async()=>{
            const deCat = await TheAlert('¿Esta seguro de eliminar esta categoría? esto podria causar problemas en los productos que la tienen asignada', 1)
            if (deCat) {
                const deteleCat = await deleteCategoryApi(categoria)
                if (deteleCat) {
                    TheAlert('Categoría eliminda con exito.')
                    getCatList()
                    action()
                    Cancel()
                } else {
                    TheAlert('Ocurrio un error al actualizar la cartegoría ' + deteleCat.error)
                }
            }
        };

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
                        onClick={()=>DeteleCat()}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        )
    };

    //!Sub Categoty
    const AddSubCategria = ({}) => {
        const [searchSubCategoria, setSearchSubCategoria] = useState('');
        const [selectedfilaSubCategoria, setSelectedfilaSubCategoria] = useState(0);
        const [subCategoria, setSubCategoria] = useState({
            Cod: '',
            SubCategoria: '',
            IdCategoria: '',
            Categoria: ''
        });
        const [subCategoryList, setSubCategoryList] = useState([]);
        const subCatList = useRef([]);
        const [catList, setCatList] = useState([]);
        const handlesubCategoria = (item, value) => {
            setSubCategoria((prev) => ({
                ...prev,
                [item]: value,
            }));
        };

        const newSubCat = async()=>{
            const newSubCat = await newSubCategoryApi(subCategoria)
            if (newSubCat.sucess){
                TheAlert('Se creó la subcategoría con exito.')
                getSubCatList()
                action()
                Cancel()
            } else {
                TheAlert('Ocurrio un error al crear la subcartegoría ' + newSubCat.error)
            }
        };

        const updateSubCat = async()=>{
            const updCat = await updateSubCategoryApi(subCategoria)
            if (updCat.sucess){
                TheAlert('Se actualizó la subcategoría con exito.')
                getSubCatList()
                action()
                Cancel()
            } else {
                TheAlert('Ocurrio un error al actualizar la subcartegoría ' + updCat.error)
            }
        };

        const DeteleSubCat = async()=>{
            const deSubCat = await TheAlert('¿Esta seguro de eliminar esta subcategoría? esto podria causar problemas en los productos que la tienen asignada', 1)
            if (deSubCat) {
                const deteleSubCat = await deleteSubCategoryApi(subCategoria)
                if (deteleSubCat) {
                    TheAlert('Subcategoría eliminda con exito.')
                    getSubCatList()
                    action()
                    Cancel()
                } else {
                    TheAlert('Ocurrio un error al actualizar la subcartegoría ' + deteleSubCat.error)
                }
            }
        }

        const filterSubCategory = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
            let proData = subCatList.current//The whole table "products".
            //let aliasData = refAliasList.current//The whole table "alias".
            try {
                setSearchSubCategoria(text)
                if (text === '' || text.length < 2) {
                    setSubCategoryList(proData);
                    return []
                }else{
                    // Define a case-insensitive text filter function
                    const filterByText = (item) =>
                    String(item.IDSubCategoria).toLowerCase().includes(text.toLowerCase()) ||
                    String(item.SubCategoria).toLowerCase().includes(text.toLowerCase());
                    // Filter products based on the text
                    const TFiltro1 = proData.filter(filterByText);
                    setSubCategoryList(TFiltro1)
                    return TFiltro1;
                }
            } catch (error) {
                //sortedJson2 = false
                console.log('error--> filterSubCategory' + error);
                setSubCategoryList([])
            }
        }

        const Cancel =()=> {
            setSubCategoria({
                                Cod: '',
                                SubCategoria: '',
                                IdCategoria: '',
                                Categoria: ''
                            })
            filterSubCategory('')
        };
       
        const getSubCatList = async()=>{
            const subCatL = await SubCategoryListApi()
            setSubCategoryList(subCatL)
            subCatList.current = subCatL
        };

        const getCatList = async()=>{
            const catL = await CategoryListApi()
            setCatList(catL)
        };
    
        useEffect(() => {
            getSubCatList()
            getCatList()
            return () => {
            }
        }, []);
        
        const RowOrderSubCategoria = (item, index, columnsWidth) => {
        
            return (
                <>
                    <td onDoubleClick={()=>{
                            setSubCategoria({
                                Cod: item.IDSubCategoria,
                                SubCategoria: item.SubCategoria,
                                IdCategoria: item.IDCategoria,
                                Categoria: item.Categoria
                            })}
                        }>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.IDSubCategoria}
                        </label>
                    </td>
                    <td onDoubleClick={()=>{
                            setSubCategoria({
                                Cod: item.IDSubCategoria,
                                SubCategoria: item.SubCategoria,
                                IdCategoria: item.IDCategoria,
                                Categoria: item.Categoria
                            })}}>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.SubCategoria}
                        </label>
                    </td>
                    <td onDoubleClick={()=>{
                            setSubCategoria({
                                Cod: item.IDSubCategoria,
                                SubCategoria: item.SubCategoria,
                                IdCategoria: item.IDCategoria,
                                Categoria: item.Categoria
                            })}}>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.IDCategoria}
                        </label>
                    </td>
                    <td onDoubleClick={()=>{
                            setSubCategoria({
                                Cod: item.IDSubCategoria,
                                SubCategoria: item.SubCategoria,
                                IdCategoria: item.IDCategoria,
                                Categoria: item.Categoria
                            })}}>
                        <label
                            style={{width: '100%'}}
                        >
                            {item.Categoria}
                        </label>
                    </td>
                </>
            );
        };

        const subCategoryHeader = [
            {
                header: 'Id',
                key: 'id',
                defaultWidth: '5%',
                type: 'text',
            },
            {
                header: 'Subcategoria',
                key: 'subcategoria',
                defaultWidth: '45%',
                type: 'text',
            },
            {
                header: 'Id Categría',
                key: 'idcategoria',
                defaultWidth: '15%',
                type: 'text',
            },
            {
                header: 'Categoria',
                key: 'categoria',
                defaultWidth: '45%',
                type: 'text',
            }
        ];
        return (
            <div>
                <h1>Sub Categoria</h1>
                <div>
                    <label>Cod:</label>
                    <input
                        type="number"
                        className=""
                        min={1}
                        value={subCategoria.Cod}
                        style={{'width': '10%'}}
                        placeholder='Codigo'
                        onChange={(e)=>{handlesubCategoria('Cod',e.target.value)}}>
                    </input>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        className=""
                        value={subCategoria.SubCategoria}
                        style={{'width': '65%'}}
                        placeholder='Nombre'
                        onChange={(e)=>{handlesubCategoria('SubCategoria',e.target.value)}}>
                    </input>
                </div>
                <div>
                    <label>Categoria:</label>
                    <select
                        id="mi-select"
                        value={subCategoria.Categoria}
                        onChange={(e) => {
                            const selectedCategory = e.target.value;
                            const selectedOption = catList.find(
                                (opcion) => opcion.Categoria === selectedCategory
                            );
                            if (selectedOption) {
                                handlesubCategoria('Categoria', selectedOption.Categoria);
                                handlesubCategoria('IdCategoria', selectedOption.IDCategoria);
                            }
                        }}
                        style={{width: '50%'}}
                    >
                        <option value="" disabled={true} >--Categoria--</option>
                        {catList.map((opcion) => (
                            <option
                                key={opcion.IDCategoria}
                                value={opcion.Categoria}>
                                {opcion.Categoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Buscar:</label>
                    <input
                        type="text"
                        className=""
                        value={searchSubCategoria}
                        style={{'width': '80%'}}
                        placeholder='Buscar subcategoria'
                        onChange={(e)=>{filterSubCategory(e.target.value)}}>
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
                        data={subCategoryList}
                        headers={subCategoryHeader}
                        row={RowOrderSubCategoria}
                        Height={'500px'}
                        selectedRow={selectedfilaSubCategoria}
                        setSelectedRow={setSelectedfilaSubCategoria}
                        rowStyles='alternative'
                    />
                </div>
                <div>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        disabled={
                            subCategoria.Cod !== '' ||
                            subCategoria.SubCategoria === '' ||
                            subCategoria.IdCategoria === '' ||
                            subCategoria.Categoria === ''
                        }
                        onClick={()=>newSubCat()}
                    >
                        Nuevo
                    </button>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        disabled={
                            subCategoria.Cod === '' ||
                            subCategoria.SubCategoria === '' ||
                            subCategoria.IdCategoria === '' ||
                            subCategoria.Categoria === ''
                        }
                        onClick={()=>updateSubCat()}
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
                        disabled={subCategoria.Cod === '' || subCategoria.SubCategoria === ''}
                        onClick={()=>DeteleSubCat()}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        )
    };

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '85%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Añadir a tablas</h1>
                </div>
                <div className='theModal-body' style={{height: '100%'}}>
                    <div>
                        <button
                            className='btnStnd btn1'
                            //style={{marginLeft: '20px'}}
                            onClick={()=>selectToShow('Categoria')}
                        >
                            Categoría
                        </button>
                        <button
                            className='btnStnd btn1'
                            //style={{marginLeft: '20px'}}
                            onClick={()=>selectToShow('SubCategoria')}
                        >
                            Sub categoría
                        </button>
                    </div>
                    {toShow.Categoria && 
                        <AddCategria/>
                    }
                    {toShow.SubCategoria && 
                        <AddSubCategria/>
                    }

                </div>
            </div>
        </div>
    )
}