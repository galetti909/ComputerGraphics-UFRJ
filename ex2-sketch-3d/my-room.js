// ===========================================
// QUARTO 3D - P5.js
// ===========================================

// --- tamanho do quarto ---
const larguraTotal     = 380;
const profundidadeTotal = 340;
const alturaTotal      = 280;
const profundidadeApendice = 160;
const larguraApendice  = 210;
const larguraCorredor  = larguraTotal - larguraApendice;
const inicioApendiceX  = -larguraTotal/2 + larguraCorredor;

// --- paleta de cores ---
const piso          = [72,  62,  54];
const teto          = [242, 240, 235];
const paredeNormal  = [232, 228, 220];
const paredeInterna = [215, 210, 200];
const madeiraClara  = [245, 240, 228];
const madeiraMedia  = [200, 185, 160];
const madeiraEscura = [180, 165, 145];
const lencol        = [100, 140, 135];
const travesseiro   = [120, 160, 155];
const pretoCadeira  = [40,  40,  45];
const madeiraporta  = [180, 160, 130];

// abreviações úteis
const L  = larguraTotal;
const P  = profundidadeTotal;
const A  = alturaTotal;
const AP = profundidadeApendice;
const AX = inicioApendiceX;

// ===========================================

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
}

function draw() {
  background(22, 22, 26);
  ambientLight(110, 108, 105);
  pointLight(255, 245, 220,  100, -100,  200);
  pointLight(140, 130, 160, -200,  -50, -100);
  orbitControl();

  quarto();
  moveis();
}

// ===========================================
// HELPERS
// ===========================================

function caixa(cor, x, y, z, largura, altura, profundidade) {
  push();
  ambientMaterial(...cor);
  translate(x, y, z);
  box(largura, altura, profundidade);
  pop();
}

function superficiePlana(cor, x, y, z, largura, altura, rotacaoY) {
  push();
  ambientMaterial(...cor);
  translate(x, y, z);
  if (rotacaoY) rotateY(rotacaoY);
  plane(largura, altura);
  pop();
}

// posições de referência frequentes
function chao()    { return  A/2; }   // y do chão
function fundoZ()  { return -P/2; }   // z da parede do fundo
function direitaX(){ return  L/2; }   // x da parede direita
function esquerdaX(){ return -L/2; }  // x da parede esquerda

// ===========================================
// QUARTO
// ===========================================

function quarto() {
  // piso
  push(); ambientMaterial(...piso);
  translate(0, chao(), 0); rotateX(HALF_PI); plane(L, P); pop();

  // teto
  push(); ambientMaterial(...teto);
  translate(0, -A/2, 0); rotateX(HALF_PI); plane(L, P); pop();

  // paredes externas
  superficiePlana(paredeNormal,  0,         0, fundoZ(),  L, A);
  superficiePlana(paredeNormal,  esquerdaX(), 0, 0,       P, A, HALF_PI);
  superficiePlana(paredeNormal,  direitaX(),  0, 0,       P, A, HALF_PI);

  // paredes internas que formam o L
  superficiePlana(paredeInterna, AX,                    0, fundoZ() + AP/2, AP, A, HALF_PI);
  superficiePlana(paredeInterna, esquerdaX() + larguraCorredor/2, 0, fundoZ() + AP, larguraCorredor, A);
}

// ===========================================
// MÓVEIS
// ===========================================

function moveis() {
  escrivaninha();
  gabinete();
  estanteLivros();
  cama();
  estanteRoupas();
  mesaCabeceira();
  cadeira();
  porta();
  arCondicionado();
  monitores();
}

function escrivaninha() {
  const largura    = larguraApendice - 50;
  const profundidade = 70;
  const altura     = 80;
  const espessura  = 3;
  const alturaGavetas = 32; // tampo grosso simula bloco de gavetas

  // perna esquerda
  caixa(madeiraClara,
    AX + espessura/2,
    chao() - altura/2,
    fundoZ() + profundidade/2,
    espessura, altura, profundidade);

  // perna direita
  caixa(madeiraClara,
    AX + largura - espessura/2,
    chao() - altura/2,
    fundoZ() + profundidade/2,
    espessura, altura, profundidade);

  // tampo com altura generosa (simula gavetas laterais)
  caixa(madeiraClara,
    AX + largura/2,
    chao() - altura + alturaGavetas/2,
    fundoZ() + profundidade/2,
    largura, alturaGavetas, profundidade);
}

