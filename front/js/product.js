// récupération de l'id du produit via l'URL
//-------------------------------------------
const params = new URLSearchParams(document.location.search);
const id = params.get("_id")
//console.log(id)

//--------------------------------------------------------------------------
// Récupération des produits de l'api et traitement des données (voir script.js)
//-------------------------------------------------------
fetch("http://localhost:3000/api/products/" + id)
    .then((res) => res.json())
    .then((objetProduit) => {
        lesProduits(objetProduit);
    })
    .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1> Suite à un problème technique le canapé ne s'affiche pas correctement, veuillez essai plus tard</h1>";
        //console.log("erreur 404, sur ressource api: " + err);
    });


let articleClient = {};
articleClient.id = id;


// fonction d'affichage du produit de l'api
function lesProduits(produit) {
    let imageAlt = document.querySelector("article div.item__img");
    let titre = document.querySelector("#title");
    let prix = document.querySelector("#price");
    let description = document.querySelector("#description");
    let couleurOption = document.querySelector("#colors")

    imageAlt.innerHTML = `<img src ="${produit.imageUrl}" alt= "${produit.altTxt}">`
    titre.textContent = produit.name;
    prix.textContent = produit.price;
    description.textContent = produit.description;
    for (let couleur of produit.colors) {
        couleurOption.innerHTML += `<option value="${couleur}" > ${couleur} </option>`;
    }

}

let choixProduit = document.querySelector("#addToCart");
choixProduit.addEventListener("click", async () => {  //on met async pour tuiliser await sur addPanier

    let choixQuantite = document.querySelector("#quantity").value;
    let choixCouleur = document.querySelector("#colors").value;
    if (
        choixQuantite < 1 ||
        choixQuantite > 100 ||
        choixQuantite === undefined ||
        choixCouleur === "" ||
        choixCouleur === undefined
    ) {
        // active alert
        alert("pour valider le chois de cet article, veuillez renseigner une couleur, et /ou une quantité valide entre 1 et 100")
    } else {
        articleClient.quantite = parseInt(choixQuantite);
        articleClient.couleur = choixCouleur;
        // montre panier 
        await addPanier(articleClient);
        alert("l'article a bien été ajouté au panier");
        window.location.assign("cart.html")
    }
})
