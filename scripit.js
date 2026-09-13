/* =====================================================
CRAZY CHICKEN
CARRINHO + BUSCA + FILTROS + WHATSAPP
===================================================== */

/* =====================================================
CONFIGURAÇÕES
===================================================== */

const WHATSAPP = "5544997664122";

/* =====================================================
ELEMENTOS
===================================================== */

const cart = document.getElementById("cart");
const cartButton = document.getElementById("cart-button");
const closeCart = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");

const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");

const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const continueShopping = document.getElementById("continue-shopping");
const checkoutWhatsapp = document.getElementById("checkout-whatsapp");

const cepInput = document.getElementById("customer-cep");

const searchInput = document.getElementById("product-search");
const products = document.querySelectorAll(".product");
const filters = document.querySelectorAll(".filter");

const noProducts = document.getElementById("no-products");

const toast = document.getElementById("cart-toast");

/* =====================================================
CARRINHO
===================================================== */

let carrinho = [];

/* =====================================================
FORMATAÇÃO DE PREÇO
===================================================== */

function formatarPreco(valor) {

```
return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});
```

}

/* =====================================================
ABRIR CARRINHO
===================================================== */

function abrirCarrinho() {

```
cart.classList.add("open");

cartOverlay.hidden = false;

document.body.classList.add("cart-open");
```

}

/* =====================================================
FECHAR CARRINHO
===================================================== */

function fecharCarrinho() {

```
cart.classList.remove("open");

cartOverlay.hidden = true;

document.body.classList.remove("cart-open");
```

}

/* =====================================================
EVENTOS DO CARRINHO
===================================================== */

cartButton.addEventListener("click", abrirCarrinho);

closeCart.addEventListener("click", fecharCarrinho);

cartOverlay.addEventListener("click", fecharCarrinho);

continueShopping.addEventListener("click", fecharCarrinho);

/* =====================================================
ADICIONAR PRODUTO
===================================================== */

document.querySelectorAll(".add-cart").forEach(botao => {

```
botao.addEventListener("click", () => {

    const produto = botao.closest(".product");

    const nome = produto.dataset.name;

    const preco = Number(produto.dataset.price);

    const imagem = produto.querySelector("img").src;

    const produtoExistente = carrinho.find(
        item => item.nome === nome
    );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: preco,

            quantidade: 1,

            imagem: imagem

        });

    }


    atualizarCarrinho();

    mostrarToast(`${nome} adicionado ao carrinho!`);

    abrirCarrinho();

});
```

});

/* =====================================================
ATUALIZAR CARRINHO
===================================================== */

function atualizarCarrinho() {

```
cartItems.innerHTML = "";


if (carrinho.length === 0) {

    cartEmpty.hidden = false;

    cartFooter.hidden = true;

} else {

    cartEmpty.hidden = true;

    cartFooter.hidden = false;


    carrinho.forEach((item, index) => {

        const elemento = document.createElement("div");

        elemento.className = "cart-item";


        elemento.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.imagem}"
                    alt="${item.nome}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.nome}
                </h3>

                <strong>
                    ${formatarPreco(item.preco)}
                </strong>


                <div class="cart-item-controls">

                    <button
                        type="button"
                        class="quantity-button"
                        data-action="minus"
                        data-index="${index}"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        type="button"
                        class="quantity-button"
                        data-action="plus"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                type="button"
                class="remove-item"
                data-index="${index}"
                aria-label="Remover ${item.nome}"
            >
                ×
            </button>

        `;


        cartItems.appendChild(element);

    });

}


atualizarResumo();
```

}

/* =====================================================
ALTERAR QUANTIDADE
===================================================== */

cartItems.addEventListener("click", evento => {

```
const botao = evento.target.closest("button");

if (!botao) return;


const index = Number(botao.dataset.index);


if (botao.dataset.action === "plus") {

    carrinho[index].quantidade++;

}


if (botao.dataset.action === "minus") {

    carrinho[index].quantidade--;


    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }

}


if (botao.classList.contains("remove-item")) {

    carrinho.splice(index, 1);

}


atualizarCarrinho();
```

});

/* =====================================================
ATUALIZAR RESUMO
===================================================== */

function atualizarResumo() {

```
let quantidadeTotal = 0;

let valorTotal = 0;


carrinho.forEach(item => {

    quantidadeTotal += item.quantidade;

    valorTotal += item.preco * item.quantidade;

});


cartCount.textContent = quantidadeTotal;

