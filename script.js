// Dados iniciais da Feltroverso
const dadosIniciais = {
  pix: '8ab139f2-06ed-4688-95fd-892052db5773',
  instagram: 'feltroverso.art',
  whatsapp: '11915885178',

  produtos: [
    {
      nome: 'Chaveiro de Fantasma',
      preco: 'R$ 10,00',
      foto: 'fantasminha.jpg'
    },
    {
      nome: 'Chaveiro de Gatinho',
      preco: 'R$ 10,00',
      foto: 'gatinhos.jpg'
    },
    {
      nome: 'Chaveiro de Morcego',
      preco: 'R$ 10,00',
      foto: 'morceguinho1.jpg'
    },
    {
      nome: 'Chaveiro de Morcego',
      preco: 'R$ 10,00',
      foto: 'morceguinho2.jpg'
    },
    {
      nome: 'Chaveiro de Ovinho',
      preco: 'R$ 10,00',
      foto: 'ovinho.jpg'
    },
    {
      nome: 'Chaveiro do Jack',
      preco: 'R$ 10,00',
      foto: 'jack.jpg'
    },
    {
      nome: 'Chaveiro Voodoo',
      preco: 'R$ 10,00',
      foto: 'voodoo.jpg'
    },
  ]
};

const $ = id => document.getElementById(id);

let dados;

try {
  const dadosSalvos = JSON.parse(
    localStorage.getItem('feltroverso') || '{}'
  );

  dados = {
    ...dadosIniciais,
    ...dadosSalvos
  };

  if (!dados.instagram) {
    dados.instagram = dadosIniciais.instagram;
  }

  if (!dados.whatsapp) {
    dados.whatsapp = dadosIniciais.whatsapp;
  }
} catch {
  dados = structuredClone(dadosIniciais);
}

function render() {
  $('gallery').replaceChildren();

  dados.produtos.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'product';

    const media = document.createElement('div');
    media.className = 'product-media';

    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.innerHTML =
      '<span>✦</span>Foto do produto ' + (i + 1);

    const img = document.createElement('img');
    img.alt = p.nome || 'Chaveiro de feltro';
    img.loading = 'lazy';

    img.onerror = () => {
      img.remove();
      media.append(placeholder);
    };

    img.src = p.foto || '';

    if (p.foto) {
      media.append(img);
    } else {
      media.append(placeholder);
    }

    const info = document.createElement('div');
    info.className = 'product-info';

    const name = document.createElement('h3');
    name.textContent = p.nome || 'Chaveiro artesanal';

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = p.preco || 'Sob consulta';

    info.append(name, price);
    card.append(media, info);
    $('gallery').append(card);
  });

  $('pixView').textContent =
    dados.pix || 'Chave Pix a informar';

  $('copyPix').disabled = !dados.pix;

  const ig = dados.instagram
    .trim()
    .replace(/^@/, '');

  const wa = dados.whatsapp
    .replace(/\D/g, '');

  $('instagram').href = ig
    ? 'https://instagram.com/' + encodeURIComponent(ig)
    : '#contato';

  $('whatsapp').href = wa
    ? 'https://wa.me/' +
      (wa.startsWith('55') ? wa : '55' + wa)
    : '#contato';

  $('instagram').target = ig ? '_blank' : '_self';
  $('whatsapp').target = wa ? '_blank' : '_self';

  $('instagram').rel = 'noopener noreferrer';
  $('whatsapp').rel = 'noopener noreferrer';

  $('contactHint').textContent =
    ig || wa
      ? 'Fale com a gente para fazer seu pedido!'
      : 'Contatos serão adicionados em breve.';
}

function calc() {
  const a = $('total').value;
  const b = $('paid').value;

  if (a === '' || b === '') {
    $('change').textContent =
      'Informe os valores acima';
    return;
  }

  const t = Number(a);
  const p = Number(b);

  if (t < 0 || p < 0) {
    $('change').textContent =
      'Digite valores positivos';
    return;
  }

  const fmt = n =>
    n.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  $('change').textContent =
    p >= t
      ? 'Troco: ' +
        fmt(Math.round((p - t) * 100) / 100)
      : 'Faltam: ' +
        fmt(Math.round((t - p) * 100) / 100);
}

$('total').addEventListener('input', calc);
$('paid').addEventListener('input', calc);

$('copyPix').addEventListener('click', async () => {
  if (!dados.pix) return;

  try {
    await navigator.clipboard.writeText(dados.pix);
    $('copyPix').textContent = 'Chave copiada!';
  } catch {
    $('copyPix').textContent =
      'Selecione e copie a chave acima';
  }
});

render();


fetch("https://api.adviceslip.com/advice")
  .then(resposta => resposta.json())
  .then(dados => {
    document.getElementById("frase-api").textContent = dados.slip.advice;
  })
  .catch(erro => {
    document.getElementById("frase-api").textContent = "Não foi possível carregar a frase.";
    console.log("Erro ao acessar a API:", erro);
  });

