/*
Variáveis Globais
*/

let quant_api = 9;
let contar = 0;
let endpoint_principal = "https://api.publicapis.org";
let endpoint_atual = endpoint_principal;
let data_json;
let categories_json;
let content = document.getElementById("content");
let loadArea = document.getElementById("load-area");
let btLoad = document.getElementById("btLoadMore");
let catTitle = document.getElementById("catTitle");
let btInstall = document.getElementById("btInstall");
let filter_api = "";

/*
AJAX Carregar API's
*/

function loadAPIs() {
  let ajax = new XMLHttpRequest();

  ajax.open("GET", `${endpoint_principal}/entries`, true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data_json = JSON.parse(this.responseText);
      data_json = data_json.entries;

      setTimeout(() => {
        loadArea.style.display = "block";
        printCard();
      }, 500);
    }
  };
}

loadAPIs();

/*
Imprimir Card
*/
function printCard() {
  let html_content = "";
  content.innerHTML = html_content;

  if (data_json.length > 0) {
    loadMore();
  } else {
    html_content = msg_alert("Nenhuma API cadastrada!", "warning");
    content.append = html_content;
  }
}

function loadMore() {
  let temp_json =
    filter_api === ""
      ? data_json
      : data_json.filter((d) => filter_api.includes(d.Category));

  let html_content = "";
  let final = contar + quant_api;

  if (final > temp_json.length) {
    final = temp_json.length;
    loadArea.style.display = "none";
  }

  for (let i = contar; i < final; i++) {
    html_content += card(temp_json[i]);
  }

  contar += quant_api;
  content.innerHTML += html_content;
}

/*
Filtro de Categoria
*/

var btCategoria = function (categoria) {
  loadArea.style.display = "block";
  contar = 0;
  filter_api = categoria;
  document.getElementById("catTitle").innerHTML = categoria || "Todos as APIs";
  content.innerHTML = "";
  loadMore();
};

/*
Template Engine
*/

card = function ({ API, Description, Auth, HTTPS, Cors, Link, Category }) {
  let botao =
    navegacao == true
      ? `<a class="btn btn-info" target="_blank" href="${Link}">
            <div class="d-grid gap-2">
                Acessar API
            </div>
        </a>`
      : "";

  let auth = Auth ? Auth : "none";
  let https = HTTPS ? HTTPS : "none";
  let cors = Cors ? Cors : "none";

  return `<div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <div class="card">
                <div class="card-body">
                    <div class="header">
                        <h5 class="card-title">${API}</h5>
                        <h6><span class="badge badge-pill bg-primary">${Category}</span></h6>
                    </div>
                    <div class="body">
                        <p><strong class="strong-auth">Auth: </strong> <span class="span">${auth}</span></p>
                        <p><strong class="strong-https">HTTPS: </strong> <span class="span">${https}</span></p>
                        <p><strong class="strong-cors">Cors: </strong> <span class="span">${cors}</span></p>
                    </div>
                    <p class="card-text">${Description}</p>
                </div>
                ${botao}
            </div>
        </div>`;
};

msg_alert = function (msg, tipo) {
  return `<div class="col-12 col-md-6"><div class="alert alert-${tipo}" role="alert">${msg}</div></div>`;
};

/*
Botão de Instalação
*/

let windowInstall = null;

window.addEventListener("beforeinstallprompt", callInstallWindow);

function callInstallWindow(evt) {
  windowInstall = evt;
}

let initInstall = function () {
  setTimeout(function () {
    if (windowInstall != null) btInstall.removeAttribute("hidden");
  }, 500);

  btInstall.addEventListener("click", function () {
    btInstall.setAttribute("hidden", true);

    windowInstall.prompt();

    windowInstall.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("Usuário instalou o app");
      } else {
        console.log("Usuário recusou instalação");
        btInstall.removeAttribute("hidden");
      }
    });
  });
};

/*
Status do Navegado
*/

let navegacao = true;

window.addEventListener("load", (event) => {
  navigator.onLine ? (navegacao = true) : (navegacao = false);
});
