// Dados iniciais da Feltroverso
const dadosIniciais = {
  pix: '',
  instagram: 'feltroverso.art',
  whatsapp: '11915885178',

  produtos: [
    {
      nome: 'Chaveirinho 01',
      preco: 'Sob consulta',
      foto: 'imagens/produto-1.jpg'
    },
    {
      nome: 'Chaveirinho 02',
      preco: 'Sob consulta',
      foto: 'imagens/produto-2.jpg'
    },
    {
      nome: 'Chaveirinho 03',
      preco: 'Sob consulta',
      foto: 'imagens/produto-3.jpg'
    },
    {
      nome: 'Chaveirinho 04',
      preco: 'Sob consulta',
      foto: 'imagens/produto-4.jpg'
    },
    {
      nome: 'Chaveirinho 05',
      preco: 'Sob consulta',
      foto: 'imagens/produto-5.jpg'
    },
    {
      nome: 'Chaveirinho 06',
      preco: 'Sob consulta',
      foto: 'imagens/produto-6.jpg'
    },
    {
      nome: 'Chaveirinho 07',
      preco: 'Sob consulta',
      foto: 'imagens/produto-7.jpg'
    },
    {
      nome: 'Chaveirinho 08',
      preco: 'Sob consulta',
      foto: 'imagens/produto-8.jpg'
    }
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

function fillEditor() {
  $('editPix').value = dados.pix;
  $('editInstagram').value = dados.instagram;
  $('editWhatsapp').value = dados.whatsapp;

  $('productEditors').replaceChildren();

  dados.produtos.forEach((p, i) => {
    const box = document.createElement('div');
    box.className = 'edit-product';

    const h = document.createElement('strong');
    h.textContent = 'Produto ' + (i + 1);

    box.append(h);

    [
      ['Nome', 'nome'],
      ['Preço (ex.: R$ 10,00)', 'preco'],
      ['Caminho da foto', 'foto']
    ].forEach(([label, key]) => {
      const lab = document.createElement('label');
      lab.textContent = label;

      const inp = document.createElement('input');
      inp.value = p[key] || '';
      inp.dataset.index = i;
      inp.dataset.field = key;

      lab.append(inp);
      box.append(lab);
    });

    $('productEditors').append(box);
  });
}

function toggleEditor(open) {
  $('editor').hidden = !open;

  $('editToggle').setAttribute(
    'aria-expanded',
    String(open)
  );

  if (open) {
    fillEditor();
  }
}

$('editToggle').addEventListener('click', () =>
  toggleEditor($('editor').hidden)
);

$('closeEditor').addEventListener('click', () =>
  toggleEditor(false)
);

$('save').addEventListener('click', () => {
  dados.pix = $('editPix').value.trim();

  dados.instagram =
    $('editInstagram').value.trim() ||
    dadosIniciais.instagram;

  dados.whatsapp =
    $('editWhatsapp').value.trim() ||
    dadosIniciais.whatsapp;

  document
    .querySelectorAll('.edit-product input')
    .forEach(inp => {
      dados.produtos[
        Number(inp.dataset.index)
      ][inp.dataset.field] =
        inp.value.trim();
    });

  localStorage.setItem(
    'feltroverso',
    JSON.stringify(dados)
  );

  render();

  $('saveMessage').textContent =
    'Salvo neste navegador! Para publicar para todos, atualize o script.js.';
});

$('reset').addEventListener('click', () => {
  if (
    !confirm(
      'Restaurar os dados de exemplo neste navegador?'
    )
  ) {
    return;
  }

  localStorage.removeItem('feltroverso');
  dados = structuredClone(dadosIniciais);

  fillEditor();
  render();

  $('saveMessage').textContent =
    'Dados de exemplo restaurados.';
});

render();
