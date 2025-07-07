const API_INT = 'http://192.168.1.110:5000/int';

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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
}

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