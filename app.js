import { categoryData, deleteMenu, editMenu, getLinks, postMenu } from "./service.js";

let menular = document.querySelector(".menular")
let navlinks = document.querySelector(".navlinks")
let formInputs = document.querySelectorAll(".form_input")
let catSelect = document.querySelector("#cat_select");
let link = [];
let categoryDataObj = {};
let allCategory = []; // Navbar-daki linkler
let globeID;
var notyf = new Notyf({
    duration: 4000,
    position: {
        x: 'center',
        y: 'top',
    }
});
allData();
document.querySelector("#slider").style.display = "none"
window.onload = async function(){
    document.querySelector("#slider").style.display = "none";
    document.querySelector(".my_loader").style.display = "initial";
    await allData();
    let selected = sessionStorage.getItem("SelectedCategory");
    if (selected) {
        menuShow(null, selected);
    }
}
async function allData() {
    allCategory = await getLinks();
    for (let cat of allCategory) {
        if (cat.category !== "kampaniyalar") {
            categoryDataObj[cat.category] = await categoryData(cat.category);
        }
    }
    navLinksShow();
    selectCatVal();
    document.querySelector("#slider").style.display = "initial"
    document.querySelector(".my_loader").style.display = "none";
}
function navLinksShow() {
    navlinks.innerHTML = ""
    allCategory.forEach(link => {
        navlinks.innerHTML += `<a href="" onclick="menuShow(event, '${link.category}')">${link.category}</a>`
    })
}
function selectCatVal() {
    catSelect.innerHTML = ""
    catSelect.innerHTML = `<option value="" hidden selected>Categorya secin</option>`
    allCategory.forEach(item => {
        catSelect.innerHTML += `<option value="${item.category}">${item.category}</option>`
    })
}
window.linkStyle = function () {
    let selectedLink = sessionStorage.getItem("SelectedCategory");
    setTimeout(() => {
        link = [...document.querySelectorAll(".navlinks a")]
        console.log(link)
        link.forEach(item => {
            item.style.color = "black"
        })
        if ($("#topPanel").hasClass("height_fit")) {
            let thisCategory = link.find(item => item.textContent.toLowerCase() === selectedLink.toLowerCase())
            thisCategory.style.color = "red";
        }
    }, 50);
}
window.menuShow = function (event, category) {
    if (event) event.preventDefault();
    if (category === "kampaniyalar" || !category) {
        document.querySelector("#slider").style.display = "initial"
        menular.innerHTML = ""
        document.querySelector(".my_loader").style.display = "none";
    }
    else {
        $(".my_loader").show();
        $(".form_box").slideUp()
        if ($("#topPanel").hasClass("height_100")) {
            menuToggle();
        }
        document.querySelector("#slider").style.display = "none"
        menular.innerHTML = ""
        $(".my_loader").hide();
        categoryDataObj[category].forEach(menu => {
            menular.innerHTML +=
                `<div class="menu">
                    <img src="${menu.img}" onerror="this.src='img/noimages.jpeg'"/>
                    <div class="menu_info">
                        <h3 class="menu_name">${menu.title}</h3>
                        <h4 class="menu_category">${menu.category}</h4>
                        <p class="menu_description">${menu.composition}</p>
                        <p class="menu_price">${menu.price} azn</p>
                        <p class="menu_id">ID: ${menu.id}</p>
                        <div class="menu_btns">
                            <button class="del" onclick="sil('${category}','${menu.id}')">Sil</button>
                            <button class="edit" onclick="edit('${category}','${menu.id}')">Edit</button>
                        </div>
                    </div>
                </div>`
        })
    }
    $("html, body").animate({ scrollTop: 0 })
    sessionStorage.setItem("SelectedCategory", category);
    linkStyle();
}
window.sil = function (category, id) {
    Swal.fire({
        title: 'Silmək istədiyinizə əminsiz?',
        text: "Geri qaytarmaq mümkün olmayacaq!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Bəli, silinsin!',
        cancelButtonText: 'Xeyr, ləğv et'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteMenu(category, id);
            categoryDataObj[category] = categoryDataObj[category].filter(item => item.id !== id);
            menuShow(null, category);
            linkStyle(category);
            Swal.fire({
                title: 'Ugurlu!',
                text: 'Sizin menyu uğurla silindi!',
                icon: 'success',
                confirmButtonText: 'Bağla'
            });
        }
    });
}
function getValues() {
    let newMenu = {
        img: formInputs[0].value,
        title: formInputs[1].value,
        composition: formInputs[2].value,
        price: formInputs[3].value,
        category: catSelect.value
    }
    return newMenu;
}
window.addMenu = async function (e) {
    e.preventDefault();
    let newMenu = getValues();
    let category = catSelect.value;
    await postMenu(category, newMenu);
    categoryDataObj[category].push(newMenu);
    menuShow(null, category);
    linkStyle(category);
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    $(".edit_btn").show();
    notyf.success('Sizin menu ugurla eleve edildi!');
}
window.edit = async function (category, id) {
    $(".form_head").text("Menuda deyisiklik et")
    $(".form_box").slideDown();
    $(".form_img").focus();
    $(".submit").hide();
    $("html, body").animate({ scrollTop: "0" });
    let element = categoryDataObj[category].find(item => item.id == id);
    formInputs[0].value = element.img;
    formInputs[1].value = element.title;
    formInputs[2].value = element.composition;
    formInputs[3].value = element.price;
    catSelect.value = category;
    globeID = id;
}
window.menuYenile = async function (e) {
    e.preventDefault();
    let editedMenu = getValues()
    let category = catSelect.value
    await editMenu(category, editedMenu, globeID)
    let elementIndex = categoryDataObj[category].findIndex(item => item.id == globeID);
    categoryDataObj[category][elementIndex] = { ...editedMenu, id: globeID };
    menuShow(null, category);
    notyf.success('Sizin menunuz ugurla yenilendi!');
    $(".submit").show();
    $(".form_box").slideUp()
    $("html, body").animate({ scrollTop: $(document).height() })
}
window.mainPage = async function () {
    let category = "kampaniyalar";
    menuShow(null, category);
}


