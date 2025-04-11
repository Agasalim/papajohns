import { categoryData, deleteMenu, getLinks, postMenu } from "./service.js";

let menular = document.querySelector(".menular")
let navlinks = document.querySelector(".navlinks")
let formInputs = document.querySelectorAll(".form_input")
let catSelect = document.querySelector("#cat_select");
let linkler = []; // Navbar-daki linkler
let catValue = []; // Form-da select-in valulari
let catData = []; // category massivi

navLinksShow();
selectCatVal();
async function navLinksShow() {
    linkler = await getLinks()
    navlinks.innerHTML = ""
    linkler.forEach(link => {
        navlinks.innerHTML += `<a href="" onclick="menuShow(event, '${link.category}')">${link.category}</a>`
    })
}
async function selectCatVal() {
    catValue = await getLinks();
    catSelect.innerHTML = ""
    catSelect.innerHTML = `<option value="" hidden selected>Categorya secin</option>`
    catValue.forEach(item => {
        catSelect.innerHTML += `<option value="${item.category}">${item.category}</option>`
    })
}

window.linkStyle = function(category){
    let link = [...document.querySelectorAll(".navlinks a")]
    link.forEach(item => {
        item.style.backgroundColor = "transparent"
    })
    if ($("#topPanel").hasClass("height_fit")) {
        let thisCategory = link.find(item => item.textContent == category)
        thisCategory.style.backgroundColor = "lightgreen";
    }
}

window.menuShow = async function (event, category) {
    if (event) event.preventDefault();
    if (category === "kampaniyalar") {
        document.querySelector("#slider").style.display = "initial"
        menular.innerHTML = ""
        localStorage.setItem("SelectedCategory", category);
    }
    else {
        document.querySelector("#slider").style.display = "none"
        menular.innerHTML = ""
        catData = await categoryData(category)
        catData.forEach(menu => {
            menular.innerHTML +=
                `<div class="menu">
                    <img src="${menu.img}"/>
                    <div class="menu_info">
                        <h3 class="menu_name">${menu.title}</h3>
                        <h4 class="menu_category">${menu.category}</h4>
                        <p class="menu_description">${menu.composition}</p>
                        <p class="menu_price">${menu.price} azn</p>
                        <p class="menu_id">${menu.id}</p>
                        <button class="del" onclick="sil('${category}','${menu.id}')">Sil</button>
                        <button class="edit" onclick="edit('${category}','${menu.id}')">Edit</button>
                    </div>
                </div>`
        })
    }
    await linkStyle(category)
    localStorage.setItem("SelectedCategory", category);
    $(".form_box").slideUp()
    if ($("#topPanel").hasClass("height_100")) {
        menuToggle();
    }
}

window.sil = async function (category, id) {
    await deleteMenu(category, id);
    await menuShow(null, category);
    localStorage.setItem("SelectedCategory", category)
}

window.addMenu = async function (e) { //! addEventListener ile yoxlamaq qaldi
    e.preventDefault();
    let newMenu = {
        img: formInputs[0].value,
        title: formInputs[1].value,
        composition: formInputs[2].value,
        price: formInputs[3].value,
        category: catSelect.value
    }
    let category = catSelect.value;
    await postMenu(category, newMenu);
    await menuShow(null, category);
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    localStorage.setItem("SelectedCategory", category);
}

window.onload = async function () {
    navLinksShow();
    selectCatVal();
    let SelectedCategory = localStorage.getItem("SelectedCategory") || "kampaniyalar";
    if (SelectedCategory === "kampaniyalar") {
        document.querySelector("#slider").style.display = "initial"
        menular.innerHTML = ""
    }
    else {
        document.querySelector("#slider").style.display = "none"
        await menuShow(null, SelectedCategory);
    }
};

