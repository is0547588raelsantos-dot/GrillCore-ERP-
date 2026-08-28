// =====================================================
// 🍔 GRILLCORE ERP
// SCRIPT.JS — SISTEMA PROFISSIONAL
// PRODUTOS + CATEGORIAS + PEDIDOS + ESTOQUE
// VENDAS + FINANCEIRO + CLIENTES + WHATSAPP
// =====================================================


// =====================================================
// 1. STORAGE
// =====================================================

function lerStorage(chave, padrao) {

    try {

        const dados =
            localStorage.getItem(chave);

        if (!dados) {
            return padrao;
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "Erro ao ler:",
            chave,
            erro
        );

        return padrao;

    }

}


function salvarStorage(chave, dados) {

    try {

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar:",
            chave,
            erro
        );

        alert(
            "❌ Não foi possível salvar os dados."
        );

        return false;

    }

}


function obterArray(chave) {

    const dados =
        lerStorage(chave, []);

    return Array.isArray(dados)
        ? dados
        : [];

}


// =====================================================
// 2. UTILITÁRIOS
// =====================================================

function dinheiro(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


function valorNumerico(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return 0;

    }

    if (typeof valor === "number") {

        return isNaN(valor)
            ? 0
            : valor;

    }

    let texto =
        String(valor)
        .replace("R$", "")
        .replace(/\s/g, "")
        .trim();

    if (texto.includes(",")) {

        texto =
            texto
            .replace(/\./g, "")
            .replace(",", ".");

    }

    const numero =
        Number(texto);

    return isNaN(numero)
        ? 0
        : numero;

}


function gerarID() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


function chamarSeExistir(nome) {

    if (
        typeof window[nome] ===
        "function"
    ) {

        try {

            window[nome]();

        } catch (erro) {

            console.warn(
                "Erro:",
                nome,
                erro
            );

        }

    }

}


// =====================================================
// 3. PRODUTOS
// =====================================================

let produtos =
    lerStorage(
        "produtos",
        []
    );


function normalizarProdutos() {

    if (!Array.isArray(produtos)) {

        produtos = [];

    }


    produtos.forEach(
        function(produto) {

            if (!produto.id) {

                produto.id =
                    gerarID();

            }

            if (!produto.nome) {

                produto.nome =
                    "Produto";

            }

            produto.preco =
                valorNumerico(
                    produto.preco
                );

            produto.estoque =
                valorNumerico(
                    produto.estoque
                );

            produto.estoqueMinimo =
                valorNumerico(
                    produto.estoqueMinimo
                );


            if (
                produto.estoqueMinimo <= 0
            ) {

                produto.estoqueMinimo = 2;

            }


            if (
                !produto.categoria
            ) {

                produto.categoria =
                    "hamburguer";

            }


            if (
                produto.ingredientes ===
                undefined
            ) {

                produto.ingredientes = "";

            }


            if (
                produto.descricao ===
                undefined
            ) {

                produto.descricao = "";

            }

        }
    );

}


normalizarProdutos();

salvarStorage(
    "produtos",
    produtos
);


// =====================================================
// 4. BUSCAR PRODUTO
// =====================================================

function buscarProduto(nome) {

    const busca =
        String(nome || "")
        .trim()
        .toLowerCase();


    if (!busca) {

        return null;

    }


    return produtos.find(
        function(produto) {

            return String(
                produto.nome || ""
            )
            .trim()
            .toLowerCase() ===
            busca;

        }
    ) || null;

}


// =====================================================
// 5. CATEGORIA
// =====================================================

function nomeCategoria(categoria) {

    const nomes = {

        hamburguer:
            "🍔 Hambúrguer",

        porcao:
            "🍟 Porção",

        bebida:
            "🥤 Bebida",

        outro:
            "📦 Outro"

    };

    return nomes[categoria] ||
        "📦 Outro";

}


// =====================================================
// 6. SALVAR PRODUTO
// =====================================================

