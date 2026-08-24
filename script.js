// =====================================================
// 🍔 GRILLCORE ERP
// SCRIPT.JS — VERSÃO PROFISSIONAL
// =====================================================
// PEDIDOS
// PRODUTOS
// ESTOQUE
// VENDAS
// FINANCEIRO
// CLIENTES
// HISTÓRICO
// WHATSAPP
// COMPATIBILIDADE COM DADOS ANTIGOS
// =====================================================


// =====================================================
// 1. BANCO PRINCIPAL
// =====================================================

let produtos = lerStorage("produtos", []);


// =====================================================
// 2. STORAGE
// =====================================================

function lerStorage(chave, padrao) {

    try {

        const dados = localStorage.getItem(chave);

        if (!dados) {
            return padrao;
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "Erro ao ler localStorage:",
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
            "Erro ao salvar localStorage:",
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

    const dados = lerStorage(chave, []);

    return Array.isArray(dados)
        ? dados
        : [];

}


// =====================================================
// 3. UTILITÁRIOS
// =====================================================

function dinheiro(valor) {

    const numero = Number(valor) || 0;

    return numero.toLocaleString(
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

    let texto = String(valor)
        .replace("R$", "")
        .replace(/\s/g, "")
        .trim();

    if (texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    }

    const numero = Number(texto);

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


function chamarSeExistir(nomeFuncao) {

    if (
        typeof window[nomeFuncao] ===
        "function"
    ) {

        try {

            window[nomeFuncao]();

        } catch (erro) {

            console.warn(
                "Erro ao atualizar:",
                nomeFuncao,
                erro
            );

        }

    }

}


// =====================================================
// 4. PRODUTOS PADRÃO
// =====================================================

const produtosIniciais = [

    {
        nome: "X Prensado",
        preco: 30,
        ingredientes:
            "Hambúrguer 180g, queijo, alface, tomate e molho especial.",
        descricao:
            "Nosso clássico prensado.",
        estoque: 10,
        estoqueMinimo: 2
    },

    {
        nome: "Carga Pesada",
        preco: 38,
        ingredientes:
            "180g, cheddar, bacon e cebola caramelizada.",
        descricao:
            "Muito bacon e muito sabor.",
        estoque: 10,
        estoqueMinimo: 2
    },

    {
        nome: "Rocha Tropical",
        preco: 36,
        ingredientes:
            "180g, abacaxi grelhado, queijo e molho da casa.",
        descricao:
            "O sabor tropical da Rocha Forte.",
        estoque: 10,
        estoqueMinimo: 2
    },

    {
        nome: "Big Monster",
        preco: 38,
        ingredientes:
            "180g, queijo duplo, bacon e molho especial.",
        descricao:
            "Gigante e muito recheado.",
        estoque: 10,
        estoqueMinimo: 2
    },

    {
        nome: "X Tudo",
        preco: 48,
        ingredientes:
            "180g, ovo, bacon, queijo, salada e molho.",
        descricao:
            "O maior da casa.",
        estoque: 10,
        estoqueMinimo: 2
    }

];


// =====================================================
// 5. NORMALIZAR PRODUTOS
// =====================================================

function normalizarProdutos() {

    if (!Array.isArray(produtos)) {

        produtos = [];

    }

    produtos.forEach(function(produto) {

        if (!produto.id) {

            produto.id = gerarID();

        }

        if (!produto.nome) {

            produto.nome = "Produto";

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

    });

}


normalizarProdutos();


// =====================================================
// 6. PRODUTOS INICIAIS
// =====================================================

if (produtos.length === 0) {

    produtos =
        produtosIniciais.map(
            function(produto) {

                return {

                    ...produto,

                    id: gerarID(),

                    criadoEm:
                        new Date()
                            .toISOString()

                };

            }
        );

}

salvarStorage(
    "produtos",
    produtos
);


// =====================================================
// 7. SALVAR PRODUTOS
// =====================================================

function salvarProdutos() {

    return salvarStorage(
        "produtos",
        produtos
    );

}


// =====================================================
// 8. BUSCAR PRODUTO
// =====================================================

function buscarProduto(nome) {

    const nomeBusca =
        String(nome || "")
            .trim()
            .toLowerCase();

    if (!nomeBusca) {

        return null;

    }

    return produtos.find(
        function(produto) {

            return String(
                produto.nome || ""
            )
            .trim()
            .toLowerCase() ===
            nomeBusca;

        }
    ) || null;

}


// =====================================================
// 9. BEBIDAS
// =====================================================

function valorBebida(nome) {

    const valores = {

        "Coca-Cola": 8,
        "Guaraná": 7,
        "Água": 4,
        "Suco": 10

    };

    return Number(
        valores[nome] || 0
    );

}


// =====================================================
// 10. PORÇÕES
// =====================================================

function valorPorcao(nome) {

    const valores = {

        "Batata Frita": 15,
        "Onion Rings": 18

    };

    return Number(
        valores[nome] || 0
    );

}


// =====================================================
// 11. ATUALIZAR LISTA DE HAMBÚRGUERES
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

    const primeiraOpcao =
        document.createElement(
            "option"
        );

    primeiraOpcao.value = "";

    primeiraOpcao.textContent =
        "Selecione um hambúrguer";

    select.appendChild(
        primeiraOpcao
    );


    produtos.forEach(
        function(produto) {

            const option =
                document.createElement(
                    "option"
                );

            const estoque =
                valorNumerico(
                    produto.estoque
                );

            option.value =
                produto.nome;

            option.textContent =
                produto.nome +
                " — " +
                dinheiro(
                    produto.preco
                );

            if (estoque <= 0) {

                option.textContent +=
                    " — SEM ESTOQUE";

                option.disabled = true;

            }

            select.appendChild(
                option
            );

        }
    );


    if (valorAnterior) {

        const existe =
            Array.from(
                select.options
            ).some(
                function(opcao) {

                    return (
                        opcao.value ===
                        valorAnterior
                    );

                }
            );

        if (existe) {

            select.value =
                valorAnterior;

        }

    }

}


// =====================================================
// 12. CALCULAR TOTAL
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


    const produto =
        buscarProduto(
            hamburguer.value
        );


    let total = 0;


    if (produto) {

        total +=
            valorNumerico(
                produto.preco
            );

    }


    total +=
        valorBebida(
            bebida.value
        );


    total +=
        valorPorcao(
            porcao.value
        );


    totalElemento.innerText =
        dinheiro(total);


    return total;

}


// =====================================================
// 13. HISTÓRICO DE ESTOQUE
// =====================================================

function registrarHistoricoEstoque(
    tipo,
    produto,
    quantidade,
    estoqueAntes,
    estoqueDepois,
    motivo
) {

    const historico =
        obterArray(
            "historicoEstoque"
        );

    historico.push({

        id:
            gerarID(),

        data:
            new Date()
                .toISOString(),

        tipo:
            tipo,

        produto:
            produto,

        quantidade:
            valorNumerico(
                quantidade
            ),

        estoqueAntes:
            valorNumerico(
                estoqueAntes
            ),

        estoqueDepois:
            valorNumerico(
                estoqueDepois
            ),

        motivo:
            motivo ||
            "Movimentação de estoque"

    });

    salvarStorage(
        "historicoEstoque",
        historico
    );

}


// =====================================================
// 14. REGISTRAR VENDA
// =====================================================

function registrarVenda(dados) {

    const vendas =
        obterArray(
            "vendas"
        );

    vendas.push(dados);

    salvarStorage(
        "vendas",
        vendas
    );

}


// =====================================================
// 15. FINANCEIRO
// =====================================================

function registrarEntradaFinanceira(dados) {

    const entradas =
        obterArray(
            "entradas"
        );

    entradas.push({

        id:
            dados.id,

        data:
            dados.data,

        descricao:
            dados.descricao,

        valor:
            valorNumerico(
                dados.valor
            ),

        formaPagamento:
            dados.formaPagamento,

        tipo:
            "entrada",

        categoria:
            "Venda",

        origem:
            "pedido",

        cliente:
            dados.cliente || "",

        pedido:
            dados.pedido || ""

    });

    salvarStorage(
        "entradas",
        entradas
    );


    // Compatibilidade antiga

    const antigas =
        obterArray(
            "entradasFinanceiras"
        );

    antigas.push(dados);

    salvarStorage(
        "entradasFinanceiras",
        antigas
    );


    // Movimentações

    const movimentacoes =
        obterArray(
            "movimentacoesFinanceiras"
        );

    movimentacoes.push({

        id:
            dados.id,

        data:
            dados.data,

        tipo:
            "entrada",

        categoria:
            "Venda",

        descricao:
            dados.descricao,

        valor:
            valorNumerico(
                dados.valor
            ),

        formaPagamento:
            dados.formaPagamento,

        origem:
            "pedido",

        cliente:
            dados.cliente || "",

        pedido:
            dados.pedido || ""

    });

    salvarStorage(
        "movimentacoesFinanceiras",
        movimentacoes
    );

}


// =====================================================
// 16. CLIENTES
// =====================================================

function atualizarCliente(
    nomeCliente,
    total
) {

    const clientes =
        obterArray(
            "clientes"
        );

    const nomeBusca =
        String(nomeCliente)
            .trim()
            .toLowerCase();


    let cliente =
        clientes.find(
            function(item) {

                return String(
                    item.nome || ""
                )
                .trim()
                .toLowerCase() ===
                nomeBusca;

            }
        );


    if (!cliente) {

        cliente = {

            id:
                gerarID(),

            nome:
                nomeCliente.trim(),

            telefone:
                "",

            pedidos:
                0,

            totalGasto:
                0,

            ultimoPedido:
                null,

            criadoEm:
                new Date()
                    .toISOString()

        };

        clientes.push(
            cliente
        );

    }


    cliente.pedidos =
        valorNumerico(
            cliente.pedidos
        ) + 1;


    cliente.totalGasto =
        valorNumerico(
            cliente.totalGasto
        ) +
        valorNumerico(total);


    cliente.ultimoPedido =
        new Date()
            .toISOString();


    salvarStorage(
        "clientes",
        clientes
    );

}


// =====================================================
// 17. BAIXAR ESTOQUE
// =====================================================

function baixarEstoque(
    produto,
    quantidade,
    motivo
) {

    if (!produto) {

        return {
            sucesso: false,
            motivo: "produto_invalido"
        };

    }


    const estoqueAntes =
        valorNumerico(
            produto.estoque
        );


    const qtd =
        valorNumerico(
            quantidade
        );


    if (qtd <= 0) {

        return {
            sucesso: false,
            motivo: "quantidade_invalida"
        };

    }


    if (
        estoqueAntes < qtd
    ) {

        return {

            sucesso: false,

            motivo:
                "estoque_insuficiente",

            estoque:
                estoqueAntes,

            necessario:
                qtd

        };

    }


    produto.estoque =
        estoqueAntes - qtd;


    registrarHistoricoEstoque(

        "saida",

        produto.nome,

        qtd,

        estoqueAntes,

        produto.estoque,

        motivo ||
        "Venda"

    );


    salvarProdutos();


    return {

        sucesso:
            true,

        estoqueAntes:
            estoqueAntes,

        estoqueDepois:
            produto.estoque,

        estoqueMinimo:
            valorNumerico(
                produto.estoqueMinimo
            ),

        estoqueBaixo:
            valorNumerico(
                produto.estoqueMinimo
            ) > 0 &&
            produto.estoque <=
            valorNumerico(
                produto.estoqueMinimo
            )

    };

}


// =====================================================
// 18. FINALIZAR PEDIDO
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


    // -------------------------------------------------
    // VALIDAÇÃO
    // -------------------------------------------------

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
            "⚠️ Selecione a forma de pagamento."
        );

        pagamento.focus();

        return;

    }


    // -------------------------------------------------
    // PRODUTO
    // -------------------------------------------------

    const produto =
        buscarProduto(
            nomeHamburguer
        );


    if (!produto) {

        alert(
            "❌ Hambúrguer não encontrado."
        );

        return;

    }


    const estoqueAtual =
        valorNumerico(
            produto.estoque
        );


    if (estoqueAtual <= 0) {

        alert(

            "🚫 PRODUTO SEM ESTOQUE!\n\n" +
            produto.nome

        );

        return;

    }


    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const total =

        valorNumerico(
            produto.preco
        ) +

        valorBebida(
            nomeBebida
        ) +

        valorPorcao(
            nomePorcao
        );


    if (total <= 0) {

        alert(
            "⚠️ O valor do pedido é inválido."
        );

        return;

    }


    // -------------------------------------------------
    // CONFIRMAÇÃO
    // -------------------------------------------------

    const confirmar =
        confirm(

            "🧾 CONFIRMAR PEDIDO?\n\n" +

            "👤 Cliente: " +
            nomeCliente +

            "\n🍔 Hambúrguer: " +
            produto.nome +

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

            "\n\n💰 TOTAL: " +
            dinheiro(total)

        );


    if (!confirmar) {

        return;

    }


    // -------------------------------------------------
    // ID
    // -------------------------------------------------

    const id =
        gerarID();

    const data =
        new Date()
            .toISOString();


    // -------------------------------------------------
    // ESTOQUE
    // -------------------------------------------------

    const resultadoEstoque =
        baixarEstoque(

            produto,

            1,

            "Venda - Cliente: " +
            nomeCliente

        );


    if (
        !resultadoEstoque.sucesso
    ) {

        alert(

            "❌ Não foi possível baixar o estoque.\n\n" +
            "O pedido não foi finalizado."

        );

        return;

    }


    // -------------------------------------------------
    // VENDA
    // -------------------------------------------------

    const venda = {

        id:
            id,

        data:
            data,

        cliente:
            nomeCliente,

        hamburguer:
            produto.nome,

        bebida:
            nomeBebida,

        porcao:
            nomePorcao,

        pagamento:
            formaPagamento,

        total:
            total,

        origem:
            "pedido",

        status:
            "finalizado"

    };


    registrarVenda(
        venda
    );


    // -------------------------------------------------
    // FINANCEIRO
    // -------------------------------------------------

    registrarEntradaFinanceira({

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

        cliente:
            nomeCliente,

        pedido:
            id

    });


    // -------------------------------------------------
    // CLIENTE
    // -------------------------------------------------

    atualizarCliente(
        nomeCliente,
        total
    );


    // -------------------------------------------------
    // ATUALIZAR TELAS
    // -------------------------------------------------

    chamarSeExistir(
        "atualizarListaProdutos"
    );

    chamarSeExistir(
        "atualizarListaCadastro"
    );

    chamarSeExistir(
        "atualizarListaEstoque"
    );

    chamarSeExistir(
        "mostrarEstoque"
    );

    calcularTotal();


    // -------------------------------------------------
    // LIMPAR FORMULÁRIO
    // -------------------------------------------------

    cliente.value = "";

    hamburguer.value = "";

    bebida.value = "";

    porcao.value = "";

    pagamento.value = "";


    calcularTotal();


    // -------------------------------------------------
    // AVISO
    // -------------------------------------------------

    let avisoEstoque =

        "\n📦 Estoque restante: " +
        produto.estoque;


    if (
        resultadoEstoque.estoqueBaixo
    ) {

        avisoEstoque +=

            "\n\n⚠️ ESTOQUE BAIXO!" +

            "\nEstoque mínimo: " +
            produto.estoqueMinimo;

    }


    // -------------------------------------------------
    // SUCESSO
    // -------------------------------------------------

    alert(

        "✅ PEDIDO FINALIZADO!\n\n" +

        "👤 Cliente: " +
        nomeCliente +

        "\n🍔 Hambúrguer: " +
        produto.nome +

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

        "\n\n💰 Total: " +
        dinheiro(total) +

        avisoEstoque +

        "\n\n💰 Financeiro atualizado." +

        "\n📜 Venda registrada." +

        "\n👤 Cliente atualizado."

    );

}