cartTotal.textContent = formatarPreco(valorTotal);
```

}

/* =====================================================
BUSCA DE PRODUTOS
===================================================== */

let categoriaAtual = "todos";

function filtrarProdutos() {

```
const termo = searchInput.value
    .toLowerCase()
    .trim();


let encontrados = 0;


products.forEach(produto => {

    const nome = produto.dataset.name
        .toLowerCase();

    const categoria = produto.dataset.category;

    const novidade = produto.dataset.new === "true";


    const correspondeBusca =
        nome.includes(termo);


    let correspondeCategoria = false;


    if (categoriaAtual === "todos") {

        correspondeCategoria = true;

    } else if (categoriaAtual === "novidades") {

        correspondeCategoria = novidade;

    } else {

        correspondeCategoria =
            categoria === categoriaAtual;

    }


    if (
        correspondeBusca &&
        correspondeCategoria
    ) {

        produto.style.display = "";

        encontrados++;

    } else {

        produto.style.display = "none";

    }

});


noProducts.hidden = encontrados !== 0;
```

}

/* =====================================================
EVENTO DA BUSCA
===================================================== */

searchInput.addEventListener(
"input",
filtrarProdutos
);

/* =====================================================
FILTROS
===================================================== */

filters.forEach(filtro => {

```
filtro.addEventListener("click", () => {

    filters.forEach(item => {

        item.classList.remove("active");

    });


    filtro.classList.add("active");


    categoriaAtual =
        filtro.dataset.filter;


    filtrarProdutos();

});
```

});

/* =====================================================
CATEGORIAS DA PÁGINA
===================================================== */

document.querySelectorAll(".category-link")
.forEach(link => {

```
    link.addEventListener("click", () => {

        const categoria =
            link.dataset.categoryLink;


        categoriaAtual = categoria;


        filters.forEach(filtro => {

            filtro.classList.remove("active");


            if (
                filtro.dataset.filter === categoria
            ) {

                filtro.classList.add("active");

            }

        });


        filtrarProdutos();

    });

});
```

/* =====================================================
MÁSCARA DE CEP
===================================================== */

cepInput.addEventListener("input", () => {

```
let cep = cepInput.value
    .replace(/\D/g, "")
    .slice(0, 8);


if (cep.length > 5) {

    cep =
        cep.substring(0, 5) +
        "-" +
        cep.substring(5);

}


cepInput.value = cep;
```

});

/* =====================================================
FINALIZAR NO WHATSAPP
===================================================== */

checkoutWhatsapp.addEventListener(
"click",
() => {

```
    if (carrinho.length === 0) {

        mostrarToast(
            "Seu carrinho está vazio."
        );

        return;

    }


    const cep = cepInput.value.trim();


    if (cep.length < 9) {

        mostrarToast(
            "Informe um CEP válido."
        );

        cepInput.focus();

        return;

    }


    let mensagem =
        "Olá! Gostaria de finalizar minha compra:%0A%0A";


    let valorTotal = 0;


    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;


        valorTotal += subtotal;


        mensagem +=
            `Item: ${item.nome}%0A`;


        mensagem +=
            `Quantidade: ${item.quantidade}%0A`;


        mensagem +=
            `Valor: ${formatarPreco(subtotal)}%0A%0A`;

    });


    mensagem +=
        `Valor total: ${formatarPreco(valorTotal)}%0A%0A`;


    mensagem +=
        `CEP: ${cep}%0A%0A`;


    mensagem +=
        "A entrega depende do CEP informado para cálculo do valor e disponibilidade da entrega.";


    const url =
        `https://wa.me/${WHATSAPP}?text=${mensagem}`;


    window.open(
        url,
        "_blank"
    );

}
```

);

/* =====================================================
NOTIFICAÇÃO
===================================================== */

let toastTimeout;

function mostrarToast(mensagem) {

```
toast.textContent = mensagem;

toast.classList.add("show");


clearTimeout(toastTimeout);


toastTimeout = setTimeout(() => {

    toast.classList.remove("show");

}, 2500);
```

}

/* =====================================================
MENU MOBILE
===================================================== */

const menuMobile =
document.querySelector(".menu-mobile");

const menu =
document.querySelector(".menu");

if (menuMobile && menu) {

```
menuMobile.addEventListener("click", () => {

    menu.classList.toggle("active");

});


menu.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});
```

}

/* =====================================================
ESC PARA FECHAR CARRINHO
===================================================== */

document.addEventListener("keydown", evento => {

```
if (evento.key === "Escape") {

    fecharCarrinho();

}
```

});

/* =====================================================
INICIALIZAÇÃO
===================================================== */

filtrarProdutos();

atualizarCarrinho();
