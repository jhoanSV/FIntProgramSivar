const API_INT = 'http://192.168.1.111:5000/int';

export const ClientList = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/clientlist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const RutesList = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/routeslist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const AdvisorsList = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/advisorslist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const SupplierListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/supplierlist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const WorkerListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/workerlist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const CategoryListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/categorylist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
};

export const newCategoryApi = async(categoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newcategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(categoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError newCategoryApi: '+ error)
    }
};

export const updateCategoryApi = async(categoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/updatecategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(categoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError updateCategoryApi: '+ error)
    }
};

export const deleteCategoryApi = async(categoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/detelecategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(categoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError deleteCategoryApi: '+ error)
    }
};

export const SubCategoryListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/subcategorylist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError SubCategoryListApi: '+ error)
    }
};

//!SubCategory
export const newSubCategoryApi = async(subCategoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newsubcategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(subCategoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError newSubCategoryApi: '+ error)
    }
}

export const updateSubCategoryApi = async(SubCategoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/updatesubcategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(SubCategoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError updateSubCategoryApi: '+ error)
    }
}

export const deleteSubCategoryApi = async(subCategoryData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/detelesubcategory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(subCategoryData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError deleteCategoryApi: '+ error)
    }
}
//!Product
export const GetProductListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/getproductlist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError GetProductListApi: '+ error)
    }
}

export const ClasesListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/claseslist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError ClasesListApi: '+ error)
    }
}

export const otherSupplierApi = async(othersupplierData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/othersupplier`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(othersupplierData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const postUpdateProductApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/postupdateproduct`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const quiantityAndDisponibleApi = async(Cod) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/quiantityanddisponible`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(Cod)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const checkLogindDataApi = async(Dataloging) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/checklogindata`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(Dataloging)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError checklogindataApi: '+ error)
    }
}

export const quiantityProductListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/quiantityproductList`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError quiantityProductListApi: '+ error)
    }
}

//!Client
export const newClientApi = async(DataClient) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newclient`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(DataClient)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError newClientApi: '+ error)
    }
}

export const updateClientApi = async(DataClient) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/updateclient`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(DataClient)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError updateClientApi: '+ error)
    }
}

export const newSupplierApi = async(DataSupplier) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newsupplier`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(DataSupplier)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError newSupplierApi: '+ error)
    }
}

export const updSupplierApi = async(DataSupplier) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/updatesupplier`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(DataSupplier)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError updSupplierApi: '+ error)
    }
}

export const getEntrantsListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/entrantslist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getEntrantsListApi: '+ error)
    }
};
//! Purchase
export const getPurchaselistApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/purchaselist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getPurchaselistApi: '+ error)
    }
};

export const EnteredListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/enteredlist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError EnteredListApi: '+ error)
    }
};

export const NewPurchaseApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newpurchase`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError NewPurchaseApi: '+ error)
    }
}

export const StatusListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/statuslist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError StatusListApi: '+ error)
    }
}

export const PPPurchaseApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/partialpaymentpurchase`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError PPPurchaseApi: '+ error)
    }
}

export const PPPurchaseDetailApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/pppurchase`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError PPPurchaseDetailApi: '+ error)
    }
}

export const postMakePPApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/postmakepp`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError postMakePPApi: '+ error)
    }
}

export const getPPSalesApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/ppsales`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError StatusListApi: '+ error)
    }
};

export const getPPSalesBalancesApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/ppsalesbalances`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError StatusListApi: '+ error)
    }
};

export const getCreditNotesApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/creditnotes`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError StatusListApi: '+ error)
    }
};

export const getPreparationListApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/preparationlist`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getPreparationListApi: '+ error)
    }
};

export const postStateFlowApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/stateflow`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError postStateFlowApi: '+ error)
    }
};

export const getPendingListApi = async() => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/pendinglist`,{
            method: 'GET'
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getPendingListApi: '+ error)
    }
};

export const onTheRouteApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/onTheRoute`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError onTheRouteApi: '+ error)
    }
};

export const getSpecificPurchaseApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/specificpurchase`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getSpecificPurchaseApi: '+ error)
    }
};

export const getAliasListApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/aliaslist`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError getAliasListApi: '+ error)
    }
};

export const postNewAliasApi = async(updateproductData) => {
    //Return the list of all the clients
    try {
        const res = await fetch(`${API_INT}/newalias`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproductData)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError postNewAliasApi: '+ error)
    }
};