// =====================================================
// 19. WHATSAPP
// =====================================================

function enviarPedidoWhatsAppNovo() {

    const clienteElemento =
        document.getElementById(
            "cliente"
        );

    const hamburguerElemento =
        document.getElementById(
            "hamburguer"
        );

    const bebidaElemento =
        document.getElementById(
            "bebida"
        );

    const porcaoElemento =
        document.getElementById(
            "porcao"
        );

    const pagamentoElemento =
        document.getElementById(
            "pagamento"
        );


    if (
        !clienteElemento ||
        !hamburguerElemento ||
        !bebidaElemento ||
        !porcaoElemento ||
        !pagamentoElemento
    ) {

        alert(
            "❌ Campos do pedido não encontrados."
        );

        return;

    }


    const cliente =
        clienteElemento.value.trim();

    const hamburguer =
        hamburguerElemento.value;

    const bebida =
        bebidaElemento.value;

    const porcao =
        porcaoElemento.value;

    const pagamento =
        pagamentoElemento.value;


    if (!cliente) {

        alert(
            "⚠️ Digite o nome do cliente."
        );

        clienteElemento.focus();

        return;

    }


    if (!hamburguer) {

        alert(
            "⚠️ Escolha um hambúrguer."
        );

        hamburguerElemento.focus();

        return;

    }


    if (!pagamento) {

        alert(
            "⚠️ Selecione a forma de pagamento."
        );

        pagamentoElemento.focus();

        return;

    }


    const produto =
        buscarProduto(
            hamburguer
        );


    if (!produto) {

        alert(
            "❌ Produto não encontrado."
        );

        return;

    }


    const total =

        valorNumerico(
            produto.preco
        ) +

        valorBebida(
            bebida
        ) +

        valorPorcao(
            porcao
        );


    // -------------------------------------------------
    // TELEFONE
    // -------------------------------------------------

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

                "📱 Digite o WhatsApp do cliente com DDD:\n\n" +
                "Exemplo: 44999999999"

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


    if (
        telefone.length < 12
    ) {

        alert(
            "⚠️ Número de WhatsApp inválido."
        );

        return;

    }


    // -------------------------------------------------
    // MENSAGEM
    // -------------------------------------------------

    const mensagem =

        "🍔 *GRILLCORE ERP*\n\n" +

        "📋 *NOVO PEDIDO*\n\n" +

        "👤 Cliente: " +
        cliente +

        "\n🍔 Hambúrguer: " +
        hamburguer +

        "\n🥤 Bebida: " +
        (
            bebida ||
            "Sem bebida"
        ) +

        "\n🍟 Porção: " +
        (
            porcao ||
            "Sem porção"
        ) +

        "\n💳 Pagamento: " +
        pagamento +

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
// 20. CADASTRAR PRODUTO
// =====================================================

function salvarProduto() {

    const nomeCampo =
        document.getElementById(
            "nomeProduto"
        );

    const precoCampo =
        document.getElementById(
            "precoProduto"
        );

    const ingredientesCampo =
        document.getElementById(
            "ingredientes"
        );

    const descricaoCampo =
        document.getElementById(
            "descricao"
        );

    const estoqueCampo =
        document.getElementById(
            "estoqueProduto"
        );


    if (
        !nomeCampo ||
        !precoCampo
    ) {

        alert(
            "❌ Campos do produto não encontrados."
        );

        return;

    }


    const nome =
        nomeCampo.value.trim();

    const preco =
        valorNumerico(
            precoCampo.value
        );

    const ingredientes =
        ingredientesCampo
        ? ingredientesCampo.value.trim()
        : "";

    const descricao =
        descricaoCampo
        ? descricaoCampo.value.trim()
        : "";

    let estoque =
        estoqueCampo
        ? valorNumerico(
            estoqueCampo.value
        )
        : 10;


    if (!nome) {

        alert(
            "⚠️ Digite o nome do produto."
        );

        nomeCampo.focus();

        return;

    }


    if (preco <= 0) {

        alert(
            "⚠️ Digite um preço válido."
        );

        precoCampo.focus();

        return;

    }


    if (
        estoque < 0 ||
        isNaN(estoque)
    ) {

        estoque = 10;

    }


    const existe =
        produtos.find(
            function(produto) {

                return String(
                    produto.nome || ""
                )
                .trim()
                .toLowerCase() ===
                nome
                    .trim()
                    .toLowerCase();

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

        preco:
            preco,

        ingredientes:
            ingredientes,

        descricao:
            descricao,

        estoque:
            estoque,

        estoqueMinimo:
            2,

        criadoEm:
            new Date()
                .toISOString()

    });


    salvarProdutos();


    nomeCampo.value = "";

    precoCampo.value = "";


    if (ingredientesCampo) {

        ingredientesCampo.value = "";

    }


    if (descricaoCampo) {

        descricaoCampo.value = "";

    }


    if (estoqueCampo) {

        estoqueCampo.value = "";

    }


    chamarSeExistir(
        "atualizarListaProdutos"
    );

    chamarSeExistir(
        "atualizarListaCadastro"
    );

    chamarSeExistir(
        "atualizarListaEstoque"
    );

    chamarSeExistir(
        "mostrarEstoque"
    );


    alert(
        "✅ Produto cadastrado com sucesso!"
    );

}


// =====================================================
// 21. LISTA DE PRODUTOS
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
                valorNumerico(
                    produto.estoqueMinimo
                )
            ) {

                status =
                    "🟠 ESTOQUE BAIXO";

            }


            lista.innerHTML += `

                <div class="produto-card">

                    <h3>
                        🍔 ${produto.nome}
                    </h3>

                    <p>
                        💰 Preço:
                        <strong>
                            ${dinheiro(produto.preco)}
                        </strong>
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
                        🥬 Ingredientes:
                        ${produto.ingredientes || "Não informado"}
                    </p>

                    <p>
                        📝 Descrição:
                        ${produto.descricao || "Não informado"}
                    </p>

                    <button
                        onclick="excluirProduto(${indice})">

                        🗑️ Excluir

                    </button>

                    <hr>

                </div>

            `;

        }
    );

}


