import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '../../Components';
import { SearhProduct } from '../../Components/Modals';
import { SubCategoryListApi,
        GetProductListApi,
        SupplierListApi,
        postUpdateProductApi,
        ClasesListApi } from '../../api';
import { TheAlert } from '../../Components';
import { ListBox } from '../../Components/ListBox';
import { PagePosition, AddTo, Alias } from '../../Components/Modals';
import "./_NewProduct.scss";
import { useTheContext } from '../../TheProvider';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

export function NewProduct(){
    const [selectedfila, setSelectedfila] = useState(0);
    const [focusFlatlist, setFocusFlatlist] = useState(false);
    const [showAddto, setsShowAddto] = useState(false);
    const [exist, setExist] = useState(false);
    const { usD } = useTheContext()
    const [otherSupplierList, setOtherSupplierList ] = useState([
        {
            'Cod': '',
            'CodP': '',
            'Proveedor': '',
            'PCosto': '',
            'Cantidad': '',
            'Porcentaje': ''
        }]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [showSearhProduct, setShowSearhProduct] = useState(false);
    const [showPagePosition, setShowPagePosition] = useState(false);
    const refList = useRef([]);
    const prodList = useRef([]);
    const suppList = useRef([]);
    const clasesList = useRef([]);
    const [productList, setProductList] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [clases, setClases] = useState([]);
    const [showAlias,setShowAlias] = useState(false)
    const [dataProduct, setDataProduct] = useState(
        {
            'Consecutivo': '',
            'Cod': '',
            'Descripcion': '',
            'EsunidadOpaquete': '',
            'Categoria': '',
            'IdCategoria': '',
            'SubCategoria': '',
            'IdSubCategoria': '',
            'Proveedor': '',
            'CodProveedor': '',
            'PCosto': '',
            'PventaContado': '',
            'PorcenPVentaContado': '',
            'PVentaCredito': '',
            'PorcenPVentaCredito': '',
            'PVentaDistribuidor': '',
            'PorcenPVentaDistribuidor': '',
            'Ubicacion': '',
            'Cantidad': '',
            'Minimo': '',
            'Maximo': '',
            'Iva': '',
            'Agotado': '',
            'Disponible': '',
            'SVenta': '',
            'IdClase': '',
            'Clase': '',
            'ImgNombre': '',
            'Pagina': '',
            'CoordenadaX': '',
            'CoordenadaY': '',
            'Nota': '',
            'Detalle': '',
            'Grupo': ''
        }
    );
    const [imgSrc, setImgSrc] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIF/${dataProduct.ImgNombre}.avif?v=${Date.now()}`);
    
    const GetProductL =async()=>{
      const productL = await GetProductListApi()
      setProductList(productL)
      prodList.current = productL
    };

    const GetSubCategoryL =async()=>{
        const SubCategoryL = await SubCategoryListApi()
        setSubCategoryList(SubCategoryL)
        refList.current = SubCategoryL
    };

    useEffect(() => {

        const GetSupplierL =async()=>{
            const supplierL = await SupplierListApi()
            setSupplier(supplierL)
            suppList.current = supplierL
        }

        const GetClasesL = async()=>{
            const clasesL = await ClasesListApi()
            setClases(clasesL)
            clasesList.current = clasesL
        }
        GetClasesL()
        GetProductL()
        GetSubCategoryL()
        GetSupplierL()
        
        return () => {
        }
    }, []);

    const handleData = (item, value) => {
        setDataProduct((prev) => ({
        ...prev,
        [item]: value,
        }));
        if (item === 'ImgNombre'){
            setImgSrc(`https://sivarwebresources.s3.amazonaws.com/AVIF/${value}.avif?v=${Date.now()}`);
        }

        if (item === 'Cod'){
            const filterByText = (item) =>
            item.Cod.toLowerCase() == value.toLowerCase();
            // Filter products based on the text
            const TFiltro1 = productList.filter(filterByText);

            if (value !== '' && TFiltro1.length > 0) {
                setExist(true)
            } else {
                setExist(false)
            }
        } 
    };

    const handleDataOSuppier = (index, key, value) => {
        setOtherSupplierList((prevList) => {
            const newList = prevList.map((supplier, i) =>
                i === index ? { ...supplier, [key]: value } : supplier
            );

            const last = newList[newList.length - 1];

            const isEmpty = (v) =>
                v === '' || v === null || v === undefined || v === 0;

            const isLastRowEmpty =
                isEmpty(last.Cod) &&
                isEmpty(last.CodP) &&
                isEmpty(last.Proveedor) &&
                isEmpty(last.PCosto) &&
                isEmpty(last.Cantidad) &&
                isEmpty(last.Porcentaje);

            // Si se está editando la última fila vacía, agregar nueva fila vacía
            if (index === newList.length - 1 && !isLastRowEmpty) {
                newList.push({
                    Cod: '',
                    CodP: '',
                    Proveedor: '',
                    PCosto: '',
                    Cantidad: '',
                    Porcentaje: ''
                });
            }
            return newList;
        });
    };

    const ProductHeader = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Proveedor',
            key: 'proveedor',
            defaultWidth: '60%',
            type: 'text',
        },
        {
            header: 'P. Costo',
            key: 'PCosto',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '10%',
            type: 'text',
        },
        {
            header: '% Ganancia',
            key: 'ganancia',
            defaultWidth: '10%',
            type: 'text',
        }
    ];

    const deleteFila = () => {
        if (otherSupplierList.length > 1) {
            const newList = [...otherSupplierList];
            newList.splice(selectedfila, 1); // esto sí modifica la copia
            setOtherSupplierList(newList);
        } else {
            setOtherSupplierList([
                {
                    'Cod': '',
                    'CodP': '',
                    'Proveedor': '',
                    'PCosto': '',
                    'Cantidad': '',
                    'Porcentaje': ''
                }
            ]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (focusFlatlist) {
                if (e.key === 'Delete') {
                    e.preventDefault();
                    console.log('Borrar fila', selectedfila);
                    deleteFila()
                    // deleteFila(selectedfila);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusFlatlist, selectedfila]);

    const RowOrder = (item, index, columnsWidth) => {
        const OnClick =(selecPro) =>{
            handleDataOSuppier(index, 'CodP' , selecPro.Cod)
            handleDataOSuppier(index, 'Proveedor' , selecPro.Proovedor)
            handleDataOSuppier(index, 'PCosto' , 0)
            handleDataOSuppier(index, 'Porcentaje' , 0)
        }
        return (
        <>
            <td
                onDoubleClick={()=>{}}
                >
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.CodP}
                    style={{width: '100%'}}
                    onChange={(e)=>{
                        handleDataOSuppier(index, 'CodP' , e.target.value)
                    }}
                    onBlur={(e)=>{
                        const selectedSupplier = e.target.value;
                        if (selectedSupplier !== ''){
                            const selectedOption = supplier.find(
                                (opcion) => opcion.Cod == selectedSupplier
                            );
                            if (selectedOption){
                                handleDataOSuppier(index, 'Proveedor' , selectedOption.Proovedor)
                            } else {
                                TheAlert("No se encuentra el proveedor con código " + item.CodP)
                            }
                        }
                    }}
                />
            </td>
            <td
                onDoubleClick={()=>{}}
                style={{width: columnsWidth[1]}}
            >
                <ListBox
                    Value={item.Proveedor}
                    Disabled={false}
                    dataList={supplier}
                    Objetive={'Proovedor'}
                    OnClick={OnClick}
                    Width={'100%'}
                    ListWidth={columnsWidth[1]}
                />
            </td>
            <td
                onDoubleClick={()=>{}}>
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.PCosto}
                    style={{width: '100%'}}
                    onChange={(e)=>{
                        let NewPercent = (e.target.value !== 0 || e.target.value !== ''? ((dataProduct.PventaContado-e.target.value) /e.target.value * 100).toFixed(2) : 0)
                        handleDataOSuppier(item.CodP, 'PCosto' , e.target.value)
                        handleDataOSuppier(item.CodP, 'Porcentaje' , NewPercent)
                    }}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <input
                    type="number"
                    min="1"
                    className=""
                    value={item.Cantidad}
                    style={{width: '100%'}}
                    onChange={(e)=>{
                        handleDataOSuppier(item.CodP, 'Cantidad', e.target.value)
                    }}
                />
            </td>
            <td onDoubleClick={()=>{}}>
                <label
                    style={{width: '100%'}}
                >
                    {item.Porcentaje} %
                </label>
            </td>
        </>
        );
    };

    const updatedProduct = async()=>{
        const UpdateProductData = {...dataProduct}
        // Crea una nueva lista SIN el último elemento
        const newOtherSuppliers = otherSupplierList.slice(0, -1);
        UpdateProductData.otrosProveedores = newOtherSuppliers
        const upProduct = await postUpdateProductApi(UpdateProductData)
        if (upProduct.sucess === true){
            TheAlert('El producto se actualizó con exito')
            GetProductL()
            cancelProduct()
        } else if (upProduct.sucess === false){
            TheAlert('Ocurrio un error al modificar el producto, error: ', upProduct.error)
        }
    };

    const NewProduct = async()=>{
        if (dataProduct.Consecutivo !== '') {
            TheAlert('El producto no puede tener un consecutivo ya creado')
            return;
        } else if (dataProduct.Cod === '' || dataProduct.Descripcion ==='') {
            TheAlert('El producto debe poseer un codido y una descripción.')
            return;
        } else {
            if ((
                    dataProduct.Pagina === '' ||
                    dataProduct.CoordenadaX === '' || 
                    dataProduct.CoordenadaY === ''
                )
                ||
                (
                    dataProduct.Pagina !== '' &&
                    dataProduct.CoordenadaX !== '' &&
                    dataProduct.CoordenadaY !== ''
                )
            ) {
                const NewProductData = {...dataProduct}
                NewProductData.CodResponsable = usD.Cod
                NewProductData.Responsable = usD.Nombre + ' ' + usD.Apellido
                NewProductData.Fecha = Date.now()
                NewProductData.otrosProveedores = otherSupplierList.pop()
            } else {
                TheAlert('Se deben completar los datos de posición en la página')
                return;
            }
        }
    };

    const cancelProduct = async()=>{
        setDataProduct({
            'Consecutivo': '',
            'Cod': '',
            'Descripcion': '',
            'EsunidadOpaquete': '',
            'Categoria': '',
            'IdCategoria': '',
            'SubCategoria': '',
            'IdSubCategoria': '',
            'Proveedor': '',
            'CodProveedor': '',
            'PCosto': '',
            'PventaContado': '',
            'PorcenPVentaContado': '',
            'PVentaCredito': '',
            'PorcenPVentaCredito': '',
            'PVentaDistribuidor': '',
            'PorcenPVentaDistribuidor': '',
            'Ubicacion': '',
            'Cantidad': '',
            'Minimo': '',
            'Maximo': '',
            'Iva': '',
            'Agotado': '',
            'Disponible': '',
            'SVenta': '',
            'IdClase': '',
            'Clase': '',
            'ImgNombre': '',
            'Pagina': '',
            'CoordenadaX': '',
            'CoordenadaY': '',
            'Nota': '',
            'Detalle': '',
            'Grupo': ''
        })
        setOtherSupplierList([{
            'Cod': '',
            'CodP': '',
            'Proveedor': '',
            'PCosto': '',
            'Cantidad': '',
            'Porcentaje': ''
        }])
        setSelectedfila(0)
    };

    return (
        <div>
            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                onClick={()=>{setsShowAddto(true)}}
            >
                Añadir a tablas
            </button>
            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                disabled={dataProduct.Pagina === '' || dataProduct.Cod === '' || dataProduct.Descripcion === ''}
                onClick={()=>{setShowPagePosition(true)}}
            >
                Asignar página
            </button>
            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                disabled={dataProduct.Cod === ''}
                onClick={()=>{setShowAlias(true)}}
            >
                Añadir un alias
            </button>

            <div style={{marginBottom: '3px'}}>
                <div>
                    <label>Descripción</label>
                    <input
                        type="text"
                        className=""
                        value={dataProduct.Descripcion}
                        style={{'width': '70%'}}
                        onChange={(e)=>{handleData('Descripcion', e.target.value)}}
                    />
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{
                            GetProductL();
                            setShowSearhProduct(true)
                        }}
                    >
                        Buscar
                    </button>
                </div>
            </div>
            <div style={{'display': 'flex'}}>
                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Codigo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataProduct.Cod}
                                onChange={(e)=>{handleData('Cod', e.target.value)}}
                            />
                        </div>
                        {exist &&
                            <label>El código ya existe</label>
                        }
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Unidad/Paquete</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                min="1"
                                className=""
                                value={dataProduct.EsunidadOpaquete}
                                onChange={(e)=>{handleData('EsunidadOpaquete', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Categoria</label>
                        </div>
                        <div className='_column2Customer'>
                            <label>{dataProduct.Categoria}</label>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Sub Categoria</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={dataProduct.SubCategoria}
                                onChange={(e) => {
                                    const selectedCategory = e.target.value;
                                    const selectedOption = subCategoryList.find(
                                        (opcion) => opcion.SubCategoria === selectedCategory
                                    );
                                    if (selectedOption) {
                                        handleData('SubCategoria', selectedOption.SubCategoria);
                                        handleData('IdSubCategoria', selectedOption.IDSubCategoria);
                                        handleData('Categoria', selectedOption.Categoria);
                                        handleData('IdCategoria', selectedOption.IdCategoria);
                                    }
                                }}
                                style={{width: '90%'}}
                            >
                                <option value="" disabled={true} >--subcategoria--</option>
                                {subCategoryList.map((opcion) => (
                                    <option
                                        key={opcion.IDSubCategoria}
                                        value={opcion.SubCategoria}>
                                        {opcion.SubCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Cod Proveedor</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.CodProveedor}
                                onChange={(e)=>{handleData('CodProveedor', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Proveedor</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={dataProduct.Proveedor}
                                onChange={(e) => {
                                    const selectedSupplier = e.target.value;
                                    const selectedOption = supplier.find(
                                        (opcion) => opcion.Proovedor === selectedSupplier
                                    );
                                    if (selectedOption) {
                                        handleData('Proveedor', selectedOption.Proovedor);
                                        handleData('CodProveedor', selectedOption.Cod);
                                    }
                                }}
                                style={{width: '90%'}}
                            >
                                <option value="" disabled={true} >--Proveedor--</option>
                                {supplier.map((opcion) => (
                                    <option
                                        key={opcion.Cod}
                                        value={opcion.Proovedor}>
                                        {opcion.Proovedor}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>P. Costo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PCosto}
                                onChange={(e)=>{handleData('PCosto', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Grupo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Grupo}
                                onChange={(e)=>{handleData('Grupo', e.target.value)}}
                            />
                        </div>
                    </div>
                </div>

                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>P. Venta Contado</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                min="0"
                                value={dataProduct.PventaContado}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PventaContado', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let porcent = ((value-dataProduct.PCosto) /dataProduct.PCosto * 100).toFixed(2)
                                        handleData('PorcenPVentaContado', porcent)
                                    }
                                }}
                            />
                            <label style={{'width': '10%'}}>%</label>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PorcenPVentaContado}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PorcenPVentaContado', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let NewPrice = (dataProduct.PCosto + ((value/100)*dataProduct.PCosto)).toFixed(2)
                                        handleData('PventaContado', NewPrice)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>P. Venta crédito</label>
                        </div>
                        <div className='_column1Customer'>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PVentaCredito}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PVentaCredito', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let porcent = ((value-dataProduct.PCosto) /dataProduct.PCosto * 100).toFixed(2)
                                        handleData('PorcenPVentaCredito', porcent)
                                    }
                                }}
                            />
                            <label style={{'width': '10%'}} >%</label>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PorcenPVentaCredito}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PorcenPVentaCredito', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let NewPrice = (dataProduct.PCosto + ((value/100)*dataProduct.PCosto)).toFixed(2)
                                        handleData('PVentaCredito', NewPrice)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>P. Distribuidor</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PVentaDistribuidor}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PVentaDistribuidor', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let porcent = ((value-dataProduct.PCosto) /dataProduct.PCosto * 100).toFixed(2)
                                        handleData('PorcenPVentaDistribuidor', porcent)
                                    }
                                }}
                            />
                            <label style={{'width': '10%'}}>%</label>
                            <input
                                type="number"
                                min="0"
                                className=""
                                value={dataProduct.PorcenPVentaDistribuidor}
                                style={{'width': '40%'}}
                                onChange={(e)=>{
                                    handleData('PorcenPVentaDistribuidor', e.target.value)
                                    if (dataProduct.PCosto !== 0){
                                        let value = e.target.value
                                        let NewPrice = (dataProduct.PCosto + ((value/100)*dataProduct.PCosto)).toFixed(2)
                                        handleData('PVentaDistribuidor', NewPrice)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Ubicación</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataProduct.Ubicacion}
                                onChange={(e)=>{handleData('Ubicacion', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Cantidad</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Cantidad}
                                onChange={(e)=>{handleData('Cantidad', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Minimo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Minimo}
                                onChange={(e)=>{handleData('Min', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Maximo</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Maximo}
                                onChange={(e)=>{handleData('Max', e.target.value)}}
                            />
                        </div>
                    </div>
                </div>

                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Iva</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Iva}
                                onChange={(e)=>{handleData('Iva', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Agotado</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                value={dataProduct.Agotado}
                                onChange={(e)=>{handleData('Agotado', e.target.checked)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Disponible</label>
                        </div>
                        <div className='_column2Customer'>
                            <label>{dataProduct.Disponible}</label>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>SVenta</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="checkbox"
                                className=""
                                value={dataProduct.SVenta}
                                onChange={(e)=>{handleData('SVenta', e.target.checked)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Clase</label>
                        </div>
                        <div className='_column2Customer'>
                            <select
                                id="mi-select"
                                value={dataProduct.Proveedor}
                                onChange={(e) => {
                                    const selectedClase = e.target.value;
                                    const selectedOption = clases.find(
                                        (opcion) => opcion.Nombre === selectedClase
                                    );
                                    if (selectedOption) {
                                        handleData('IdClase', selectedOption.Id);
                                        handleData('Clase', selectedOption.Nombre);
                                    }
                                }}
                                style={{width: '90%'}}
                            >
                                <option value="" disabled={true} >--Clase--</option>
                                {clases.map((opcion) => (
                                    <option
                                        key={opcion.Id}
                                        value={opcion.Nombre}>
                                        {opcion.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Img Nombre</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="text"
                                className=""
                                value={dataProduct.ImgNombre}
                                onChange={(e)=>{
                                    handleData('ImgNombre', e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Página</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Pagina}
                                onChange={(e)=>{handleData('Pagina', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Coordenada-x</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.CoordenadaX}
                                onChange={(e)=>{handleData('CoordenadaX', e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div className='_column1Customer'>
                            <label>Coordenada-y</label>
                        </div>
                        <div className='_column2Customer'>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.CoordenadaY}
                                onChange={(e)=>{handleData('CoordenadaY', e.target.value)}}
                            />
                        </div>
                    </div>
                </div>

                <div className='_columnNewProduct'>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div style={{'width': '20%'}}>
                            <label>Notas</label>
                        </div>
                        <div style={{'width': '80%'}}>
                            <textarea
                                id='nctaId'
                                type="textbox"
                                className="taStnd ncTextArea"
                                placeholder="Notas internas del producto"
                                value={dataProduct.Nota}
                                onChange={(e)=>handleData('Nota', e.target.value)}
                                style={{width: '90%', height: '149px'}}
                            />
                        </div>
                    </div>
                    <div className='Row' style={{marginBottom: '3px'}}>
                        <div style={{'width': '20%'}}>
                            <label>Detalle</label>
                        </div>
                        <div style={{'width': '80%'}}>
                            <textarea
                                id='nctaId'
                                type="textbox"
                                className="taStnd ncTextArea"
                                placeholder="Detalles y especificaciones del producto"
                                value={dataProduct.Nota}
                                onChange={(e)=>handleData('Detalle', e.target.value)}
                                style={{width: '90%', height: '149px'}}
                            />
                        </div>
                    </div>
                    <div className="ProImgContainer">
                        <picture>
                            <source
                                type="image/avif"
                                srcSet={imgSrc}
                            />
                            <img
                                src={imgSrc}
                                onError={(e)=>{setImgSrc(imgPlaceHolder)}}
                                alt="imgProducto"
                                decoding="async"
                            />
                        </picture>
                    </div>
                </div>
            </div>

            <h4>Lista de otros proveedores</h4>
            <div
                onClick={() => setFocusFlatlist(true)}
                onBlur={() => setFocusFlatlist(false)}
                style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '50%',           // Ocupa toda la altura de la ventana
                width: '80%',
                }}
            >
                <Flatlist
                    data={otherSupplierList}
                    headers={ProductHeader}
                    row={RowOrder}
                    Height={'300px'}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    rowStyles='alternative'
                />
            </div>

            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                onClick={()=>{cancelProduct()}}
            >
                Cancelar
            </button>

            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                disabled={dataProduct.Consecutivo === '' || dataProduct.Cod === ''}
                onClick={()=>{updatedProduct()}}
            >
                Modificar
            </button>

            <button
                className='btnStnd btn1'
                style={{marginLeft: '20px'}}
                disabled={
                        dataProduct.Consecutivo !== '' || 
                        dataProduct.Cod === '' || 
                        dataProduct.Descripcion === ''
                    }
                onClick={()=>{NewProduct()}}
            >
                Nuevo producto
            </button>
            {showSearhProduct &&
                <SearhProduct
                    list={productList}
                    ProductSelectedFunction={setDataProduct}
                    show={setShowSearhProduct}
                    setOtherSupplier={setOtherSupplierList}
                    setImgName={setImgSrc}
                />
            }
            {showPagePosition && 
                <PagePosition
                    Page={dataProduct.Pagina}
                    CoorX={dataProduct.CoordenadaX}
                    CoorY={dataProduct.CoordenadaY}
                    show={setShowPagePosition}
                    selectFunction={handleData}
                />
            }
            {showAddto && 
                <AddTo show={setsShowAddto} action={GetSubCategoryL}/>
            }
            {showAlias &&
                <Alias show={setShowAlias} Cod={dataProduct.Cod}/>
            }
        </div>
    );
}