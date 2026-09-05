// =====================================================================
// Utilitários compartilhados pelos módulos interativos (Chart.js)
// Estrutura e Evolução Estelar — Notas de Aula (UFS)
//
// Carregar este arquivo (depois do Chart.js, antes do <script> de cada
// capítulo): <script src="assets/comuns.js"></script>
// =====================================================================

// Paleta fixa dos gráficos — mesmas 3 cores em todos os capítulos que
// adotarem o padrão de card branco (ver .modulo-card em estilo.css).
var CORES_GRAFICO = {
  curva: '#1D9E75',    // verde-azulado — curva teórica principal
  marcador: '#D85A30', // terracota — valor atual / destaque
  extra: '#7F77DD'     // roxo — terceira série, quando necessário
};

// linspace(a, b, n): n pontos igualmente espaçados entre a e b (inclusive).
function linspace(a, b, n) {
  var pontos = [];
  if (n <= 1) { pontos.push(a); return pontos; }
  var passo = (b - a) / (n - 1);
  for (var i = 0; i < n; i++) pontos.push(a + i * passo);
  return pontos;
}

// nearestIdx(arr, v): índice do elemento de arr mais próximo de v.
function nearestIdx(arr, v) {
  var melhorIdx = 0;
  var melhorDist = Infinity;
  for (var i = 0; i < arr.length; i++) {
    var d = Math.abs(arr[i] - v);
    if (d < melhorDist) { melhorDist = d; melhorIdx = i; }
  }
  return melhorIdx;
}

// logSlider(t, logMin, logMax): mapeia t em [0,1] (posição linear de um
// slider) para um valor em escala logarítmica, 10^(logMin + t*(logMax-logMin)).
// Usado por sliders cujo range físico cobre muitas ordens de grandeza
// (razões geométricas, profundidade ótica, massa em unidades solares).
function logSlider(t, logMin, logMax) {
  return Math.pow(10, logMin + t * (logMax - logMin));
}

// invLogSlider(v, logMin, logMax): inversa de logSlider — devolve t em [0,1]
// a partir do valor físico v. Útil para posicionar o slider a partir de um
// valor de referência (ex. marcador de um objeto real).
function invLogSlider(v, logMin, logMax) {
  return (Math.log10(v) - logMin) / (logMax - logMin);
}

// chartBaseOptions(xTitulo, yTitulo, extra): opções padrão do Chart.js
// compartilhadas por todos os gráficos — sem legenda, grid neutro, fonte
// enxuta nos eixos. `extra` (opcional) é mesclado por cima (ex. escala
// logarítmica, range fixo).
function chartBaseOptions(xTitulo, yTitulo, extra) {
  var base = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { intersect: false, mode: 'nearest' },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        title: { display: !!xTitulo, text: xTitulo || '', font: { size: 11 } },
        ticks: { font: { size: 11 }, color: '#666' },
        grid: { color: '#e8e6df' }
      },
      y: {
        title: { display: !!yTitulo, text: yTitulo || '', font: { size: 11 } },
        ticks: { font: { size: 11 }, color: '#666' },
        grid: { color: '#e8e6df' }
      }
    }
  };
  if (extra) {
    if (extra.xScale) Object.assign(base.scales.x, extra.xScale);
    if (extra.yScale) Object.assign(base.scales.y, extra.yScale);
  }
  return base;
}

// datasetCurva(xs, ys, cor): dataset de linha contínua, sem pontos.
function datasetCurva(xs, ys, cor) {
  return {
    data: xs.map(function (x, i) { return { x: x, y: ys[i] }; }),
    borderColor: cor || CORES_GRAFICO.curva,
    backgroundColor: cor || CORES_GRAFICO.curva,
    borderWidth: 2.5,
    pointRadius: 0,
    fill: false,
    tension: 0
  };
}

// datasetMarcador(xs, idx, ys, cor): dataset "esparso" com um único ponto
// visível (o valor atual), no índice idx do array — o padrão de marcador
// ao vivo usado em todos os módulos de curva.
function datasetMarcador(xs, idx, ys, cor) {
  var data = xs.map(function (x, i) {
    return { x: x, y: i === idx ? ys[i] : null };
  });
  return {
    data: data,
    borderColor: cor || CORES_GRAFICO.marcador,
    backgroundColor: cor || CORES_GRAFICO.marcador,
    pointRadius: data.map(function (p) { return p.y === null ? 0 : 6; }),
    pointHoverRadius: 6,
    borderWidth: 0,
    showLine: false,
    spanGaps: false
  };
}
