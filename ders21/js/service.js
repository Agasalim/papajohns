import BASE_URL from "./config.js"

const getAllPizzas = async () => {
    try {
        const res = await fetch(`${BASE_URL.GET}/pizzas`)
        if (!res.ok) {
            throw new Error(`Problem occured related with restApi`)
        }
        const data = await res.json()        
        return data
    } catch (error) {
        console.error(`error message: ${error.message}`);
    }
}

const getPizzaById = async (id) => {
    try {
        const res = await fetch(`${BASE_URL.GET}/pizzas/${id}`)
        if (!res.ok) {
            throw new Error(`Problem occured related with restApi`)
        }
        const data = await res.json()        
        return data
    } catch (error) {
        console.error(`error message: ${error.message}`);
    }
}

const deletePizzaById = async (id) => {
    try {
        const res = await fetch(`${BASE_URL.DELETE}/pizzas/${id}`, {
            method: 'DELETE'
        })
        if (!res.ok) {
            throw new Error(`Problem occured related with restApi`)
        }
        const data = await res.json()        
        return data
    } catch (error) {
        console.error(`error message: ${error.message}`);
    }
}

export {
    getAllPizzas,
    getPizzaById,
    deletePizzaById
}