// =====================================================
// 22. EXCLUIR PRODUTO
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

            "\n\n" +

            "Essa ação removerá o produto do cadastro."

        );


    if (!confirmar) {

        return;

    }


    produtos.splice(
        indice,
        1
    );


    salvarProdutos();


    chamarSeExistir(
        "atualizarListaCadastro"
    );

    chamarSeExistir(
        "atualizarListaProdutos"
    );

    chamarSeExistir(
        "atualizarListaEstoque"
    );

    chamarSeExistir(
        "mostrarEstoque"
    );

    calcularTotal();


    alert(
        "✅ Produto excluído."
    );

}


// =====================================================
// 23. LISTA DE ESTOQUE
// =====================================================

function atualizarListaEstoque() {

    const select =
        document.getElementById(
            "produtoEstoque"
        );


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML = "";


    if (produtos.length === 0) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "Nenhum produto cadastrado";

        select.appendChild(
            option
        );

        return;

    }


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
                " — Estoque: " +
                valorNumerico(
                    produto.estoque
                );

            select.appendChild(
                option
            );

        }
    );


    if (valorAtual) {

        select.value =
            valorAtual;

    }

}


// =====================================================
// 24. ADICIONAR ESTOQUE
// =====================================================

function adicionarEstoque() {

    const select =
        document.getElementById(
            "produtoEstoque"
        );

    const quantidade =
        document.getElementById(
            "quantidadeEstoque"
        );


    if (
        !select ||
        !quantidade
    ) {

        alert(
            "❌ Campos de estoque não encontrados."
        );

        return;

    }


    const produto =
        buscarProduto(
            select.value
        );


    if (!produto) {

        alert(
            "⚠️ Produto não encontrado."
        );

        return;

    }


    const qtd =
        valorNumerico(
            quantidade.value
        );


    if (qtd <= 0) {

        alert(
            "⚠️ Digite uma quantidade válida."
        );

        quantidade.focus();

        return;

    }


    const estoqueAntes =
        valorNumerico(
            produto.estoque
        );


    produto.estoque =
        estoqueAntes + qtd;


    registrarHistoricoEstoque(

        "entrada",

        produto.nome,

        qtd,

        estoqueAntes,

        produto.estoque,

        "Entrada manual de estoque"

    );


    salvarProdutos();


    atualizarListaEstoque();

    atualizarListaProdutos();

    atualizarListaCadastro();

    mostrarEstoque();


    quantidade.value = "";


    alert(

        "✅ ESTOQUE ATUALIZADO!\n\n" +

        "🍔 " +
        produto.nome +

        "\n\n📥 Quantidade adicionada: " +
        qtd +

        "\n📦 Estoque atual: " +
        produto.estoque

    );

}


