import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Newcustomer,
        NewPurchase,
        Newsupplier,
        NewWorker,
        NewProduct,
        Login,
        PriceList,
        Customerlist,
        SupplierList
} from "../Pages";

export function RoutesComponent() {
    return (      
        <Routes>
            <Route path='/' element={ <Login/> }/>
            <Route path='/NewCustomer' element={ <Newcustomer/>}/>
            <Route path='/Newsupplier' element={ <Newsupplier/>}/>
            <Route path='/NewWorker' element={ <NewWorker/>}/>
            <Route path='/Newproduct' element={ <NewProduct/>}/>
            <Route path='/PriceList' element={ <PriceList/>}/>
            <Route path='/Customerlist' element={ <Customerlist/>}/>
            <Route path='/SupplierList' element={ <SupplierList/>}/>
            <Route path='/NewPurchase' element={ <NewPurchase/>}/>
        </Routes>
    );
}