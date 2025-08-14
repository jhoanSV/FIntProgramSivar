import React, { useEffect, useState, useRef } from 'react';

export const TheInput = ({
    id = '',
    className = '',
    val = '', // Default value (unformatted)
    numType = 'real', // 'nat', 'ent', 'real'
    onChange = () => {}, // Renamed to follow common React prop naming conventions
    onBlur = () => {},
    onFocus = () => {},
    autoFocus = false,
    style = {}, // Renamed to follow common React prop naming conventions
    placeholder = '', // Renamed to follow common React prop naming conventions
    min = null, // Renamed to follow common React prop naming conventions
    max = null, // Renamed to follow common React prop naming conventions
    select = false,
    disabled = false,
    inputRef = null // Renamed to avoid conflict with React's built-in 'ref'
}) => {
    // We'll manage two states:
    // 1. `displayValue`: What the user sees in the input (formatted).
    // 2. `realValue`: The actual numeric value (unformatted) that you'd use internally.
    const [displayValue, setDisplayValue] = useState('');
    const [realValue, setRealValue] = useState(val);
    const initialRender = useRef(true); // To handle initial formatting without triggering onChange

    // Utility function to format numbers for display
    const formatNumberForDisplay = (number) => {
        if (number === null || number === undefined || number === '') return '';
        // Convert to a string if it's not already, and replace commas with dots for proper parsing
        const stringNumber = String(number).replace(/,/g, '.');
        const parsedNumber = parseFloat(stringNumber);

        if (isNaN(parsedNumber)) return '';
        // Use 'de-DE' locale for thousands as dots and decimal as comma
        return Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(parsedNumber);
    };

    // Utility function to clean up the input for internal numeric value
    const cleanNumberForInternalUse = (input) => {
        if (input === null || input === undefined || input === '') return '';
        // Remove thousands separators (dots) and replace comma decimal with dot decimal
        let cleaned = String(input).replace(/\./g, '').replace(/,/g, '.');

        // Handle negative sign correctly if it's the only character or at the beginning
        if (cleaned === '-' && numType !== 'nat') return '-';
        if (cleaned === '') return '';

        let parsed = parseFloat(cleaned);

        // Apply min/max constraints if they exist
        if (!isNaN(parsed)) {
            if (min !== null && parsed < min) {
                parsed = min;
            }
            if (max !== null && parsed > max) {
                parsed = max;
            }
        } else {
            // If it's not a valid number after cleaning (e.g., "abc"), return 0 or empty string based on your preference
            // For now, let's return 0 for invalid numbers to ensure a numeric value.
            parsed = 0;
        }

        return String(parsed).replace(/\./g, ','); // Convert back to comma for internal string consistency if desired, or keep as dot for true number
    };

    // Initialize displayValue and realValue when the component mounts or `val` prop changes
    useEffect(() => {
        if (initialRender.current) {
            // On initial render, just set the display value based on the initial `val` prop.
            // We don't want to trigger onChange yet.
            const initialFormatted = formatNumberForDisplay(val);
            setDisplayValue(initialFormatted);
            setRealValue(String(val).replace(/,/g, '.')); // Ensure realValue is a string with dot for decimal
            initialRender.current = false;
        } else {
            // If val changes from outside after initial render, update both
            const newFormatted = formatNumberForDisplay(val);
            setDisplayValue(newFormatted);
            setRealValue(String(val).replace(/,/g, '.')); // Ensure realValue is a string with dot for decimal
            onChange(String(val).replace(/,/g, '.')); // Trigger onChange with the updated real value
        }
    }, [val]);

    const handleChange = (e) => {
        let inputValue = e.target.value;

        // Clean the input to get a raw value for validation and internal storage
        let cleanedValueForReal = inputValue.replace(/\./g, '').replace(/,/g, '.'); // Remove all dots and replace comma with dot

        // Basic character validation
        const allowedCharsReal = {
            'nat': /^\d*$/,
            'ent': /^-?\d*$/,
            'real': /^-?\d*[,.]?\d*$/ // Allows one comma or dot for decimals
        };

        if (!allowedCharsReal[numType].test(inputValue.replace(/\./g, '').replace(/,/g, '.'))) {
            // If the input doesn't match the allowed characters, don't update state.
            // This prevents invalid characters from being typed.
            return;
        }

        // Handle comma/dot for real numbers
        if (numType === 'real') {
            // Allow only one decimal separator (comma or dot)
            const parts = inputValue.split(/[.,]/);
            if (parts.length > 2) {
                // If more than one decimal separator, don't update
                return;
            }
        }
        
        // Update the display value immediately as the user types
        setDisplayValue(inputValue);
        
        // Update the real value, making sure it's parsable as a number
        let numericRealValue = parseFloat(cleanedValueForReal);
        if (isNaN(numericRealValue) && cleanedValueForReal !== '-' && cleanedValueForReal !== '') {
            numericRealValue = 0; // Default to 0 if not a valid number
        }

        // Pass the raw numeric string (with dot as decimal) to the onChange handler
        // If it's just '-' or empty, pass that directly
        const valueToPass = isNaN(numericRealValue) && cleanedValueForReal !== '-' ? '' : String(numericRealValue);
        setRealValue(valueToPass);
        onChange(valueToPass);
    };

    const handleFocus = (e) => {
        // Remove formatting when focused
        let withoutFormat = String(e.target.value).replace(/\./g, ''); // Remove thousands separators
        withoutFormat = withoutFormat.replace(/,/g, '.'); // Convert comma to dot for consistent internal parsing
        setDisplayValue(withoutFormat);
        onFocus(e);
        if (select) {
            e.target.select();
        }
    };

    const handleBlur = (e) => {
        let currentRawValue = e.target.value;
        // Clean and parse the value from the input when blurring
        let cleaned = currentRawValue.replace(/\./g, '').replace(/,/g, '.');
        let parsedValue = parseFloat(cleaned);

        if (isNaN(parsedValue)) {
            parsedValue = 0; // Default to 0 or an empty string if not a valid number after cleaning
        }

        // Apply min/max constraints on the actual numeric value
        if (min !== null && parsedValue < min) {
            parsedValue = min;
        }
        if (max !== null && parsedValue > max) {
            parsedValue = max;
        }
        
        const finalFormattedValue = formatNumberForDisplay(parsedValue);
        setDisplayValue(finalFormattedValue);
        
        // Ensure realValue is updated with the constrained and validated number (as string with dot for decimal)
        const finalRealValue = String(parsedValue);
        setRealValue(finalRealValue);
        onChange(finalRealValue); // Trigger onChange with the final real value
        onBlur(e);
    };

    return (
        <input
            type='text'
            id={id}
            style={style}
            // min and max attributes on type='text' input don't enforce numeric limits directly.
            // We handle min/max logic in JavaScript.
            className={className}
            value={displayValue} // The value displayed to the user
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus={autoFocus}
            disabled={disabled}
            ref={inputRef}
        />
    );
};