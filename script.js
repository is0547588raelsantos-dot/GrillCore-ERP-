/* =====================================================
   🍔 GRILLCORE ERP
   SCRIPT.JS
   SISTEMA CENTRAL
   VERSÃO PREMIUM INTEGRADA
===================================================== */


/* =====================================================
   💾 STORAGE — BASE CENTRAL
===================================================== */

function lerStorage(chave, padrao = []){

    try{

        const dados =
            localStorage.getItem(chave);

        if(dados === null){

            return padrao;

        }

        return JSON.parse(dados);

    }
    catch(erro){

        console.error(
            "GrillCore — erro ao ler:",
            chave,
            erro
        );

        return padrao;

    }

}


function salvarStorage(chave, dados){

    try{

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );

        return true;

    }
    catch(erro){

        console.error(
            "GrillCore — erro ao salvar:",
            chave,
            erro
        );

        /*
           Pode acontecer quando o armazenamento
           do navegador está cheio, especialmente
           por causa de fotos em Base64.
        */

        try{

            alert(
                "⚠️ Não foi possível salvar os dados.\n\n" +
                "O armazenamento do navegador pode estar cheio."
            );

        }
        catch(e){}

        return false;

    }

}


/* =====================================================
   📦 ARRAYS
===================================================== */

function obterArray(chave){

    const dados =
        lerStorage(
            chave,
            []
        );

    return Array.isArray(dados)
        ? dados
        : [];

}


/* =====================================================
   💰 DINHEIRO
===================================================== */

function dinheiro(valor){

    const numero =
        valorNumerico(valor);

    return numero.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}


/* =====================================================
   🔢 VALOR NUMÉRICO
===================================================== */

function valorNumerico(valor){

    if(
        valor === null ||
        valor === undefined ||
        valor === ""
    ){

        return 0;

    }


    if(
        typeof valor === "number"
    ){

        return Number.isFinite(valor)
            ? valor
            : 0;

    }


    let texto =
        String(valor)
        .trim();


    texto =
        texto
        .replace(/R\$/gi,"")
        .replace(/\s/g,"");


    /*
       Aceita:

       30
       30.50
       30,50
       1.250,50
    */

    if(
        texto.includes(",") &&
        texto.includes(".")
    ){

        texto =
            texto
            .replace(/\./g,"")
            .replace(",", ".");

    }
    else if(
        texto.includes(",")
    ){

        texto =
            texto.replace(",", ".");

    }


    const numero =
        Number(texto);


    return Number.isFinite(numero)
        ? numero
        : 0;

}


/* =====================================================
   🔢 NÚMERO INTEIRO
===================================================== */

function inteiro(valor){

    const numero =
        Number(valor);

    if(
        !Number.isFinite(numero)
    ){

        return 0;

    }

    return Math.floor(numero);

}


/* =====================================================
   🧮 ARREDONDAMENTO MONETÁRIO
===================================================== */

function arredondarDinheiro(valor){

    return Math.round(
        (
            valorNumerico(valor)
            + Number.EPSILON
        ) * 100
    ) / 100;

}


/* =====================================================
   🆔 GERAR ID
===================================================== */

function gerarID(){

    return (
        Date.now().toString(36)
        +
        Math.random()
            .toString(36)
            .substring(2,8)
    );

}


/* =====================================================
   🛡️ ESCAPAR HTML
===================================================== */