// =====================================================
// 25. RETIRAR ESTOQUE
// =====================================================

function retirarEstoque() {

    const select =
        document.getElementById(
            "produtoEstoque"
        );

    const quantidade =
        document.getElementById(
            "quantidadeEstoque"
        );


    if (
        !select ||
        !quantidade
    ) {

        return;

    }


    const produto =
        buscarProduto(
            select.value
        );


    if (!produto) {

        alert(
            "⚠️ Produto não encontrado."
        );

        return;

    }


    const qtd =
        valorNumerico(
            quantidade.value
        );


    if (qtd <= 0) {

        alert(
            "⚠️ Digite uma quantidade válida."
        );

        return;

    }


    const estoqueAntes =
        valorNumerico(
            produto.estoque
        );


    if (
        qtd > estoqueAntes
    ) {

        alert(

            "🚫 ESTOQUE INSUFICIENTE!\n\n" +

            "Disponível: " +
            estoqueAntes +

            "\nSolicitado: " +
            qtd

        );

        return;

    }


    produto.estoque =
        estoqueAntes - qtd;


    registrarHistoricoEstoque(

        "saida",

        produto.nome,

        qtd,

        estoqueAntes,

        produto.estoque,

        "Saída manual de estoque"

    );


    salvarProdutos();


    atualizarListaEstoque();

    atualizarListaProdutos();

    atualizarListaCadastro();

    mostrarEstoque();


    quantidade.value = "";


    alert(

        "✅ ESTOQUE RETIRADO!\n\n" +

        "🍔 " +
        produto.nome +

        "\n\n📤 Quantidade retirada: " +
        qtd +

        "\n📦 Estoque atual: " +
        produto.estoque

    );

}


