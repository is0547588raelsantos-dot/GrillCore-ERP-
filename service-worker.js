const CACHE_NAME = "grillcore-erp-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./produtos.html",
    "./pedido.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME).then(function(cache) {

            return cache.addAll(ARQUIVOS);

        })

    );

    self.skipWaiting();

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys().then(function(chaves) {

            return Promise.all(

                chaves.map(function(chave) {

                    if(chave !== CACHE_NAME) {

                        return caches.delete(chave);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request).then(function(resposta) {

            return resposta || fetch(event.request);

        })

    );

});