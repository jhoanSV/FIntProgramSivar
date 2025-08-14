import React, { useState, createContext, useContext, useEffect } from "react";
import {
        priceValue,
        dateFormat,
        formatDateForInput,
        calcularDiferenciaDias,
        verificarCamposVacios } from './InternalFunctions';

const TheContext = createContext();

export const useTheContext = () => {
    return useContext(TheContext);
};

export const TheProvider = ({ children }) => {    
    
  const [logged, setLogged] = useState(false);
  const [usD, setUsD] = useState();
  const [section, setSection] = useState('Nueva Venta');
  const [someData, setSomeData] = useState(null);
  const [productCodes, setProductCodes] = useState([]);
  const [invAdAuth, setInvAdAuth] = useState(false);
  const [nItemsCart, setNItemsCart] = useState(0);
  const [subC, setSubC] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saleExternalData, setSaleExternalData] = useState({
            headerSale: {
                'Cliente': '',
                'EnviarA': '',
                'Nit': '',
                'Ciudad': '',
                'Direccion': '',
                'Telefono': '',
                'Celular': '',
                'EMail': '',
                'Barrio': '',
                'Colaborador': '',
                'CodColaborador': '',
                'FOPedido': '',
                'FEntrega': '',
                'TPrecios': 'Contado',
                'TPago':'Contado',
                'FVencimiento': '',
                'ConPaquete': true,
                'Completo': false,
                'CodCliente': '',
                'Iva': false,
                'Nota': ''
            },
            saleList: [
                {
                    'Cantidad': '',
                    'Codigo': '',
                    'Descripcion': '',
                    'VrUnitario': 0,
                    'Iva': 0,
                    'Total': 0,
                    'Disponible': 0
                }
            ]
        });
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    if (usD) {
      const date = new Date()
      setPurchaseData({
        headerData: {
            'Nfactura': '',
            'Date': date,
            'InvoiceDate': formatDateForInput(new Date()),
            'ExpirationDate': formatDateForInput(new Date()),
            'CodSupplier': '',
            'Supplier': '',
            'SupplierPhone': '',
            'SupplierAddress': '',
            'ResponsibleCode': usD.Cod,
            'Responsible': usD.Nombre + ' ' + usD.Apellido,
            'CreditDays': 0,
            'Iva': false,
            'Retefuente': '',
            'Consecutive': '',
            'ContadoOCredito': 'Contado'
        },
        PurchaseList: [
          {
            'Cantidad': '',
            'Codigo': '',
            'Descripcion': '',
            'Costo': 0,
            'Iva': 0,
            'UIva': 0,
            'Total': 0,
            'CostoLP': 0
          }
        ]
      });
    }
  }, [usD]);

  return (
    <TheContext.Provider value={{
        logged, setLogged,
        usD, setUsD,
        section, setSection,
        someData, setSomeData,
        invAdAuth, setInvAdAuth,
        productCodes, setProductCodes,
        subC, setSubC,
        categories, setCategories,
        nItemsCart, setNItemsCart,
        saleExternalData, setSaleExternalData,
        purchaseData, setPurchaseData,
      }}>
      {children}
    </TheContext.Provider>
  );
};