// =====================================================
// 26. MOSTRAR ESTOQUE
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


    if (produtos.length === 0) {

        lista.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;

    }


    produtos.forEach(
        function(produto) {

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
                valorNumerico(
                    produto.estoqueMinimo
                )
            ) {

                status =
                    "🟠 ESTOQUE BAIXO";

            }


            lista.innerHTML += `

                <div class="estoque-item">

                    <h3>
                        🍔 ${produto.nome}
                    </h3>

                    <p>
                        📦 Estoque atual:
                        <strong>
                            ${estoque}
                        </strong>
                    </p>

                    <p>
                        ${status}
                    </p>

                    <hr>

                </div>

            `;

        }
    );

}


// =====================================================
// 27. VENDAS
// =====================================================

function obterVendas() {

    return obterArray(
        "vendas"
    );

}


function calcularTotalVendas() {

    return obterVendas()
        .reduce(
            function(total, venda) {

                return total +
                    valorNumerico(
                        venda.total
                    );

            },
            0
        );

}


// =====================================================
// 28. VENDAS DE HOJE
// =====================================================

function vendasDeHoje() {

    const vendas =
        obterVendas();

    const hoje =
        new Date();


    return vendas.filter(
        function(venda) {

            const data =
                new Date(
                    venda.data
                );


            return (

                data.getFullYear() ===
                hoje.getFullYear() &&

                data.getMonth() ===
                hoje.getMonth() &&

                data.getDate() ===
                hoje.getDate()

            );

        }
    );

}


