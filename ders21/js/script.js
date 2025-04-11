import { deletePizzaById, getAllPizzas } from "./service.js";

let data = []

async function getPizzas() {
    data = await getAllPizzas()
    console.log(data);
    printCards()
}
getPizzas()


function printCards() {
    data.forEach(item => {
        document.querySelector('#cards').innerHTML += `<div class="max-w-xs p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50">
                                <img src="${item.img}" alt="" class="object-cover object-center w-full rounded-md h-72 dark:bg-gray-500">
                                <div class="mt-6 mb-2">
                                    <span class="block text-xs font-medium tracki uppercase dark:text-violet-400">Quisque</span>
                                    <h2 class="text-xl font-semibold tracki">${item.name}</h2>
                                </div>
                                <p class="dark:text-gray-100">Mauris et lorem at elit tristique dignissim et ullamcorper elit. In sed feugiat mi. Etiam ut lacinia dui.</p>
                                <a onclick="handleDelete(event, ${item.id})" class="border bg-[red] rounded-[5px] p-3">delete</a>
                            </div>`
    });
}

window.handleDelete = function(event,id) {
    event.preventDefault()
    deletePizzaById(id)
}