function gabinete() {
  const largura     = 25;
  const profundidade = 50;
  const altura      = 60;

  caixa([80, 82, 85],
    AX + largura/2 + 5,
    chao() - altura/2,
    fundoZ() + profundidade/2,
    largura, altura, profundidade);
}

function estanteLivros() {
  const espessura  = 3;
  const largura    = 40;   // profundidade no eixo X
  const profundidade = 50; // largura no eixo Z
  const altura     = 150;
  const andares    = 5;
  const alturaAndar = (altura - espessura) / andares;

  const x = direitaX();
  const z = fundoZ();

  caixa(madeiraMedia, x - largura/2, chao() - altura, z + profundidade/2, largura, espessura, profundidade); // topo
  caixa(madeiraMedia, x - largura/2, chao(),           z + profundidade/2, largura, espessura, profundidade); // base
  caixa(madeiraMedia, x - largura/2, chao() - altura/2, z + espessura/2,   largura, altura, espessura);       // fundo Z-
  caixa(madeiraMedia, x - espessura/2, chao() - altura/2, z + profundidade/2, espessura, altura, profundidade); // lateral X+
  caixa(madeiraMedia, x - largura + espessura/2, chao() - altura/2, z + profundidade/2, espessura, altura, profundidade); // lateral X-

  for (let i = 1; i < andares; i++) {
    caixa(madeiraMedia,
      x - largura/2,
      chao() - i * alturaAndar,
      z + profundidade/2,
      largura, espessura, profundidade);
  }
}

function cama() {
  const largura      = 220;
  const profundidade = 140;
  const alturaBase   = 25;
  const alturaColchao = 18;
  const alturaPes    = 12;
  const ladoPe       = 8;

  const xCentro = direitaX() - largura/2;
  const zCentro = P/2 - profundidade/2;

  // 4 pés nas quinas
  for (let sx of [-1, 1]) {
    for (let sz of [-1, 1]) {
      caixa([30, 30, 32],
        xCentro + sx * (largura/2 - ladoPe),
        chao() - alturaPes/2,
        zCentro + sz * (profundidade/2 - ladoPe),
        ladoPe, alturaPes, ladoPe);
    }
  }

  // base preta (box spring)
  caixa([30, 30, 32],
    xCentro, chao() - alturaPes - alturaBase/2, zCentro,
    largura, alturaBase, profundidade);

  // colchão
  caixa(lencol,
    xCentro, chao() - alturaPes - alturaBase - alturaColchao/2, zCentro,
    largura - 6, alturaColchao, profundidade - 6);

  // travesseiro (colado na parede direita)
  const larguraTravesseiro = 35;
  const alturaTravesseiro  = 12;
  caixa(travesseiro,
    direitaX() - larguraTravesseiro/2,
    chao() - alturaPes - alturaBase - alturaColchao - alturaTravesseiro/2,
    zCentro,
    larguraTravesseiro - 4, alturaTravesseiro, profundidade - 10);
}

function estanteRoupas() {
  const espessura  = 3;
  const largura    = 30;  // eixo X (fina, encostada na parede)
  const profundidade = 70; // eixo Z
  const altura     = 180;
  const andares    = 5;
  const alturaAndar = (altura - espessura) / andares;

  const x = esquerdaX();
  const z = AP/2; // centro da parte baixa do quarto

  caixa(madeiraEscura, x + largura/2, chao() - altura, z, largura, espessura, profundidade); // topo
  caixa(madeiraEscura, x + largura/2, chao(),           z, largura, espessura, profundidade); // base
  caixa(madeiraEscura, x + largura/2, chao() - altura/2, z - profundidade/2 + espessura/2, largura, altura, espessura); // fundo
  caixa(madeiraEscura, x + largura/2, chao() - altura/2, z + profundidade/2 - espessura/2, largura, altura, espessura); // lateral direita

  for (let i = 1; i < andares; i++) {
    caixa(madeiraEscura,
      x + largura/2,
      chao() - i * alturaAndar,
      z,
      largura, espessura, profundidade);
  }
}

