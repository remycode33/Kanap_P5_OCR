// VARIABLE UTILISÉE SUR TOUTE LA PAGE :
// récupération du LocalStorage
let panier = [];
// Tableau avec tout les produits de l'API
let allProductsApi = []

//variable qui recueillera le numéro de commande
let orderId = null

//VARIABLES UTILISÉE POUR LA VERIFICATION DU FORMULAIRE
const form = document.querySelector(".cart__order__form")
const formDiv = document.querySelectorAll(".cart__order__form__question")
//Regex
const regexText = /^[a-z àâäçéèêëîïôöùûüÿ'-]+$/i
const regexAddress = /^[0-9a-z àâäçéèêëîïôöùûüÿ'-]+$/i
const regexEmail = /^[\w_.-]+@[\w-]+\.[a-z]{2,4}$/i
//Variable pour la vérification avant l'envoi du formulaire
//Si une des variables est null : pas d'envoi à l'API
//Si la les 5 variables sont afféctées d'une valeur : envoi de la requête à l'API
let firstNameValue = null
let lastNameValue = null
let addressValue = null
let cityValue = null
let emailValue = null


//CODE PRINCIPAL
// Initiallisation de l'affichage et de la modification du panier
async function cartInit() {
    await fetchProducts()
    await affichageProduits()
    changeQuantity()
    deleteProduct()
  }
  
cartInit()


// Récuppération des données de l'API
async function fetchProducts() {
    await fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => (allProductsApi = data))
      .catch((error) => {
        console.log(
          "Il y a eu un problème avec l'opération fetch : " + error.message
        )
      })
  }


  async function affichageProduits() {
    const panierCart = document.getElementById("cart__items");
    panier = getPanier()
    let panierHtml = [];

    // si il y a un panier avec une taille differente de 0 (donc supérieure à 0)
    if (panier && panier.length > 0) {
        //Si panier pas vide alors rajoute un produit
        for (i = 0; i < panier.length; i++) {
            //const produit = await getProduitById(panier[i].id);

            
            //on va chercher dans le tableau allProductsApi les données du canapé séléctionné
            const produit = allProductsApi.find(
                (product) => product._id == panier[i].id
              ) 
            //console.log(produit)


              //panier.find(p => p.id == produit.id) && panier.find(p => p.couleur == produit.couleur)

            //const TailleProduit = Object.entries(produit).length;
            //console.log(TailleProduit)
            panierHtml += `
                <article class="cart__item" data-id="${panier[i].id}" data-color="${panier[i].couleur}">
                <div class="cart__item__img">
                    <img src=${produit.imageUrl} alt=${produit.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${produit.name}</h2>
                        <p>${panier[i].couleur}</p>
                        <p>${produit.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input data-id=${panier[i].id}  data-color=${panier[i].couleur} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${panier[i].quantite}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p data-id=${panier[i].id}  data-color=${panier[i].couleur} class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
                </article>`;
        }
        panierCart.insertAdjacentHTML("beforeend", panierHtml);

        displayQuantityPrice()

        //AffichagetotalProduit();


        //GestionQuantity();
        //deleteProduct();

    } else {
        // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML =
            "Vous n'avez pas d'article dans votre panier";

    }

}

//Calcul de la quantité
function sumQuantity(array) {
    let totalQuantity = 0
    if (panier.length > 0) {
      totalQuantity = array.map((item) => item.quantite).reduce((a, b) => a + b)
      return totalQuantity
    } else {
      return totalQuantity
    }
  }
  
  //Calcul du prix
  function sumPrice() {
    let totalPrice = 0
    for (let i = 0; i < panier.length; i++) {
      const selectedProduct = allProductsApi.find(
        (product) => product._id == panier[i].id
      ) 
      totalPrice += panier[i].quantite * selectedProduct.price
    }
    return totalPrice
  }
  
  // Afichage de la quantité et du prix
  function displayQuantityPrice() {
    const totalQuantityContainer = document.getElementById("totalQuantity")
    const totalPriceContainer = document.getElementById("totalPrice")
    totalQuantityContainer.textContent = sumQuantity(panier)
    totalPriceContainer.textContent = sumPrice()
  }





// Changer la quantité
function changeQuantity() {
    const itemInputsQuantity = document.querySelectorAll(".itemQuantity")
    itemInputsQuantity.forEach((itemInput) => {
      itemInput.addEventListener("change", (e) => {
        let newValue = parseInt(e.target.value)
        let articleSelected = itemInput.closest("article")
        let getIdForChange = articleSelected.dataset.id
        let getColorForChange = articleSelected.dataset.color
        let foundProductFromPanier = panier.find(
          (p) => (p.id && p.couleur) === (getIdForChange && getColorForChange)
        )
        console.log(foundProductFromPanier)
        if (newValue <= 0 || newValue > 100) {
          alert("Veuillez séléctionner une quantité entre 1 et 100")
          e.target.value = 1
        } else {
          foundProductFromPanier.quantite = newValue
          savePanier(foundProductFromPanier)
          displayQuantityPrice()
        }
      })
    })
  }
  
  // Supprimer un produit
  function deleteProduct() {
    const itemButtonsDelete = document.querySelectorAll(".deleteItem")
    itemButtonsDelete.forEach((itemButton) => {
      itemButton.addEventListener("click", (e) => {
        let articleSelected = itemButton.closest("article")
        let getIdForDelete = articleSelected.dataset.id
        let getColorForDelete = articleSelected.dataset.color
        if (confirm("Souhaitez-vous vraiment supprimer ce produit")) {
          panier = panier.filter(
            (p) => (p.id && p.color) !== (getIdForDelete && getColorForDelete)
          )
          savePanier()
          displayQuantityPrice()
          articleSelected.remove()
        }
        return
      })
    })
  }














//Controle du formulaire
function checker(value, regex) {
    if (value.match(regex)) {
      return true
    } else {
      return false
    }
  }
  
  formDiv.forEach((input) => {
    input.addEventListener("input", (e) => {
      switch (e.target.id) {
        case "firstName":
          const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
          if (checker(e.target.value, regexText) == false) {
            firstNameErrorMsg.textContent = "Veuillez rentrer un prénom valide"
            firstNameValue = null
          } else {
            firstNameErrorMsg.textContent = ""
            firstNameValue = e.target.value
          }
          break
  
        case "lastName":
          const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
          if (checker(e.target.value, regexText) == false) {
            lastNameErrorMsg.textContent = "Veuillez rentrer un nom valide"
            lastNameValue = null
          } else {
            lastNameErrorMsg.textContent = ""
            lastNameValue = e.target.value
          }
          break
  
        case "address":
          const addressErrorMsg = document.getElementById("addressErrorMsg")
          if (checker(e.target.value, regexAddress) == false) {
            addressErrorMsg.textContent = "Veuillez rentrer une adresse valide"
            addressValue = null
          } else {
            addressErrorMsg.textContent = ""
            addressValue = e.target.value
          }
          break
  
        case "city":
          const cityErrorMsg = document.getElementById("cityErrorMsg")
          if (checker(e.target.value, regexText) == false) {
            cityErrorMsg.textContent = "Veuillez rentrer un nom de ville valide"
            cityValue = null
          } else {
            cityErrorMsg.textContent = ""
            cityValue = e.target.value
          }
          break
  
        case "email":
          const emailErrorMsg = document.getElementById("emailErrorMsg")
          if (checker(e.target.value, regexEmail) == false) {
            emailErrorMsg.textContent = "Veuillez rentrer un email valide"
            emailValue = null
          } else {
            emailErrorMsg.textContent = ""
            emailValue = e.target.value
          }
          break
        default:
          null
      }
    })
  })
  


// Envoi des données vers l'API
async function fetchPostRequest(dataToSend) {
    await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        Accept: "application/json; charset=UTF-8",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => (orderId = data.orderId))
      .catch((error) => {
        console.log(
          "Il y a eu un problème avec l'opération fetch (POST) : " + error.message
        )
      })
  }



  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    if (panier.length === 0) {
      alert("votre panier est vide. Veuillez ajouter des produits")
      //window.location.href = "./index.html"
    } else if (
      //si toute les variables "Champs" ne sont pas null
      firstNameValue &&
      lastNameValue &&
      addressValue &&
      cityValue &&
      emailValue
    ) {
      //Création du tableau de produit
      let arrayIdProducts = []
      for (let i = 0; i < panier.length; i++) {
        arrayIdProducts.push(panier[i].id)
      }
      //Création du corps de la requête contenant l'objet contact et le tableau de produits
      let bodyRequest = {
        contact: {
          firstName: firstNameValue,
          lastName: lastNameValue,
          address: addressValue,
          city: cityValue,
          email: emailValue,
        },
        products: arrayIdProducts,
      }
      //Envoi de la requete POST
      await fetchPostRequest(bodyRequest)
      //Vider le formulaire après commande
      firstName.value = ""
      lastName.value = ""
      address.value = ""
      city.value = ""
      email.value = ""
      //Vider le panier après commande
      panier = []
      savePanier(panier)
      //Redirection vers la page de confirmation
      window.location.href = `./confirmation.html?orderId=${orderId}`
    } else {
      alert("Merci de remplir correctement le formulaire")
    }
  })
  