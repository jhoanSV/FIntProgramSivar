import React, { useEffect, useRef, useState } from 'react';
import { priceValue, dateFormat } from '../../InternalFunctions';
export const TheInput = ({
    id='',//*id to set an id, if isnt provided then id is empty
    className='',//*class to set an class, if isnt provided then id is empty
    val=0,//*here comes the defaul value, if isnt provided then value is empty
    numType='real',//*numType to define the number type between naturals(nat), integers(ent), reals(real). If is not provided then will be real
    onchange=false,//*next three props are to set an onchange, onblur and onfocus, pls set like this (e)=>{function(e)} where e is the value of the input. e is not really necesary
    onblur=false,
    onfocus=false,
    autofocus=false,
    sTyle={},
    pholder='',
    Min=null,
    Max=null,
    select=false,
    disabled=false,
    Ref= null}) => {

    const [value, setValue] = useState(val);
    const [displayValue, setDisplayValue] = useState(priceValue(val));
    const [realValue, setRealValue] = useState(val);
    

    const Formater = (number) =>{
        //*it gives a number format        
        if (!number) return ''
        const numberfromat = Number(number.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };
    
    const handleChange1 = (e) => {
        let inputValue = String(e.target.value)

        // Clean the input to get a raw value for validation and internal storage
        let cleanedValueForReal = inputValue.replace(/\./g, '')//.replace(/,/g, '.'); // Remove all dots and replace comma with dot

        // Basic character validation
        const allowedCharsReal = {
            'nat': /^\d*$/,
            'ent': /^-?\d*$/,
            'real': /^-?\d*[,.]?\d*$/ // Allows one comma or dot for decimals
        };
        if (!allowedCharsReal[numType].test(inputValue.replace(/\./g, ''))){//}.replace(/,/g, '.'))) {
            // If the input doesn't match the allowed characters, don't update state.
            // This prevents invalid characters from being typed.
            return;
        }

        // Handle comma/dot for real numbers
        /*if (numType === 'real') {
            // Allow only one decimal separator (comma or dot)
            const parts = inputValue.split(/[.,]/);
            if (parts.length > 2) {
                // If more than one decimal separator, don't update
                return;
            }
        }
        
        // Update the display value immediately as the user types*/
        setDisplayValue(cleanedValueForReal);
        
        /*// Update the real value, making sure it's parsable as a number
        let numericRealValue = parseFloat(cleanedValueForReal);
        if (isNaN(numericRealValue) && cleanedValueForReal !== '-' && cleanedValueForReal !== '') {
            numericRealValue = 0; // Default to 0 if not a valid number
        }*/

        // Pass the raw numeric string (with dot as decimal) to the onChange handler
        // If it's just '-' or empty, pass that directly
        /*const valueToPass = isNaN(numericRealValue) && cleanedValueForReal !== '-' ? '' : String(numericRealValue);
        setRealValue(valueToPass);*/

        if(onchange){
            onchange(realValue)
        }
    }

    const handleChange = (e) => {
        //gives the format of the number
        const characters = (numType==='nat') ? //*for natural numbers
            ['1','2','3','4','5','6','7','8','9','0','']
            : (numType==='ent') ? //*for integer numbers
            ['1','2','3','4','5','6','7','8','9','0','-','']
            : (numType==='real') && //*for real numbers
            ['1','2','3','4','5','6','7','8','9','0','-','.',',','']
        if (characters.includes(e.nativeEvent.data) || e.nativeEvent.data===null) {
            let a = e.target.value;
            //if(a.slice(-1) === '.') a = a.slice(0, -1) + ','; //*If you enter ".", it changes to ","
            if(e.nativeEvent.data === '.') a = a.replace(/\./g, ",") //*If you enter ".", it changes to ","
            
            /*if (Min !== null && a < Min) {
                a = Min
            }
            if (Max !== null && a > Max) {
                a = Max
            }*/
            setValue(a)
            if(onchange){
                onchange(a)
                onchange(realValue)
            }
        }
    }

    const handleBlur = (e) => {
        //*gives a number format at the moment of leave the element
        const formattedValue = Formater(e.target.value);
        if (formattedValue==='NaN') {
            setValue(0)
            if(onblur)onblur(0)
        }else{
            setValue(formattedValue)            
            if(onblur)onblur(formattedValue)
        }
        console.log("Min" + Min + "Max" + Max)
        if (Min !== null && e.target.value < Min) {
            e.target.value = Min
        }
        if (Max !== null && e.target.value > Max) {
            e.target.value = Max
        }
        setValue(e.target.value)
    };

    const handleFocus = (e) => {
        /*//*remove the format while the user is focused on the element
        if(value){
            const theValue = e.target.value.toString()
            let withoutFormat = theValue.replace(/\./g, '')
            setValue(withoutFormat)
            if(onfocus)onfocus(withoutFormat)
        }
        if(select){
            e.target.select();
        }*/
    };

    useEffect(() => {
        setValue(val)
        // eslint-disable-next-line
    }, [val]);

    return (
        <input
            type='text'
            id={id}
            style={sTyle}
            className={className}
            value={displayValue}
            placeholder={pholder}
            onChange={(e)=>{handleChange1(e)}}
            onFocus={(e)=>{handleFocus(e)}}
            onBlur={(e)=>{handleBlur(e)}}
            autoFocus={autofocus}
            disabled={disabled}
            ref={Ref}
        />

    );
}