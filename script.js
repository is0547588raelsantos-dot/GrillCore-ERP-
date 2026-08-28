/* =====================================================
   🍔 GRILLCORE ERP
   SCRIPT.JS
   PRODUTOS DINÂMICOS + PEDIDOS
===================================================== */


/* =====================================================
   PRODUTOS
===================================================== */

function obterProdutos() {

    try {

        return JSON.parse(
            localStorage.getItem("produtos")
        ) || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        return [];

    }

}


function salvarProdutos(produtos) {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


/* =====================================================
   NORMALIZAR CATEGORIA
===================================================== */

function normalizarCategoria(categoria) {

    if (!categoria) {
        return "hamburguer";
    }

    let c =
        String(categoria)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (
        c.includes("hamburg") ||
        c.includes("lanche") ||
        c.includes("burger")
    ) {

        return "hamburguer";

    }

    if (
        c.includes("porcao") ||
        c.includes("porção")
    ) {

        return "porcao";

    }

    if (
        c.includes("bebida") ||
        c.includes("drink")
    ) {

        return "bebida";

    }

    return "outros";

}


/* =====================================================
   PREÇO
===================================================== */

function numeroPreco(valor) {

    if (
        typeof valor ===
        "number"
    ) {

        return valor;

    }

    if (!valor) {
        return 0;
    }

    let texto =
        String(valor)
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    let numero =
        parseFloat(texto);

    return isNaN(numero)
        ? 0
        : numero;

}


/* =====================================================
   ATUALIZAR LISTAS DO NOVO PEDIDO
===================================================== */

function atualizarListaProdutos() {

    const produtos =
        obterProdutos();

    const hamburguer =
        document.getElementById(
            "hamburguer"
        );

    const porcao =
        document.getElementById(
            "porcao"
        );

    const bebida =
        document.getElementById(
            "bebida"
        );


    if (hamburguer) {

        preencherSelectProduto(
            hamburguer,
            produtos,
            "hamburguer",
            "🍔 Selecione um hambúrguer"
        );

    }


    if (porcao) {

        preencherSelectProduto(
            porcao,
            produtos,
            "porcao",
            "🍟 Selecione uma porção"
        );

    }


    if (bebida) {

        preencherSelectProduto(
            bebida,
            produtos,
            "bebida",
            "🥤 Selecione uma bebida"
        );

    }

}


/* =====================================================
   PREENCHER SELECT
===================================================== */

function preencherSelectProduto(
    select,
    produtos,
    categoria,
    textoInicial
) {

    select.innerHTML = "";

    const primeira =
        document.createElement(
            "option"
        );

    primeira.value = "";

    primeira.textContent =
        textoInicial;

    select.appendChild(
        primeira
    );


    const filtrados =
        produtos.filter(
            function(produto) {

                return (
                    normalizarCategoria(
                        produto.categoria
                    ) === categoria
                );

            }
        );


    filtrados.forEach(
        function(produto) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                produto.id;

            const preco =
                numeroPreco(
                    produto.preco
                );

            option.textContent =
                produto.nome +
                " — R$ " +
                preco.toFixed(2)
                    .replace(".", ",");

            select.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   CARRINHO
===================================================== */

let carrinhoPedido = [];


function adicionarProdutoPedido(
    tipo
) {

    const select =
        document.getElementById(
            tipo
        );

    if (!select) {
        return;
    }


    const id =
        select.value;

    if (!id) {
        return;
    }


    const produtos =
        obterProdutos();


    const produto =
        produtos.find(
            function(item) {

                return String(item.id) ===
                       String(id);

            }
        );


    if (!produto) {
        return;
    }


    const existente =
        carrinhoPedido.find(
            function(item) {

                return String(item.id) ===
                       String(produto.id);

            }
        );


    if (existente) {

        existente.quantidade++;

    } else {

        carrinhoPedido.push({

            id:
                produto.id,

            nome:
                produto.nome,

            categoria:
                produto.categoria,

            preco:
                numeroPreco(
                    produto.preco
                ),

            quantidade:
                1

        });

    }


    select.value = "";

    atualizarCarrinho();

}


/* =====================================================
   ATUALIZAR CARRINHO
===================================================== */

function atualizarCarrinho() {

    const lista =
        document.getElementById(
            "listaCarrinho"
        );

    if (!lista) {
        return;
    }


    if (
        carrinhoPedido.length === 0
    ) {

        lista.innerHTML =

            `<p style="color:#888;">
                Nenhum produto adicionado.
            </p>`;

        calcularTotal();

        return;

    }


    lista.innerHTML = "";


    carrinhoPedido.forEach(
        function(item, indice) {

            const subtotal =
                item.preco *
                item.quantidade;


            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "item-carrinho";


            div.innerHTML = `

                <div class="item-nome">
                    ${item.nome}
                </div>

                <div class="item-info">
                    R$ ${item.preco
                        .toFixed(2)
                        .replace(".", ",")}
                    cada
                    <br>
                    Subtotal:
                    R$ ${subtotal
                        .toFixed(2)
                        .replace(".", ",")}
                </div>

                <div class="item-botoes">

                    <button
                        class="btn-menos"
                        onclick="alterarQuantidade(${indice}, -1)">
                        −
                    </button>

                    <strong>
                        ${item.quantidade}
                    </strong>

                    <button
                        class="btn-mais"
                        onclick="alterarQuantidade(${indice}, 1)">
                        +
                    </button>

                    <button
                        class="btn-remover"
                        onclick="removerItemPedido(${indice})">
                        🗑️
                    </button>

                </div>

            `;


            lista.appendChild(
                div
            );

        }
    );


    calcularTotal();

}


/* =====================================================
   QUANTIDADE
===================================================== */

function alterarQuantidade(
    indice,
    valor
) {

    if (
        !carrinhoPedido[indice]
    ) {
        return;
    }


    carrinhoPedido[indice]
        .quantidade += valor;


    if (
        carrinhoPedido[indice]
            .quantidade <= 0
    ) {

        carrinhoPedido.splice(
            indice,
            1
        );

    }


    atualizarCarrinho();

}


/* =====================================================
   REMOVER
===================================================== */

function removerItemPedido(
    indice
) {

    carrinhoPedido.splice(
        indice,
        1
    );

    atualizarCarrinho();

}


/* =====================================================
   TOTAL
===================================================== */

function calcularTotal() {

    let total = 0;


    carrinhoPedido.forEach(
        function(item) {

            total +=
                item.preco *
                item.quantidade;

        }
    );


    const campo =
        document.getElementById(
            "total"
        );


    if (campo) {

        campo.textContent =
            "R$ " +
            total
                .toFixed(2)
                .replace(".", ",");

    }


    return total;

}


/* =====================================================
   FINALIZAR PEDIDO
===================================================== */

function finalizarPedido() {

    const clienteCampo =
        document.getElementById(
            "cliente"
        );

    const pagamentoCampo =
        document.getElementById(
            "pagamento"
        );


    const cliente =
        clienteCampo
            ? clienteCampo.value.trim()
            : "";


    const pagamento =
        pagamentoCampo
            ? pagamentoCampo.value
            : "";


    if (!cliente) {

        alert(
            "Digite o nome do cliente."
        );

        return;

    }


    if (
        carrinhoPedido.length === 0
    ) {

        alert(
            "Adicione pelo menos um produto ao pedido."
        );

        return;

    }


    if (!pagamento) {

        alert(
            "Selecione a forma de pagamento."
        );

        return;

    }


    const total =
        calcularTotal();


    const pedido = {

        id:
            Date.now(),

        cliente:
            cliente,

        itens:
            JSON.parse(
                JSON.stringify(
                    carrinhoPedido
                )
            ),

        total:
            total,

        pagamento:
            pagamento,

        data:
            new Date()
                .toLocaleString(
                    "pt-BR"
                )

    };


    /* =========================
       HISTÓRICO
    ========================= */

    let pedidos =
        JSON.parse(
            localStorage.getItem(
                "pedidos"
            )
        ) || [];


    pedidos.push(
        pedido
    );


    localStorage.setItem(
        "pedidos",
        JSON.stringify(
            pedidos
        )
    );


    /* =========================
       VENDAS
    ========================= */

    let vendas =
        JSON.parse(
            localStorage.getItem(
                "vendas"
            )
        ) || [];


    vendas.push({

        ...pedido

    });


    localStorage.setItem(
        "vendas",
        JSON.stringify(
            vendas
        )
    );


    /* =========================
       ESTOQUE
    ========================= */

    atualizarEstoquePedido();


    /* =========================
       FINANCEIRO
    ========================= */

    let financeiro =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    financeiro.push({

        tipo:
            "entrada",

        valor:
            total,

        descricao:
            "Venda - " +
            cliente,

        pagamento:
            pagamento,

        data:
            new Date()
                .toLocaleString(
                    "pt-BR"
                )

    });


    localStorage.setItem(
        "financeiro",
        JSON.stringify(
            financeiro
        )
    );


    alert(
        "✅ Pedido finalizado com sucesso!"
    );


    carrinhoPedido = [];


    if (clienteCampo) {
        clienteCampo.value = "";
    }


    if (pagamentoCampo) {
        pagamentoCampo.value = "";
    }


    atualizarCarrinho();

    atualizarListaProdutos();

}


/* =====================================================
   ESTOQUE
===================================================== */

function atualizarEstoquePedido() {

    const produtos =
        obterProdutos();


    carrinhoPedido.forEach(
        function(item) {

            const produto =
                produtos.find(
                    function(p) {

                        return String(p.id) ===
                               String(item.id);

                    }
                );


            if (
                produto &&
                produto.estoque !== undefined
            ) {

                let estoque =
                    Number(
                        produto.estoque
                    ) || 0;


                estoque -=
                    item.quantidade;


                if (estoque < 0) {
                    estoque = 0;
                }


                produto.estoque =
                    estoque;

            }

        }
    );


    salvarProdutos(
        produtos
    );

}


/* =====================================================
   WHATSAPP
===================================================== */

function enviarPedidoWhatsAppNovo() {

    const clienteCampo =
        document.getElementById(
            "cliente"
        );


    const cliente =
        clienteCampo
            ? clienteCampo.value.trim()
            : "";


    if (!cliente) {

        alert(
            "Digite o nome do cliente."
        );

        return;

    }


    if (
        carrinhoPedido.length === 0
    ) {

        alert(
            "Adicione produtos ao pedido."
        );

        return;

    }


    let mensagem =
        "🍔 *GRILLCORE ERP*%0A";

    mensagem +=
        "🧾 *NOVO PEDIDO*%0A%0A";

    mensagem +=
        "👤 Cliente: " +
        encodeURIComponent(
            cliente
        ) +
        "%0A%0A";


    carrinhoPedido.forEach(
        function(item) {

            const subtotal =
                item.preco *
                item.quantidade;


            mensagem +=
                "• " +
                encodeURIComponent(
                    item.nome
                ) +
                " x" +
                item.quantidade +
                " — R$ " +
                subtotal
                    .toFixed(2)
                    .replace(".", ",") +
                "%0A";

        }
    );


    mensagem +=
        "%0A💰 *Total: R$ " +
        calcularTotal()
            .toFixed(2)
            .replace(".", ",") +
        "*";


    const url =
        "https://wa.me/?text=" +
        mensagem;


    window.open(
        url,
        "_blank"
    );

}


/* =====================================================
   COMPATIBILIDADE
===================================================== */

function obterTotalPedido() {

    return calcularTotal();

}


function adicionarProduto(
    tipo
) {

    adicionarProdutoPedido(
        tipo
    );

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.addEventListener(
    "load",
    function() {

        atualizarListaProdutos();

        atualizarCarrinho();

    }
);
