import React, { useEffect, useState } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data,
                            row,
                            Width = '100%',
                            Height = '100%',
                            maxHeight = '100%',
                            headers = [],
                            selectedRow,
                            setSelectedRow,
                            principalColor = '#193773',  // Color predeterminado para la cabecera,
                            selectedRowColor = 'rgba(39, 83, 172, 0.58)',  // Color predeterminado para la fila seleccionada,
                            hoverColor = 'rgba(0, 0, 0, 0.1)',  // Color predeterminado para el hover,
                            rowColor1 = '#FFFFFF', // Color para filas pares (o impares, según prefieras)
                            rowColor2 = '#d9d9d9', // Color para filas impares (o pares)
                            rowStyles = 'clasic',
                            doubleClick = ()=>{}}) => {
    //const [selectedRow, setSelectedRow] = useState(null);
    //const [width, setWidth] = useState(Width);
    //const [height, setHeight] = useState(Height);
    const [columnsWidth, setColumnsWidth] = useState([]);

    useEffect(() => {
        if (headers.length > 0) {
            //let newWidth = 0; //? Ger: I think isnt necesary setting the width due to the colums width behaviour
            //? And setting a width isnt good for responsive design. 
            let colWidth = [];
            headers.forEach(header => {
                //newWidth += header.defaultWidth;
                colWidth.push(header.defaultWidth);
            });
            //setWidth(newWidth);
            setColumnsWidth(colWidth);
        } else {
            //setWidth(Width);
            console.log('');
        }
    }, [headers, Width]);

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            setSelectedRow((prev) => Math.max(0, (prev ?? 0) - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            setSelectedRow((prev) => Math.min(data.length - 1, (prev ?? 0) + 1));
            e.preventDefault();
        }
    };

    return (
        <div 
            className='Flatlist'
            id='FlastListID'
            tabIndex={0}
            style={{height: Height, maxHeight: maxHeight, overflowY: 'auto' }}
            onKeyDown={handleKeyDown}
            >
            <table className='theTable' style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead style={{position: 'sticky', top: '0', zIndex: 1}}>
                    <tr>
                        {headers.map((item, index) =>
                            <th 
                                key={index}
                                style={{
                                    width: item.defaultWidth,
                                    maxWidth: item.defaultWidth,
                                    backgroundColor: principalColor,
                                    overflow: 'hidden'
                                }} >
                                <div className='cellContent'>{item['header']}</div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 && (data.map((item, index) => {
                        // Determina el color de fondo basado en si el índice es par o impar
                        let currentBackgroundColor = 'inherit';
                        if (rowStyles === 'alternative'){
                            currentBackgroundColor = index % 2 === 0 ? rowColor1 : rowColor2;
                        }
                        return (
                            <tr
                                key={index}
                                className={`rowflatlist ${selectedRow === index ? 'selected' : ''}`}
                                onClick={() => handleRowClick(index)}
                                onDoubleClick={()=>doubleClick()}
                                style={{
                                    backgroundColor: selectedRow === index ? selectedRowColor : currentBackgroundColor,
                                    color: selectedRow === index ? '#fff' : 'inherit'
                                }}
                            >
                                {row(item, index, columnsWidth)}
                            </tr>

                        )
                    }))}
                </tbody>
            </table>
        </div>
    );
}
