/* =====================================================
   🍔 GRILLCORE ERP
   SERVICE WORKER
   CACHE PRINCIPAL DO SISTEMA
===================================================== */

const CACHE_NAME = "grillcore-erp-v3";

/* =====================================================
   📦 ARQUIVOS DO SISTEMA
===================================================== */

const ARQUIVOS = [

    "./",

    /* ===============================
       PRINCIPAIS
    =============================== */

    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",

    /* ===============================
       🔐 ACESSO
    =============================== */

    "./login.html",
    "./recuperar-acesso.html",

    /* ===============================
       🏠 DASHBOARD
    =============================== */

    "./dashboard.html",

    /* ===============================
       🛒 VENDAS / PEDIDOS
    =============================== */

    "./pedido2.html",
    "./vendas.html",
    "./relatorio.html",
    "./historico.html",

    /* ===============================
       🍔 PRODUTOS
    =============================== */

    "./produtos.html",

    /* ===============================
       👥 CLIENTES
    =============================== */

    "./cliente.html",
    "./clientes.html",

    /* ===============================
       📦 ESTOQUE
    =============================== */

    "./estoque.html",
    "./historico-estoque.html",

    /* ===============================
       🛍️ COMPRAS / FORNECEDORES
    =============================== */

    "./compras.html",
    "./fornecedores.html",

    /* ===============================
       💰 FINANCEIRO
    =============================== */

    "./financeiro.html",
    "./financeiros.html",
    "./entradas.html",
    "./despesas.html",
    "./fechamentos.html",

    /* ===============================
       💾 BACKUP
    =============================== */

    "./backup.html",

    /* ===============================
       🖼️ ÍCONES PWA
    =============================== */

    "./icon-192.png",
    "./icon-512.png"
];


/* =====================================================
   🚀 INSTALAÇÃO
===================================================== */

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function(cache) {

                return cache.addAll(ARQUIVOS);

            })

            .catch(function(erro) {

                console.error(
                    "GrillCore ERP: erro ao criar cache.",
                    erro
                );

            })

    );

    /* Ativa imediatamente a nova versão */

    self.skipWaiting();

});


/* =====================================================
   🔄 ATIVAÇÃO
   Remove caches antigos
===================================================== */

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()

            .then(function(chaves) {

                return Promise.all(

                    chaves.map(function(chave) {

                        if (chave !== CACHE_NAME) {

                            return caches.delete(chave);

                        }

                        return null;

                    })

                );

            })

            .then(function() {

                return self.clients.claim();

            })

    );

});


/* =====================================================
   🌐 REQUISIÇÕES
===================================================== */

self.addEventListener("fetch", function(event) {

    /*
       Apenas requisições GET podem ser armazenadas
       pelo Cache API.
    */

    if (event.request.method !== "GET") {

        return;

    }


    event.respondWith(

        caches.match(event.request)

            .then(function(respostaCache) {

                /*
                   Se encontrou no cache,
                   utiliza imediatamente.
                */

                if (respostaCache) {

                    return respostaCache;

                }


                /*
                   Se não encontrou,
                   busca normalmente na internet.
                */

                return fetch(event.request)

                    .then(function(respostaRede) {

                        /*
                           Só guarda respostas válidas.
                        */

                        if (
                            respostaRede &&
                            respostaRede.status === 200 &&
                            respostaRede.type !== "opaque"
                        ) {

                            const copia =
                                respostaRede.clone();

                            caches.open(CACHE_NAME)

                                .then(function(cache) {

                                    cache.put(
                                        event.request,
                                        copia
                                    );

                                });

                        }

                        return respostaRede;

                    })

                    .catch(function() {

                        /*
                           Se estiver offline e a página
                           não estiver no cache, tenta
                           entregar o index.
                        */

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});


/* =====================================================
   🔄 MENSAGEM PARA ATUALIZAÇÃO IMEDIATA
===================================================== */

self.addEventListener("message", function(event) {

    if (
        event.data &&
        event.data.tipo === "ATUALIZAR_GRILLCORE"
    ) {

        self.skipWaiting();

    }

});