function salvarProduto() {

    const nomeCampo =
        document.getElementById(
            "nomeProduto"
        );

    const categoriaCampo =
        document.getElementById(
            "categoriaProduto"
        );

    const precoCampo =
        document.getElementById(
            "precoProduto"
        );

    const estoqueCampo =
        document.getElementById(
            "estoqueProduto"
        );

    const ingredientesCampo =
        document.getElementById(
            "ingredientes"
        );

    const descricaoCampo =
        document.getElementById(
            "descricao"
        );


    if (
        !nomeCampo ||
        !precoCampo
    ) {

        alert(
            "❌ Campos não encontrados."
        );

        return;

    }


    const nome =
        nomeCampo.value.trim();

    const categoria =
        categoriaCampo
        ? categoriaCampo.value
        : "outro";

    const preco =
        valorNumerico(
            precoCampo.value
        );

    const estoque =
        estoqueCampo
        ? valorNumerico(
            estoqueCampo.value
        )
        : 0;

    const ingredientes =
        ingredientesCampo
        ? ingredientesCampo.value.trim()
        : "";

    const descricao =
        descricaoCampo
        ? descricaoCampo.value.trim()
        : "";


    if (!nome) {

        alert(
            "⚠️ Digite o nome do produto."
        );

        nomeCampo.focus();

        return;

    }


    if (!categoria) {

        alert(
            "⚠️ Escolha uma categoria."
        );

        categoriaCampo.focus();

        return;

    }


    if (preco <= 0) {

        alert(
            "⚠️ Digite um preço válido."
        );

        precoCampo.focus();

        return;

    }


    if (estoque < 0) {

        alert(
            "⚠️ Estoque inválido."
        );

        return;

    }


    const existe =
        produtos.some(
            function(produto) {

                return String(
                    produto.nome || ""
                )
                .trim()
                .toLowerCase() ===
                nome.toLowerCase();

            }
        );


    if (existe) {

        alert(
            "⚠️ Esse produto já está cadastrado!"
        );

        return;

    }


    produtos.push({

        id:
            gerarID(),

        nome:
            nome,

        categoria:
            categoria,

        preco:
            preco,

        estoque:
            estoque,

        estoqueMinimo:
            2,

        ingredientes:
            ingredientes,

        descricao:
            descricao,

        criadoEm:
            new Date()
            .toISOString()

    });


    salvarStorage(
        "produtos",
        produtos
    );


    nomeCampo.value = "";

    precoCampo.value = "";

    if (categoriaCampo) {

        categoriaCampo.value = "";

    }

    if (estoqueCampo) {

        estoqueCampo.value = "0";

    }

    if (ingredientesCampo) {

        ingredientesCampo.value = "";

    }

    if (descricaoCampo) {

        descricaoCampo.value = "";

    }


    atualizarListaCadastro();

    atualizarListaProdutos();

    atualizarListaEstoque();

    mostrarEstoque();


    alert(
        "✅ PRODUTO CADASTRADO!\n\n" +
        nomeCategoria(categoria) +
        "\n" +
        nome +
        "\n\n💰 " +
        dinheiro(preco)
    );

}


// =====================================================
// 7. LISTA DE PRODUTOS
// =====================================================

