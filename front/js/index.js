//---------------------------------------
// récupération des produits de l'API
//----------------------------------------

fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        //console.log(objetProduits);
        afficherProduitsCreateElement(objetProduits);
    })
    .catch((err) => {
        document.querySelector("#items").innerHTML ="<h1>Suite à un problème technique, les produits sont indisponibles pour le moment, désolé pour la gêne occasionnée,veuillez revenir ultérieurement</h1>";
        console.log("erreur 404, sur ressource api: " + err);
    });
//--------------------------------------------
// fonction d'affichage des produits de l'api sur la page index
//----------------------------------------------------------------------
//affichage des produits version innerHtml
function afficherProduitsInnerHtml(produits) {
    let zoneArticle = document.querySelector("#items");
    let contenu = "";
    for (let article of produits) {
        contenu += `<a href="./product.html?_id=${article._id}">
                                    <article>
                                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                                    <h3 class="productName">${article.name}</h3>
                                    <p class="productDescription">${article.description}</p>
                                    </article>
                                    </a>`;
    }
    zoneArticle.innerHTML = contenu;
}


//affichage des produits version createElement
function afficherProduitsCreateElement(produits) {
    for (let article of produits) {
        let productLink = document.createElement("a");
        productLink.href = './product.html?_id=' + article._id;

        let productArticle = document.createElement("article");

        let productImg = document.createElement("img");
        productImg.src = article.imageUrl;
        productImg.alt = article.altTxt;

        let productTitle = document.createElement("h3");
        productTitle.classList.add("productName");
        productTitle.innerText = article.name;

        let productText = document.createElement("p");
        productText.classList.add("ProductDescription");
        productText.innerHTML = article.description;

        productArticle.appendChild(productImg);
        productArticle.appendChild(productText);
        productArticle.appendChild(productTitle);
        productLink.appendChild(productArticle);

        document.getElementById("items").appendChild(productLink);

    }

}