function escapar(texto){

    return String(
        texto ?? ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}


/* =====================================================
   📅 DATA ATUAL
===================================================== */

function dataAtualISO(){

    return new Date().toISOString();

}


/* =====================================================
   📅 DATA LOCAL — YYYY-MM-DD
===================================================== */

function dataLocalISO(){

    const agora =
        new Date();

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2,"0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2,"0");

    return (
        ano +
        "-" +
        mes +
        "-" +
        dia
    );

}


/* =====================================================
   📅 FORMATAR DATA
===================================================== */

function formatarData(data){

    if(!data){

        return "Data não informada";

    }


    const objeto =
        new Date(data);


    if(
        isNaN(
            objeto.getTime()
        )
    ){

        return "Data inválida";

    }


    return objeto.toLocaleDateString(
        "pt-BR"
    );

}


/* =====================================================
   📅 FORMATAR DATA E HORA
===================================================== */

function formatarDataHora(data){

    if(!data){

        return "Data não informada";

    }


    const objeto =
        new Date(data);


    if(
        isNaN(
            objeto.getTime()
        )
    ){

        return "Data inválida";

    }


    return objeto.toLocaleString(
        "pt-BR",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}


/* =====================================================
   🔐 VERIFICAR LOGIN
===================================================== */

function verificarLogin(){

    return (
        localStorage.getItem(
            "grillcore_login"
        ) === "true"
    );

}


/* =====================================================
   👤 USUÁRIO LOGADO
===================================================== */

function usuarioLogado(){

    return (
        localStorage.getItem(
            "grillcore_usuario"
        )
        ||
        "admin"
    );

}


/* =====================================================
   🚪 SAIR
===================================================== */

function sairDoSistema(){

    const confirmar =
        confirm(
            "🚪 Deseja realmente sair do GrillCore?"
        );


    if(!confirmar){

        return;

    }


    localStorage.removeItem(
        "grillcore_login"
    );

    localStorage.removeItem(
        "grillcore_usuario"
    );


    window.location.replace(
        "login.html"
    );

}


/* =====================================================
   🔐 PROTEGER PÁGINA
===================================================== */

function protegerPagina(){

    /*
       O login.html não deve ser protegido.
    */

    const pagina =
        location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if(
        pagina === "login.html"
        ||
        pagina === "recuperar-acesso.html"
        ||
        pagina === ""
    ){

        return true;

    }


    if(
        !verificarLogin()
    ){

        window.location.replace(
            "login.html"
        );

        return false;

    }


    return true;

}


/* =====================================================
   📦 PRODUTOS
===================================================== */

function lerProdutos(){

    return obterArray(
        "produtos"
    );

}


function salvarProdutos(produtos){

    return salvarStorage(
        "produtos",
        Array.isArray(produtos)
            ? produtos
            : []
    );

}


/* =====================================================
   🔎 BUSCAR PRODUTO POR ID
===================================================== */

function buscarProdutoPorID(id){

    const produtos =
        lerProdutos();


    return produtos.find(
        function(produto){

            return String(
                produto.id
            )
            ===
            String(id);

        }
    ) || null;

}


/* =====================================================
   🔎 BUSCAR PRODUTO POR NOME
===================================================== */

function buscarProdutoPorNome(nome){

    const busca =
        String(
            nome || ""
        )
        .trim()
        .toLowerCase();


    if(!busca){

        return null;

    }


    const produtos =
        lerProdutos();


    return produtos.find(
        function(produto){

            return String(
                produto.nome || ""
            )
            .trim()
            .toLowerCase()
            ===
            busca;

        }
    ) || null;

}


/* =====================================================
   👥 CLIENTES
===================================================== */

function lerClientes(){

    return obterArray(
        "clientes"
    );

}


function salvarClientes(clientes){

    return salvarStorage(
        "clientes",
        Array.isArray(clientes)
            ? clientes
            : []
    );

}


/* =====================================================
   🔎 CLIENTE POR ID
===================================================== */

function buscarClientePorID(id){

    const clientes =
        lerClientes();


    return clientes.find(
        function(cliente){

            return String(
                cliente.id
            )
            ===
            String(id);

        }
    ) || null;

}


/* =====================================================
   🛒 COMPRAS
===================================================== */

function lerCompras(){

    return obterArray(
        "compras"
    );

}


function salvarCompras(compras){

    return salvarStorage(
        "compras",
        Array.isArray(compras)
            ? compras
            : []
    );

}


/* =====================================================
   📦 ESTOQUE
===================================================== */

function lerEstoque(){

    return obterArray(
        "estoque"
    );

}


function salvarEstoque(estoque){

    return salvarStorage(
        "estoque",
        Array.isArray(estoque)
            ? estoque
            : []
    );

}


/* =====================================================
   💰 DESPESAS
===================================================== */

function lerDespesas(){

    return obterArray(
        "despesas"
    );

}


function salvarDespesas(despesas){

    return salvarStorage(
        "despesas",
        Array.isArray(despesas)
            ? despesas
            : []
    );

}


/* =====================================================
   💵 VENDAS
===================================================== */

function lerVendas(){

    return obterArray(
        "vendas"
    );

}


function salvarVendas(vendas){

    return salvarStorage(
        "vendas",
        Array.isArray(vendas)
            ? vendas
            : []
    );

}


/* =====================================================
   💵 ENTRADAS
===================================================== */

function lerEntradas(){

    return obterArray(
        "entradas"
    );

}


function salvarEntradas(entradas){

    return salvarStorage(
        "entradas",
        Array.isArray(entradas)
            ? entradas
            : []
    );

}


/* =====================================================
   🧾 FECHAMENTOS
===================================================== */

function lerFechamentos(){

    return obterArray(
        "fechamentosCaixa"
    );

}


function salvarFechamentos(fechamentos){

    return salvarStorage(
        "fechamentosCaixa",
        Array.isArray(fechamentos)
            ? fechamentos
            : []
    );

}


/* =====================================================
   🏭 FORNECEDORES
===================================================== */

function lerFornecedores(){

    return obterArray(
        "fornecedores"
    );

}


function salvarFornecedores(fornecedores){

    return salvarStorage(
        "fornecedores",
        Array.isArray(fornecedores)
            ? fornecedores
            : []
    );

}


/* =====================================================
   📊 CATEGORIA DO PRODUTO
===================================================== */

function nomeCategoriaProduto(categoria){

    const categorias = {

        hamburguer:"Hambúrguer",

        porcao:"Porção",

        bebida:"Bebida",

        outro:"Outro"

    };


    return (
        categorias[
            String(categoria || "")
        ]
        ||
        "Outro"
    );

}


/* =====================================================
   🍔 ÍCONE DA CATEGORIA
===================================================== */

function iconeCategoria(categoria){

    const icones = {

        hamburguer:"🍔",

        porcao:"🍟",

        bebida:"🥤",

        outro:"📦"

    };


    return (
        icones[
            String(categoria || "")
        ]
        ||
        "📦"
    );

}


/* =====================================================
   🧮 CALCULAR TOTAL
===================================================== */

function calcularTotal(){

    let total = 0;


    const campos =
        document.querySelectorAll(
            "[data-preco]"
        );


    campos.forEach(
        function(campo){

            const quantidade =
                valorNumerico(
                    campo.dataset.quantidade
                );


            const preco =
                valorNumerico(
                    campo.dataset.preco
                );


            if(
                quantidade > 0 &&
                preco >= 0
            ){

                total +=
                    quantidade * preco;

            }

        }
    );


    total =
        arredondarDinheiro(
            total
        );


    const elemento =
        document.getElementById(
            "total"
        );


    if(elemento){

        elemento.innerText =
            "Total: " +
            dinheiro(total);

    }


    return total;

}


/* =====================================================
   🧮 CALCULAR TOTAL DE ITENS
===================================================== */

function calcularTotalItens(itens){

    if(
        !Array.isArray(itens)
    ){

        return 0;

    }


    return itens.reduce(
        function(total,item){

            const quantidade =
                valorNumerico(
                    item.quantidade
                )
                ||
                1;


            const subtotal =
                valorNumerico(
                    item.subtotal
                );


            if(subtotal > 0){

                return (
                    total +
                    subtotal
                );

            }


            const preco =
                valorNumerico(
                    item.preco
                );


            return (
                total +
                (
                    quantidade *
                    preco
                )
            );

        },
        0
    );

}


/* =====================================================
   📦 ATUALIZAR LISTA DE PRODUTOS
===================================================== */

function atualizarListaProdutos(){

    if(
        typeof window.atualizarListaProdutosPagina
        ===
        "function"
    ){

        window.atualizarListaProdutosPagina();

    }

}


/* =====================================================
   🍟 ATUALIZAR LISTA DE PORÇÕES
===================================================== */

function atualizarListaPorcoes(){

    if(
        typeof window.atualizarListaPorcoesPagina
        ===
        "function"
    ){

        window.atualizarListaPorcoesPagina();

    }

}


/* =====================================================
   🥤 ATUALIZAR LISTA DE BEBIDAS
===================================================== */

function atualizarListaBebidas(){

    if(
        typeof window.atualizarListaBebidasPagina
        ===
        "function"
    ){

        window.atualizarListaBebidasPagina();

    }

}


/* =====================================================
   👥 ATUALIZAR LISTA DE CLIENTES
===================================================== */

function atualizarListaCadastro(){

    if(
        typeof window.atualizarListaCadastroPagina
        ===
        "function"
    ){

        window.atualizarListaCadastroPagina();

    }

}


/* =====================================================
   📦 MOSTRAR ESTOQUE
===================================================== */

function mostrarEstoque(){

    if(
        typeof window.mostrarEstoquePagina
        ===
        "function"
    ){

        window.mostrarEstoquePagina();

    }

}


/* =====================================================
   💵 MOSTRAR VENDAS
===================================================== */

function mostrarVendas(){

    if(
        typeof window.mostrarVendasPagina
        ===
        "function"
    ){

        window.mostrarVendasPagina();

    }

}


/* =====================================================
   🔄 ATUALIZAR SISTEMA
===================================================== */

function atualizarSistema(){

    atualizarListaProdutos();

    atualizarListaPorcoes();

    atualizarListaBebidas();

    atualizarListaCadastro();

    mostrarEstoque();

    mostrarVendas();

}


/* =====================================================
   📉 BAIXAR ESTOQUE DE PRODUTO
===================================================== */

function baixarEstoque(produtoId, quantidade){

    const qtd =
        valorNumerico(
            quantidade
        );


    if(qtd <= 0){

        return false;

    }


    const produtos =
        lerProdutos();


    const indice =
        produtos.findIndex(
            function(produto){

                return String(
                    produto.id
                )
                ===
                String(produtoId);

            }
        );


    if(indice === -1){

        return false;

    }


    const estoqueAtual =
        valorNumerico(
            produtos[indice].estoque
        );


    if(
        estoqueAtual < qtd
    ){

        return false;

    }


    produtos[indice].estoque =
        estoqueAtual - qtd;


    produtos[indice].atualizadoEm =
        dataAtualISO();


    return salvarProdutos(
        produtos
    );

}


/* =====================================================
   📈 REPOR ESTOQUE DE PRODUTO
===================================================== */

function reporEstoqueProduto(
    produtoId,
    quantidade
){

    const qtd =
        valorNumerico(
            quantidade
        );


    if(qtd <= 0){

        return false;

    }


    const produtos =
        lerProdutos();


    const indice =
        produtos.findIndex(
            function(produto){

                return String(
                    produto.id
                )
                ===
                String(produtoId);

            }
        );


    if(indice === -1){

        return false;

    }


    const atual =
        valorNumerico(
            produtos[indice].estoque
        );


    produtos[indice].estoque =
        atual + qtd;


    produtos[indice].atualizadoEm =
        dataAtualISO();


    return salvarProdutos(
        produtos
    );

}


/* =====================================================
   🧾 NÚMERO DO PEDIDO
===================================================== */

function gerarNumeroPedido(){

    return String(
        Date.now()
    ).slice(-6);

}


/* =====================================================
   🧾 CRIAR VENDA
===================================================== */

function criarVenda(dados){

    const venda =
        {

            id:
                gerarID(),

            numeroPedido:
                dados.numeroPedido
                ||
                gerarNumeroPedido(),

            cliente:
                dados.cliente
                ||
                "",

            clienteId:
                dados.clienteId
                ||
                null,

            telefone:
                dados.telefone
                ||
                "",

            observacao:
                dados.observacao
                ||
                "",

            itens:
                Array.isArray(
                    dados.itens
                )
                    ? dados.itens
                    : [],

            total:
                arredondarDinheiro(
                    dados.total
                ),

            pagamento:
                dados.pagamento
                ||
                "Outro",

            data:
                dados.data
                ||
                dataAtualISO(),

            status:
                dados.status
                ||
                "finalizado",

            criadoEm:
                dataAtualISO()

        };


    return venda;

}


/* =====================================================
   💵 FINALIZAR PEDIDO
===================================================== */

function finalizarPedido(dados){

    /*
       Esta função pode ser utilizada
       pelas páginas que não possuem
       sua própria rotina de finalização.
    */

    if(
        !dados ||
        typeof dados !== "object"
    ){

        return {
            sucesso:false,
            mensagem:"Dados do pedido inválidos."
        };

    }


    const itens =
        Array.isArray(
            dados.itens
        )
            ? dados.itens
            : [];


    if(itens.length === 0){

        return {
            sucesso:false,
            mensagem:"Adicione pelo menos um item ao pedido."
        };

    }


    const totalInformado =
        valorNumerico(
            dados.total
        );


    const totalCalculado =
        calcularTotalItens(
            itens
        );


    const total =
        totalInformado > 0
            ? totalInformado
            : totalCalculado;


    if(total <= 0){

        return {
            sucesso:false,
            mensagem:"O total do pedido precisa ser maior que zero."
        };

    }


    const produtos =
        lerProdutos();


    /*
       Validar estoque antes de salvar
       evita deixar venda pela metade.
    */

    for(
        const item of itens
    ){

        if(
            !item.produtoId
        ){

            continue;

        }


        const produto =
            produtos.find(
                function(p){

                    return String(p.id)
                    ===
                    String(item.produtoId);

                }
            );


        if(!produto){

            return {
                sucesso:false,
                mensagem:
                    "O produto " +
                    (
                        item.nome ||
                        "selecionado"
                    ) +
                    " não foi encontrado."
            };

        }


        const quantidade =
            valorNumerico(
                item.quantidade
            )
            ||
            1;


        const estoque =
            valorNumerico(
                produto.estoque
            );


        if(
            estoque < quantidade
        ){

            return {
                sucesso:false,
                mensagem:
                    "Estoque insuficiente para " +
                    produto.nome +
                    "."
            };

        }

    }


    /*
       Baixar estoque.
    */

    for(
        const item of itens
    ){

        if(
            !item.produtoId
        ){

            continue;

        }


        const quantidade =
            valorNumerico(
                item.quantidade
            )
            ||
            1;


        const indice =
            produtos.findIndex(
                function(p){

                    return String(p.id)
                    ===
                    String(item.produtoId);

                }
            );


        if(indice >= 0){

            produtos[indice].estoque =
                valorNumerico(
                    produtos[indice].estoque
                )
                -
                quantidade;

            produtos[indice].atualizadoEm =
                dataAtualISO();

        }

    }


    const venda =
        criarVenda({

            ...dados,

            itens:itens,

            total:total

        });


    const vendas =
        lerVendas();


    vendas.push(
        venda
    );


    /*
       Salvar estoque primeiro.
       Se falhar, não grava a venda.
    */

    if(
        !salvarProdutos(
            produtos
        )
    ){

        return {
            sucesso:false,
            mensagem:
                "Não foi possível atualizar o estoque."
        };

    }


    if(
        !salvarVendas(
            vendas
        )
    ){

        /*
           Tentativa de rollback do estoque.
        */

        itens.forEach(
            function(item){

                if(!item.produtoId){

                    return;

                }


                const indice =
                    produtos.findIndex(
                        function(p){

                            return String(p.id)
                            ===
                            String(item.produtoId);

                        }
                    );


                if(indice >= 0){

                    produtos[indice].estoque +=
                        valorNumerico(
                            item.quantidade
                        )
                        ||
                        1;

                }

            }
        );


        salvarProdutos(
            produtos
        );


        return {
            sucesso:false,
            mensagem:
                "Não foi possível registrar a venda."
        };

    }


    /*
       Tenta atualizar cliente automaticamente
       quando houver nome e telefone.
    */

    if(
        dados.cliente
        &&
        String(
            dados.cliente
        ).trim()
    ){

        salvarOuAtualizarCliente({

            id:
                dados.clienteId
                ||
                null,

            nome:
                dados.cliente,

            telefone:
                dados.telefone
                ||
                ""

        });

    }


    return {

        sucesso:true,

        venda:venda,

        mensagem:
            "Pedido finalizado com sucesso."

    };

}


/* =====================================================
   👥 SALVAR / ATUALIZAR CLIENTE
===================================================== */

function salvarOuAtualizarCliente(dados){

    if(
        !dados ||
        !String(
            dados.nome || ""
        ).trim()
    ){

        return null;

    }


    const clientes =
        lerClientes();


    const nome =
        String(
            dados.nome
        ).trim();


    const telefone =
        String(
            dados.telefone || ""
        ).trim();


    let indice = -1;


    if(dados.id){

        indice =
            clientes.findIndex(
                function(cliente){

                    return String(
                        cliente.id
                    )
                    ===
                    String(dados.id);

                }
            );

    }


    /*
       Se não encontrou por ID,
       tenta telefone.
    */

    if(
        indice === -1 &&
        telefone
    ){

        indice =
            clientes.findIndex(
                function(cliente){

                    return (
                        String(
                            cliente.telefone || ""
                        )
                        .replace(/\D/g,"")
                        ===
                        telefone.replace(/\D/g,"")
                    );

                }
            );

    }


    /*
       Se ainda não encontrou,
       tenta nome exato.
    */

    if(indice === -1){

        indice =
            clientes.findIndex(
                function(cliente){

                    return (
                        String(
                            cliente.nome || ""
                        )
                        .trim()
                        .toLowerCase()
                        ===
                        nome.toLowerCase()
                    );

                }
            );

    }


    if(indice >= 0){

        clientes[indice].nome =
            nome;


        if(telefone){

            clientes[indice].telefone =
                telefone;

        }


        clientes[indice].atualizadoEm =
            dataAtualISO();


        salvarClientes(
            clientes
        );


        return clientes[indice];

    }


    const novoCliente = {

        id:
            gerarID(),

        nome:
            nome,

        telefone:
            telefone,

        endereco:
            String(
                dados.endereco || ""
            ),

        observacoes:
            String(
                dados.observacoes || ""
            ),

        criadoEm:
            dataAtualISO(),

        atualizadoEm:
            dataAtualISO()

    };


    clientes.push(
        novoCliente
    );


    salvarClientes(
        clientes
    );


    return novoCliente;

}


/* =====================================================
   🔄 ATUALIZAR CLIENTE POR VENDA
===================================================== */

function vincularClienteVenda(
    vendaId,
    clienteId
){

    const vendas =
        lerVendas();


    const indice =
        vendas.findIndex(
            function(venda){

                return String(
                    venda.id
                )
                ===
                String(vendaId);

            }
        );


    if(indice === -1){

        return false;

    }


    vendas[indice].clienteId =
        clienteId;


    vendas[indice].atualizadoEm =
        dataAtualISO();


    return salvarVendas(
        vendas
    );

}


/* =====================================================
   🔄 ATUALIZAR SISTEMA
===================================================== */

function recarregarPaginaDados(){

    atualizarSistema();

}


/* =====================================================
   📡 EVENTO ENTRE ABAS / PÁGINAS
===================================================== */

window.addEventListener(
    "storage",
    function(event){

        /*
           Quando outra página alterar
           localStorage, atualizamos os
           componentes da página atual.
        */

        const chavesImportantes = [

            "produtos",
            "vendas",
            "clientes",
            "estoque",
            "compras",
            "despesas",
            "entradas",
            "fechamentosCaixa",
            "fornecedores"

        ];


        if(
            chavesImportantes.includes(
                event.key
            )
        ){

            atualizarSistema();

        }

    }
);


/* =====================================================
   👀 VOLTOU PARA A PÁGINA
===================================================== */

document.addEventListener(
    "visibilitychange",
    function(){

        if(
            document.visibilityState
            ===
            "visible"
        ){

            atualizarSistema();

        }

    }
);


/* =====================================================
   🚀 INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        /*
           Login é controlado individualmente
           pelos HTMLs atuais.

           Por isso não forçamos redirect aqui,
           evitando conflito com login.html.
        */

        const pagina =
            location.pathname
            .split("/")
            .pop()
            .toLowerCase();


        if(
            pagina === "login.html"
            ||
            pagina === "recuperar-acesso.html"
        ){

            return;

        }


        atualizarSistema();

    }
);


/* =====================================================
   🌐 EXPOR FUNÇÕES GLOBAIS
===================================================== */

window.GrillCore = {

    lerStorage,

    salvarStorage,

    obterArray,

    dinheiro,

    valorNumerico,

    inteiro,

    arredondarDinheiro,

    gerarID,

    escapar,

    verificarLogin,

    usuarioLogado,

    sairDoSistema,

    protegerPagina,

    lerProdutos,

    salvarProdutos,

    buscarProdutoPorID,

    buscarProdutoPorNome,

    lerClientes,

    salvarClientes,

    buscarClientePorID,

    lerCompras,

    salvarCompras,

    lerEstoque,

    salvarEstoque,

    lerDespesas,

    salvarDespesas,

    lerVendas,

    salvarVendas,

    lerEntradas,

    salvarEntradas,

    lerFechamentos,

    salvarFechamentos,

    lerFornecedores,

    salvarFornecedores,

    nomeCategoriaProduto,

    iconeCategoria,

    calcularTotal,

    calcularTotalItens,

    baixarEstoque,

    reporEstoqueProduto,

    gerarNumeroPedido,

    criarVenda,

    finalizarPedido,

    salvarOuAtualizarCliente,

    vincularClienteVenda,

    atualizarSistema

};