// =====================================================
// 29. FATURAMENTO DE HOJE
// =====================================================

function faturamentoHoje() {

    return vendasDeHoje()
        .reduce(
            function(total, venda) {

                return total +
                    valorNumerico(
                        venda.total
                    );

            },
            0
        );

}


// =====================================================
// 30. PEDIDOS DE HOJE
// =====================================================

function quantidadePedidosHoje() {

    return vendasDeHoje()
        .length;

}


// =====================================================
// 31. ÚLTIMA VENDA
// =====================================================

function ultimaVenda() {

    const vendas =
        obterVendas();


    if (vendas.length === 0) {

        return null;

    }


    return vendas[
        vendas.length - 1
    ];

}


// =====================================================
// 32. LIMPAR VENDAS
// =====================================================

function limparVendas() {

    const confirmar =
        confirm(

            "⚠️ ATENÇÃO!\n\n" +

            "Isso apagará todas as vendas salvas.\n\n" +

            "Deseja continuar?"

        );


    if (!confirmar) {

        return;

    }


    salvarStorage(
        "vendas",
        []
    );


    alert(
        "✅ Histórico de vendas apagado."
    );

}


// =====================================================
// 33. RESUMO DO GRILLCORE
// =====================================================

function obterResumoGrillCore() {

    return {

        produtos:
            produtos.length,

        vendas:
            obterVendas().length,

        faturamento:
            calcularTotalVendas(),

        pedidosHoje:
            quantidadePedidosHoje(),

        faturamentoHoje:
            faturamentoHoje(),

        clientes:
            obterArray(
                "clientes"
            ).length

    };

}


// =====================================================
// 34. ATUALIZAR SISTEMA
// =====================================================

function atualizarSistema() {

    produtos =
        lerStorage(
            "produtos",
            []
        );


    normalizarProdutos();

    salvarProdutos();


    atualizarListaProdutos();

    atualizarListaCadastro();

    atualizarListaEstoque();

    mostrarEstoque();

    calcularTotal();

}


// =====================================================
// 35. INICIALIZAÇÃO
// =====================================================

window.addEventListener(
    "load",
    function() {

        atualizarSistema();

    }
);


// =====================================================
// 36. VOLTOU PARA A PÁGINA
// =====================================================

window.addEventListener(
    "pageshow",
    function() {

        atualizarSistema();

    }
);


// =====================================================
// 37. ABA FICOU ATIVA
// =====================================================

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