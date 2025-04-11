import BASE_URL from "./url.js";

let getLinks = async () => {
    try {
        let data = await fetch(`${BASE_URL.GET}/category`)
        if(!data.ok){
            throw new Error("API-da problem var")
        }
        let dataLinks = await data.json()
        return dataLinks;
    }
    catch (error){
        console.error(`error message: ${error}`);
    }
}

let categoryData = async function(category){
    try{
        let url = `${BASE_URL.GET}/${category}`;
        let response = await fetch(url);
        if(!response.ok){
            throw new Error("API-da problem var")
        }
        let data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`error message: ${error}`)
    }
}
 
let deleteMenu = async function(category, id){
    try{
        let url = `${BASE_URL.DELETE}/${category}/${id}`
        console.log("silinme url-si:", url);
        let res = await fetch(url, {
            method: "DELETE"
        });
        if(!res.ok){
            throw new Error (`Silinme method-unda problem var: ${res.status}`)
        }
        console.log(`${category} kategoriyadan ID-si ${id} olan menu silindi!`)
    }
    catch (error) {
        console.error("xeta", error);
    }
}

let postMenu = async function(category, newMenu){
    try{
        let url = `${BASE_URL.POST}/${category}`
        let res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newMenu)
        });
        if(!res.ok){
            throw new Error(`GOndermede problem var: ${res.status}`)
        }
        console.warn(`${category}-ya menu gonderildi`)
    }
    catch (error) {
        console.error(`Ugursuz: ${error}`)
    }
}

export {getLinks, categoryData, deleteMenu, postMenu};