function atualizarListaCadastro() {

    const lista =
        document.getElementById(
            "listaProdutos"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    if (produtos.length === 0) {

        lista.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;

    }


    produtos.forEach(
        function(produto, indice) {

            const estoque =
                valorNumerico(
                    produto.estoque
                );


            let status =
                "🟢 Estoque normal";


            if (estoque <= 0) {

                status =
                    "🔴 SEM ESTOQUE";

            } else if (
                estoque <=
                produto.estoqueMinimo
            ) {

                status =
                    "🟠 ESTOQUE BAIXO";

            }


            lista.innerHTML += `

                <div class="produto-card">

                    <span class="categoria">

                        ${nomeCategoria(
                            produto.categoria
                        )}

                    </span>

                    <h3>
                        🍔 ${produto.nome}
                    </h3>

                    <p class="preco">
                        💰 ${dinheiro(
                            produto.preco
                        )}
                    </p>

                    <p>
                        📦 Estoque:
                        <strong>
                            ${estoque}
                        </strong>
                    </p>

                    <p>
                        ${status}
                    </p>

                    <p>
                        🥬 <strong>Ingredientes:</strong>
                        ${produto.ingredientes ||
                        "Não informado"}
                    </p>

                    <p>
                        📝 <strong>Descrição:</strong>
                        ${produto.descricao ||
                        "Não informado"}
                    </p>

                    <button
                        class="excluir"
                        onclick="excluirProduto(${indice})">

                        🗑️ EXCLUIR PRODUTO

                    </button>

                </div>

            `;

        }
    );

}


// =====================================================
// 8. EXCLUIR PRODUTO
// =====================================================

function excluirProduto(indice) {

    if (!produtos[indice]) {

        return;

    }


    const produto =
        produtos[indice];


    const confirmar =
        confirm(

            "⚠️ EXCLUIR PRODUTO?\n\n" +
            produto.nome +
            "\n\nEssa ação não poderá ser desfeita."

        );


    if (!confirmar) {

        return;

    }


    produtos.splice(
        indice,
        1
    );


    salvarStorage(
        "produtos",
        produtos
    );


    atualizarListaCadastro();

    atualizarListaProdutos();

    atualizarListaEstoque();

    mostrarEstoque();


    alert(
        "✅ Produto excluído."
    );

}


// =====================================================
// 9. LISTA DE HAMBÚRGUERES
// =====================================================

function atualizarListaProdutos() {

    const select =
        document.getElementById(
            "hamburguer"
        );


    if (!select) {

        return;

    }


    const valorAnterior =
        select.value;


    select.innerHTML = "";


    const primeira =
        document.createElement(
            "option"
        );

    primeira.value = "";

    primeira.textContent =
        "Selecione um hambúrguer";

    select.appendChild(
        primeira
    );


    produtos
        .filter(
            function(produto) {

                return (
                    produto.categoria ===
                    "hamburguer"
                );

            }
        )
        .forEach(
            function(produto) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    produto.nome;

                option.textContent =
                    produto.nome +
                    " — " +
                    dinheiro(
                        produto.preco
                    );


                if (
                    produto.estoque <= 0
                ) {

                    option.textContent +=
                        " — SEM ESTOQUE";

                    option.disabled =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );


    if (valorAnterior) {

        select.value =
            valorAnterior;

    }

}


// =====================================================
// 10. LISTA DE PORÇÕES
// =====================================================

function atualizarListaPorcoes() {

    const select =
        document.getElementById(
            "porcao"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";


    const primeira =
        document.createElement(
            "option"
        );

    primeira.value = "";

    primeira.textContent =
        "Sem porção";

    select.appendChild(
        primeira
    );


    produtos
        .filter(
            function(produto) {

                return (
                    produto.categoria ===
                    "porcao"
                );

            }
        )
        .forEach(
            function(produto) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    produto.nome;

                option.textContent =
                    produto.nome +
                    " — " +
                    dinheiro(
                        produto.preco
                    );


                if (
                    produto.estoque <= 0
                ) {

                    option.textContent +=
                        " — SEM ESTOQUE";

                    option.disabled =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );

}


// =====================================================
// 11. LISTA DE BEBIDAS
// =====================================================

function atualizarListaBebidas() {

    const select =
        document.getElementById(
            "bebida"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";


    const primeira =
        document.createElement(
            "option"
        );

    primeira.value = "";

    primeira.textContent =
        "Sem bebida";

    select.appendChild(
        primeira
    );


    produtos
        .filter(
            function(produto) {

                return (
                    produto.categoria ===
                    "bebida"
                );

            }
        )
        .forEach(
            function(produto) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    produto.nome;

                option.textContent =
                    produto.nome +
                    " — " +
                    dinheiro(
                        produto.preco
                    );


                if (
                    produto.estoque <= 0
                ) {

                    option.textContent +=
                        " — SEM ESTOQUE";

                    option.disabled =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );

}


// =====================================================
// 12. BUSCAR PREÇO DO PEDIDO
// =====================================================

function valorItemPedido(nome) {

    if (!nome) {

        return 0;

    }


    const produto =
        buscarProduto(nome);


    if (!produto) {

        return 0;

    }


    return valorNumerico(
        produto.preco
    );

}


// =====================================================
// 13. CALCULAR TOTAL
// =====================================================

function calcularTotal() {

    const hamburguer =
        document.getElementById(
            "hamburguer"
        );

    const bebida =
        document.getElementById(
            "bebida"
        );

    const porcao =
        document.getElementById(
            "porcao"
        );

    const totalElemento =
        document.getElementById(
            "total"
        );


    if (
        !hamburguer ||
        !bebida ||
        !porcao ||
        !totalElemento
    ) {

        return 0;

    }


    let total = 0;


    total +=
        valorItemPedido(
            hamburguer.value
        );


    total +=
        valorItemPedido(
            bebida.value
        );


    total +=
        valorItemPedido(
            porcao.value
        );


    totalElemento.innerText =
        dinheiro(total);


    return total;

}


// =====================================================
// 14. ESTOQUE
// =====================================================

function baixarEstoque(
    produto,
    quantidade,
    motivo
) {

    if (!produto) {

        return {
            sucesso: false
        };

    }


    const antes =
        valorNumerico(
            produto.estoque
        );

    const qtd =
        valorNumerico(
            quantidade
        );


    if (antes < qtd) {

        return {

            sucesso: false,

            motivo:
                "estoque_insuficiente",

            estoque:
                antes

        };

    }


    produto.estoque =
        antes - qtd;


    salvarStorage(
        "produtos",
        produtos
    );


    return {

        sucesso:
            true,

        estoque:
            produto.estoque

    };

}


// =====================================================
// 15. FINALIZAR PEDIDO
// =====================================================

function finalizarPedido() {

    const cliente =
        document.getElementById(
            "cliente"
        );

    const hamburguer =
        document.getElementById(
            "hamburguer"
        );

    const bebida =
        document.getElementById(
            "bebida"
        );

    const porcao =
        document.getElementById(
            "porcao"
        );

    const pagamento =
        document.getElementById(
            "pagamento"
        );


    if (
        !cliente ||
        !hamburguer ||
        !bebida ||
        !porcao ||
        !pagamento
    ) {

        alert(
            "❌ Campos do pedido não encontrados."
        );

        return;

    }


    const nomeCliente =
        cliente.value.trim();

    const nomeHamburguer =
        hamburguer.value;

    const nomeBebida =
        bebida.value;

    const nomePorcao =
        porcao.value;

    const formaPagamento =
        pagamento.value;


    if (!nomeCliente) {

        alert(
            "⚠️ Digite o nome do cliente."
        );

        cliente.focus();

        return;

    }


    if (!nomeHamburguer) {

        alert(
            "⚠️ Escolha um hambúrguer."
        );

        hamburguer.focus();

        return;

    }


    if (!formaPagamento) {

        alert(
            "⚠️ Escolha a forma de pagamento."
        );

        pagamento.focus();

        return;

    }


    const produtoHamburguer =
        buscarProduto(
            nomeHamburguer
        );


    if (!produtoHamburguer) {

        alert(
            "❌ Hambúrguer não encontrado."
        );

        return;

    }


    const produtoBebida =
        buscarProduto(
            nomeBebida
        );


    const produtoPorcao =
        buscarProduto(
            nomePorcao
        );


    const total =
        valorItemPedido(
            nomeHamburguer
        ) +

        valorItemPedido(
            nomeBebida
        ) +

        valorItemPedido(
            nomePorcao
        );


    if (total <= 0) {

        alert(
            "⚠️ Total inválido."
        );

        return;

    }


    let mensagemEstoque = "";


    if (
        produtoHamburguer.estoque < 1
    ) {

        alert(
            "🚫 Hambúrguer sem estoque."
        );

        return;

    }


    if (
        produtoBebida &&
        produtoBebida.estoque < 1
    ) {

        alert(
            "🚫 Bebida sem estoque."
        );

        return;

    }


    if (
        produtoPorcao &&
        produtoPorcao.estoque < 1
    ) {

        alert(
            "🚫 Porção sem estoque."
        );

        return;

    }


    const confirmar =
        confirm(

            "🧾 CONFIRMAR PEDIDO?\n\n" +

            "👤 Cliente: " +
            nomeCliente +

            "\n\n🍔 " +
            nomeHamburguer +

            "\n🥤 " +
            (
                nomeBebida ||
                "Sem bebida"
            ) +

            "\n🍟 " +
            (
                nomePorcao ||
                "Sem porção"
            ) +

            "\n💳 " +
            formaPagamento +

            "\n\n💰 TOTAL: " +
            dinheiro(total)

        );


    if (!confirmar) {

        return;

    }


    // -------------------------------------------------
    // BAIXAR ESTOQUES
    // -------------------------------------------------

    baixarEstoque(
        produtoHamburguer,
        1,
        "Venda"
    );


    if (produtoBebida) {

        baixarEstoque(
            produtoBebida,
            1,
            "Venda"
        );

    }


    if (produtoPorcao) {

        baixarEstoque(
            produtoPorcao,
            1,
            "Venda"
        );

    }


    // -------------------------------------------------
    // VENDA
    // -------------------------------------------------

    const id =
        gerarID();

    const data =
        new Date()
        .toISOString();


    const venda = {

        id:
            id,

        data:
            data,

        cliente:
            nomeCliente,

        hamburguer:
            nomeHamburguer,

        bebida:
            nomeBebida,

        porcao:
            nomePorcao,

        pagamento:
            formaPagamento,

        total:
            total,

        status:
            "finalizado",

        origem:
            "pedido"

    };


    const vendas =
        obterArray(
            "vendas"
        );


    vendas.push(
        venda
    );


    salvarStorage(
        "vendas",
        vendas
    );


    // -------------------------------------------------
    // FINANCEIRO
    // -------------------------------------------------

    const entradas =
        obterArray(
            "entradas"
        );


    entradas.push({

        id:
            id,

        data:
            data,

        descricao:
            "Venda - " +
            nomeCliente,

        valor:
            total,

        formaPagamento:
            formaPagamento,

        tipo:
            "entrada",

        categoria:
            "Venda",

        origem:
            "pedido",

        cliente:
            nomeCliente,

        pedido:
            id

    });


    salvarStorage(
        "entradas",
        entradas
    );


    // -------------------------------------------------
    // CLIENTE
    // -------------------------------------------------

    const clientes =
        obterArray(
            "clientes"
        );


    const nomeBusca =
        nomeCliente
        .toLowerCase();


    let clienteExistente =
        clientes.find(
            function(item) {

                return String(
                    item.nome || ""
                )
                .toLowerCase() ===
                nomeBusca;

            }
        );


    if (!clienteExistente) {

        clienteExistente = {

            id:
                gerarID(),

            nome:
                nomeCliente,

            telefone:
                "",

            pedidos:
                0,

            totalGasto:
                0,

            ultimoPedido:
                data

        };

        clientes.push(
            clienteExistente
        );

    }


    clienteExistente.pedidos =
        valorNumerico(
            clienteExistente.pedidos
        ) + 1;


    clienteExistente.totalGasto =
        valorNumerico(
            clienteExistente.totalGasto
        ) + total;


    clienteExistente.ultimoPedido =
        data;


    salvarStorage(
        "clientes",
        clientes
    );


    // -------------------------------------------------
    // ATUALIZAR
    // -------------------------------------------------

    atualizarSistema();


    // -------------------------------------------------
    // LIMPAR
    // -------------------------------------------------

    cliente.value = "";

    hamburguer.value = "";

    bebida.value = "";

    porcao.value = "";

    pagamento.value = "";


    calcularTotal();


    alert(

        "✅ PEDIDO FINALIZADO!\n\n" +

        "👤 " +
        nomeCliente +

        "\n🍔 " +
        nomeHamburguer +

        "\n🥤 " +
        (
            nomeBebida ||
            "Sem bebida"
        ) +

        "\n🍟 " +
        (
            nomePorcao ||
            "Sem porção"
        ) +

        "\n\n💰 TOTAL: " +
        dinheiro(total) +

        "\n\n📦 Estoque atualizado." +

        "\n💰 Financeiro atualizado." +

        "\n📋 Venda registrada."

    );

}


// =====================================================
// 16. WHATSAPP
// =====================================================

function enviarPedidoWhatsAppNovo() {

    const cliente =
        document.getElementById(
            "cliente"
        );

    const hamburguer =
        document.getElementById(
            "hamburguer"
        );

    const bebida =
        document.getElementById(
            "bebida"
        );

    const porcao =
        document.getElementById(
            "porcao"
        );

    const pagamento =
        document.getElementById(
            "pagamento"
        );


    if (
        !cliente ||
        !hamburguer ||
        !bebida ||
        !porcao ||
        !pagamento
    ) {

        return;

    }


    const nomeCliente =
        cliente.value.trim();

    const nomeHamburguer =
        hamburguer.value;

    const nomeBebida =
        bebida.value;

    const nomePorcao =
        porcao.value;

    const formaPagamento =
        pagamento.value;


    if (!nomeCliente) {

        alert(
            "⚠️ Digite o nome do cliente."
        );

        return;

    }


    if (!nomeHamburguer) {

        alert(
            "⚠️ Escolha um hambúrguer."
        );

        return;

    }


    if (!formaPagamento) {

        alert(
            "⚠️ Escolha a forma de pagamento."
        );

        return;

    }


    const total =
        valorItemPedido(
            nomeHamburguer
        ) +

        valorItemPedido(
            nomeBebida
        ) +

        valorItemPedido(
            nomePorcao
        );


    let telefone =
        localStorage.getItem(
            "telefoneCliente"
        ) ||
        localStorage.getItem(
            "clienteTelefone"
        ) ||
        localStorage.getItem(
            "telefonePedido"
        );


    if (!telefone) {

        telefone =
            prompt(
                "📱 Digite o WhatsApp do cliente com DDD:\n\nExemplo: 44999999999"
            );

    }


    if (!telefone) {

        return;

    }


    telefone =
        telefone.replace(
            /\D/g,
            ""
        );


    if (
        telefone.length === 10 ||
        telefone.length === 11
    ) {

        telefone =
            "55" +
            telefone;

    }


    const mensagem =

        "🍔 *GRILLCORE ERP*\n\n" +

        "📋 *NOVO PEDIDO*\n\n" +

        "👤 Cliente: " +
        nomeCliente +

        "\n🍔 Hambúrguer: " +
        nomeHamburguer +

        "\n🥤 Bebida: " +
        (
            nomeBebida ||
            "Sem bebida"
        ) +

        "\n🍟 Porção: " +
        (
            nomePorcao ||
            "Sem porção"
        ) +

        "\n💳 Pagamento: " +
        formaPagamento +

        "\n\n💰 *TOTAL: " +
        dinheiro(total) +
        "*\n\n" +

        "Obrigado pela preferência! ❤️";


    const url =
        "https://wa.me/" +
        telefone +
        "?text=" +
        encodeURIComponent(
            mensagem
        );


    window.open(
        url,
        "_blank"
    );

}


// =====================================================
// 17. ESTOQUE — LISTA
// =====================================================

function atualizarListaEstoque() {

    const select =
        document.getElementById(
            "produtoEstoque"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";


    produtos.forEach(
        function(produto) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                produto.nome;

            option.textContent =
                produto.nome +
                " — " +
                valorNumerico(
                    produto.estoque
                );

            select.appendChild(
                option
            );

        }
    );

}


// =====================================================
// 18. MOSTRAR ESTOQUE
// =====================================================

function mostrarEstoque() {

    const lista =
        document.getElementById(
            "listaEstoque"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    produtos.forEach(
        function(produto) {

            const estoque =
                valorNumerico(
                    produto.estoque
                );


            let status =
                "🟢 Normal";


            if (estoque <= 0) {

                status =
                    "🔴 SEM ESTOQUE";

            } else if (
                estoque <=
                produto.estoqueMinimo
            ) {

                status =
                    "🟠 ESTOQUE BAIXO";

            }


            lista.innerHTML += `

                <div class="estoque-item">

                    <h3>
                        ${nomeCategoria(
                            produto.categoria
                        )}
                        ${produto.nome}
                    </h3>

                    <p>
                        📦 Estoque:
                        <strong>
                            ${estoque}
                        </strong>
                    </p>

                    <p>
                        ${status}
                    </p>

                </div>

            `;

        }
    );

}


// =====================================================
// 19. ATUALIZAR SISTEMA
// =====================================================

function atualizarSistema() {

    produtos =
        lerStorage(
            "produtos",
            []
        );


    normalizarProdutos();


    salvarStorage(
        "produtos",
        produtos
    );


    atualizarListaCadastro();

    atualizarListaProdutos();

    atualizarListaPorcoes();

    atualizarListaBebidas();

    atualizarListaEstoque();

    mostrarEstoque();

    calcularTotal();

}


// =====================================================
// 20. INICIALIZAÇÃO
// =====================================================

window.addEventListener(
    "load",
    function() {

        atualizarSistema();

    }
);


window.addEventListener(
    "pageshow",
    function() {

        atualizarSistema();

    }
);


document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            atualizarSistema();

        }

    }
);


// =====================================================
// 🍔 FIM DO SCRIPT.JS
// =====================================================
