import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './_ListBox.scss';

export const ListBox = ({ Value,
        Disabled,
        dataList,
        Objetive,
        OnClick,
        OnFocus,
        Width,
        ListWidth = '100%',
        TextColor = 'black'
    }) => {
    const [list, setList] = useState(dataList);
    const [sBText, setSBText] = useState(Value);
    const [selectedFLI, setSelectedFLI] = useState(0);
    const [showFL, setShowFL] = useState(false);
    const isEditingRef = useRef(false);
    const nodeRef = useRef(null);
    const selectedFLIRef = useRef(0);
    const suppList = useRef([]);

    const SearchHandle = (text)=> {
        setSBText(text)
        if (text === '' || text < 2) {
            setList(dataList);
            return []
        }else{
            const filterByText = (item) =>
            String(item[Objetive]).toLowerCase().includes(text.toLowerCase());
            // Filter products based on the text
            const TFiltro1 = dataList.filter(filterByText);
            setList(TFiltro1)
            if (TFiltro1.length > 0){
                setShowFL(true)
            }
            return TFiltro1;
        }
    };

    const OnClickAction = () => {
        const item = list[selectedFLI]
        OnClick(item)
        setSBText(item.Proovedor)
        setShowFL(false)
    };

    useEffect(() => {
      setSBText(Value)
    
      return () => {
      }
    }, [Value]);
    

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            setSelectedFLI((prev) => Math.max(0, (prev ?? 0) - 1));
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            setSelectedFLI((prev) => Math.min(list.length - 1, (prev ?? 0) + 1));
            e.preventDefault();
        } else if (e.key === 'Enter') {
            OnClickAction()
        }
    };

    return (
        <>
            <div>
                <input
                    type="text"
                    className=''
                    id='NPinputNP'
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        SearchHandle(e.target.value);
                        selectedFLIRef.current = 0
                        /*changeValuesProducts("Descripcion", e.target.value);
                        if (!modificarProducto){
                            SearchHandle(e.target.value);
                            selectedFLIRef.current = 0
                        }*/
                    }}
                    style={{width: Width}}
                    value={sBText}
                    disabled={Disabled}
                    onFocus={(e)=>{
                        setShowFL(true);
                        isEditingRef.current=true;
                        e.target.select();
                        /*if (!modificarProducto){
                        } else {
                            setShowFL(false);
                            isEditingRef.current=false;
                            e.target.blur();
                        }*/
                    }}
                    onBlur={()=>{isEditingRef.current=false;setShowFL(false)}}
                    autoComplete='off'
                    //autoFocus
                />
                <CSSTransition
                    timeout={200}
                    in={sBText !== '' && showFL}
                    nodeRef={nodeRef}
                    classNames="FLA"
                    unmountOnExit
                    >
                    <div id='flId' className="FloatingList" ref={nodeRef} style={{width: ListWidth, color: TextColor}}>
                        {list.slice(0,20).map((item, index) =>
                            <div key={index}
                                className={`flItem ${index === selectedFLI ? 'selected' : ''}`}
                                onClick={()=>{
                                    OnClick(item);
                                    setSBText(item.Proovedor)
                                }}
                                onMouseEnter={() => {setSelectedFLI(index)}}
                                style={{}}
                                onMouseDown={() => {
                                    OnClick(item);
                                }}
                            >
                                {item[Objetive]}
                            </div>
                        )}
                        {list.length === 0 ?
                            <div className='flItem'>
                                No se encuentran coincidencias
                            </div>
                            :
                            <></>
                        }
                    </div>
                </CSSTransition>
            </div>
        </>
    )
}