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
        SupplierList,
        ListOfEntrants,
        PurchaseList,
        NewSale,
        Entered,
        Status,
        PPSales,
        CreditNotes,
        PendingList
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
            <Route path='/ListOfEntrants' element={ <ListOfEntrants/>}/>
            <Route path='/Purchaselist' element={ <PurchaseList/>}/>
            <Route path='/NewSale' element={ <NewSale/>}/>
            <Route path='/Entered' element={ <Entered/>}/>
            <Route path='/Status' element={ <Status/>}/>
            <Route path='/ppsales' element={ <PPSales/>}/>
            <Route path='/creditnotes' element={ <CreditNotes/>}/>
            <Route path='/PendingList' element={ <PendingList/>}/>
        </Routes>
    );
}