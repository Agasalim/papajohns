import { categoryData, deleteMenu, editMenu, getLinks, postMenu } from "./service.js";

let menular = document.querySelector(".menular")
let navlinks = document.querySelector(".navlinks")
let formInputs = document.querySelectorAll(".form_input")
let catSelect = document.querySelector("#cat_select");
let linkler = []; // Navbar-daki linkler
let catValue = []; // Form-da select-in valulari
let catData = []; // category massivi
let globeID;
var notyf = new Notyf({
    duration: 4000,
    position: {
        x: 'center',
        y: 'top',
    }
});
document.querySelector(".my_loader").style.display = "none";

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
window.linkStyle = async function (category) {
    await getLinks();
    let link = [...document.querySelectorAll(".navlinks a")]
    link.forEach(item => {
        item.style.color = "black"
    })
    if ($("#topPanel").hasClass("height_fit")) {
        let thisCategory = link.find(item => item.textContent.toLowerCase() === category.toLowerCase())
        thisCategory.style.color = "red";
    }
}
window.menuShow = async function (event, category) {
    if (event) event.preventDefault();
    if (category === "kampaniyalar") {
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
        catData = await categoryData(category)
        menular.innerHTML = ""
        $(".my_loader").hide();
        catData.forEach(menu => {
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
    await linkStyle(category);
    sessionStorage.setItem("SelectedCategory", category);
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
            await menuShow(null, category);
            await linkStyle(category);
            sessionStorage.setItem("SelectedCategory", category);

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
    await linkStyle(category);
    await menuShow(null, category);
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    $(".edit_btn").show();
    notyf.success('Sizin menu ugurla eleve edildi!');
    sessionStorage.setItem("SelectedCategory", category);
}
window.edit = async function (category, id) {
    $(".form_head").text("Menuda deyisiklik et")
    $(".form_box").slideDown();
    $(".form_img").focus();
    $(".submit").hide();
    $("html, body").animate({ scrollTop: "0" });
    catData = await categoryData(category);
    let element = catData.find(item => item.id == id);
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
    await menuShow(null, category);
    notyf.success('Sizin menunuz ugurla yenilendi!');
    $(".submit").show();
    $(".form_box").slideUp()
    $("html, body").animate({ scrollTop: $(document).height() })
}
window.onload = async function () {
    document.querySelector(".my_loader").style.display = "none";
    navLinksShow();
    selectCatVal();
    let SelectedCategory = sessionStorage.getItem("SelectedCategory") || "kampaniyalar";
    if (SelectedCategory === "kampaniyalar") {
        document.querySelector("#slider").style.display = "initial"
        menular.innerHTML = ""
    }
    else {
        document.querySelector("#slider").style.display = "none"
        await menuShow(null, SelectedCategory);
        await linkStyle(SelectedCategory);
    }
};
window.mainPage = async function () {
    let category = "kampaniyalar";
    await menuShow(null, category);
}

// Her category ucun data yaradilmalidir
// Her emeliyyatda data-ya da elave ve silinmeli ve ya deyisiklik olunmalidir
// Her emeliyyatin icinde fetch emeliyyatini cagirmamaliyiq, sadece data-lardan istifade edilecek 
// sessionStorage- legv olunacaq
// onload legv olunacaq