function mesaCabeceira() {
  const espessura    = 3;
  const largura      = 35;  // eixo X, colada na parede direita
  const profundidade = 45;  // eixo Z, paralelo à parede
  const altura       = 50;
  const alturaCorpo  = altura * 0.6;
  const alturaPrateleira = altura - alturaCorpo;

  const x = direitaX() - largura/2;
  const z = P/2 - 140 - profundidade/2 - 5; // 140 = profundidade da cama, sem sobrepor

  // corpo sólido embaixo
  caixa(madeiraClara, x, chao() - alturaCorpo/2, z, largura, alturaCorpo, profundidade);

  // topo
  caixa(madeiraClara, x, chao() - altura, z, largura, espessura, profundidade);

  // prateleira aberta em cima: fundo e lateral fechados, frente aberta
  caixa(madeiraClara, x, chao() - alturaCorpo - alturaPrateleira/2, z - profundidade/2 + espessura/2, largura, alturaPrateleira, espessura);
  caixa(madeiraClara, x, chao() - alturaCorpo - alturaPrateleira/2, z + profundidade/2 - espessura/2, largura, alturaPrateleira, espessura);
}

function cadeira() {
  const larguraEscrivaninha  = larguraApendice - 50;
  const profundidadeEscrivaninha = 70;

  const largura      = 45;
  const profundidade = 45;
  const espessuraAssento = 5;
  const alturaPernas = 45;
  const ladoPerna    = 4;
  const alturaEncosto = 70;
  const espessuraEncosto = 3;

  const cx = AX + larguraEscrivaninha/2;
  const cz = fundoZ() + profundidadeEscrivaninha + profundidade/2 + 15;
  const yAssento = chao() - alturaPernas - espessuraAssento/2;

  // pernas
  for (let sx of [-1, 1]) {
    for (let sz of [-1, 1]) {
      caixa(madeiraMedia,
        cx + sx * (largura/2 - ladoPerna),
        chao() - alturaPernas/2,
        cz + sz * (profundidade/2 - ladoPerna),
        ladoPerna, alturaPernas, ladoPerna);
    }
  }

  // assento
  caixa(madeiraMedia, cx, yAssento, cz, largura, espessuraAssento, profundidade);

  // encosto (atrás, oposto à escrivaninha)
  caixa(madeiraMedia,
    cx,
    yAssento - alturaEncosto/2,
    cz + profundidade/2 - espessuraEncosto/2,
    largura, alturaEncosto, espessuraEncosto);
}

function porta() {
  const largura     = 90;
  const altura      = 160;
  const espessura   = 5;

  caixa(madeiraporta,
    AX - largura * 1.1,
    chao() - altura/2,
    fundoZ() + AP,
    largura, altura, espessura);
}

function arCondicionado() {
  const largura     = 120;
  const profundidade = 20;
  const altura      = 25;

  caixa([220, 225, 230],
    AX + larguraApendice/2,
    -A/2 + altura/2 + 10,
    fundoZ() + profundidade/2,
    largura, altura, profundidade);
}

function monitores() {
  const larguraTela  = 40;
  const alturaTela   = 30;
  const espessuraTela = 3;
  const larguraApoio  = 5;
  const alturaApoio   = 15;
  const profundidadeApoio = 5;

  const larguraEscrivaninha  = larguraApendice - 50;
  const profundidadeEscrivaninha = 70;
  const alturaEscrivaninha   = 80;

  const yTopoMesa = chao() - alturaEscrivaninha;
  const zMonitor  = fundoZ() + profundidadeEscrivaninha/2;

  for (let [fator] of [[0.3], [0.7]]) {
    const mx = AX + larguraEscrivaninha * fator;
    caixa([40, 40, 42], mx, yTopoMesa - alturaApoio/2,      zMonitor, larguraApoio, alturaApoio,  profundidadeApoio);
    caixa([25, 25, 28], mx, yTopoMesa - alturaApoio - alturaTela/2, zMonitor, larguraTela,  alturaTela, espessuraTela);
  }
}