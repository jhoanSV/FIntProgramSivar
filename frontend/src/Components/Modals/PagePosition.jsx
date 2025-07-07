import React, { useEffect, useState, useRef } from 'react';
import { Flatlist } from '..';
import { otherSupplierApi,
        quiantityAndDisponibleApi
 } from '../../api';
import "./_PagePosition.scss";
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

export function PagePosition( {Page, CoorX, CoorY, show, selectFunction } ){
    const [positionList, setPositionList] = useState([]);
    const [colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});
    const [dataProduct, setDataProduct] = useState({
        'Pagina': Page,
        'CoordenadaX': CoorX,
        'CoordenadaY': CoorY,
        'RelativeX': 0,
        'RelativeY': 0
    });
    const [imgPage, setImgPage] = useState(`https://sivarwebresources.s3.amazonaws.com/imgsCatalogo/CatalogoAVIF/Pagina+${dataProduct.Pagina}.avif?v=${Date.now()}`);
    const [asigCoordinates, setAsigCoordinates] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = dataProduct.CoordenadaX/(imgSize.width/rect.width)
        const relativeY = dataProduct.CoordenadaY/(imgSize.height/rect.height)
        handleData('RelativeX', relativeX)
        handleData('RelativeY', relativeY)
        return () => {
        }
    }, [imgSize, CoorX, CoorY])

    const handleImageLoad = () => {
        if (imgRef.current) {
            const width = imgRef.current.naturalWidth;
            const height = imgRef.current.naturalHeight;
            setImgSize({ width, height });
            console.log("Tamaño de la imagen:", width, height);
        }
    };
    const handleData = (item, value) => {
        setDataProduct((prev) => ({
        ...prev,
        [item]: value,
        }));
        if (item === 'Pagina'){
            setImgPage(`https://sivarwebresources.s3.amazonaws.com/imgsCatalogo/CatalogoAVIF/Pagina+${dataProduct.Pagina}.avif?v=${Date.now()}`);
        }
    };

    const selectF = () => {
        selectFunction('Pagina', dataProduct.Pagina)
        selectFunction('CoordenadaX', dataProduct.CoordenadaX)
        selectFunction('CoordenadaY', dataProduct.CoordenadaY)
        show(false)
    };

    const handleMouseMove = (e) => {
        if (asigCoordinates){
            const rect = containerRef.current.getBoundingClientRect();
            const relativeX = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 24));
            const relativeY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
            const coorXRel = (imgSize.width/rect.width)*relativeX
            const coorYRel = (imgSize.height/rect.height)*relativeY
            handleData('CoordenadaX', coorXRel)
            handleData('CoordenadaY', coorYRel)
            handleData('RelativeX', relativeX)
            handleData('RelativeY', relativeY)
            //console.log(`Posición relativa: X=${relativeX}, Y=${relativeY}`);
        }
    };

    const OnClick = () => {
        setAsigCoordinates(false)
    };

    return (
        <div className="theModalContainer">
            <div className="theModal-content" style={{ width: '50%', height: '90%', position: 'relative' }}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>Coordenadas de productos</h1>
                </div>
                <div className='theModal-body' style={{height: '100%'}}>
                    <div style={{display: 'flex'}}>
                        <div>
                            <label>Página</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                className=""
                                value={dataProduct.Pagina}
                                style={{width: '100px'}}
                                onChange={(e)=>{handleData('Pagina', e.target.value)}}
                            />
                        </div>
                        <div>
                            <label>Coordenada-x</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                className=""
                                min={0}
                                value={dataProduct.CoordenadaX}
                                style={{width: '100px'}}
                                onChange={(e)=>{
                                    handleData('CoordenadaX', e.target.value)
                                    const rect = containerRef.current.getBoundingClientRect();
                                    const relativeX = dataProduct.CoordenadaX/(imgSize.width/rect.width)
                                    handleData('RelativeX', relativeX)
                                }}
                            />
                        </div>
                        <div>
                            <label>Coordenada-y</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                className=""
                                min={0}
                                value={dataProduct.CoordenadaY}
                                style={{width: '100px'}}
                                onChange={(e)=>{
                                    handleData('CoordenadaY', e.target.value)
                                    const rect = containerRef.current.getBoundingClientRect();
                                    const relativeY = dataProduct.CoordenadaY/(imgSize.height/rect.height)
                                    handleData('RelativeY', relativeY)
                                }}
                            />
                        </div>
                        <button
                            className='btnStnd'
                            style={{marginLeft: '20px'}}
                            //disabled={dataProduct.Pagina === '' || dataProduct.CoordenadaX === '' || dataProduct.CoordenadaY === ''}
                            onClick={()=>{setAsigCoordinates(!asigCoordinates)}}
                        >
                            <i
                                className={`bi bi-toggle-${asigCoordinates? 'on' : 'off'}`} 
                                style={{fontSize: '24px'}}
                            /> {asigCoordinates? 'on' : 'off'}
                        </button>
                    </div>
                    <div 
                        className="PageProImgContainer"
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onClick={(e)=>{OnClick()}}
                        style={{ position: 'relative' }}
                        >
                        
                        <picture>
                                <source
                                    type="image/avif"
                                    srcSet={imgPage}
                                />
                                <img
                                    ref={imgRef}
                                    src={imgPage}
                                    onError={(e)=>{setImgPage(imgPlaceHolder)}}
                                    onLoad={handleImageLoad}
                                    alt="imgProducto"
                                    decoding="async"
                                />
                        </picture>
                        <i
                            className={`bi bi-bag-check-fill`}
                            style={{
                                position: 'absolute',
                                left: `${dataProduct.RelativeX}px`,
                                top:`${dataProduct.RelativeY}px`,
                                transform: 'translate(0, -50%)', // para centrarlo un poco mejor
                                fontSize: '24px'
                            }}
                        />
                    </div>
                    <button
                        className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        //disabled={dataProduct.Pagina === '' || dataProduct.CoordenadaX === '' || dataProduct.CoordenadaY === ''}
                        onClick={()=>{selectF()}}
                    >
                        Asignar posición
                    </button>
                </div>
            </div>
        </div>
    )
}