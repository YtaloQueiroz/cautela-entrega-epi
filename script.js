// Ajuste de Data para Hoje
document.getElementById("data").valueAsDate = new Date();

// Função para Adicionar Item na Lista
// ATUALIZADA: Agora insere os inputs com as mesmas classes "shadcn" do HTML principal
function addItem() {
  const container = document.getElementById("lista-epis");
  const div = document.createElement("div");

  // Adiciona classes de animação e layout
  div.className =
    "flex gap-3 items-center item-row animate-in fade-in slide-in-from-top-1 duration-300";

  div.innerHTML = `
                <div class="flex flex-wrap gap-3 items-center item-row animate-in fade-in slide-in-from-top-1 duration-300">
                            <input type="text" class="item-name flex-1 h-10 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2" placeholder="Nome do EPI (Ex: Luva Isolante)" required>
                            <input type="text" class="item-ca w-24 h-10 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2" placeholder="CA" oninput="this.value = this.value.replace(/[^0-9]/g, '')" inputmode="numeric">
                            
                            <button type="button" class="group h-10 w-10 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2" onclick="removeItem(this)" title="Remover item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
            `;
  container.appendChild(div);
}

// Função para Remover Item
function removeItem(button) {
  const container = document.getElementById("lista-epis");
  if (container.children.length > 1) {
    // Remove com um pequeno delay visual se quiser (opcional), aqui remove direto
    button.parentElement.remove();
  } else {
    button.parentElement.querySelector(".item-name").value = "";
    button.parentElement.querySelector(".item-ca").value = "";
  }
}

function getBase64Image(imgElement) {
  const canvas = document.createElement("canvas");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgElement, 0, 0);
  return canvas.toDataURL("image/png");
}

// Função para Gerar PDF
async function generatePDF(event) {
  event.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nome =
    document.getElementById("nome").value || "__________________________";
  const documento = document.getElementById("documento").value || "__________";
  const cargo =
    document.getElementById("cargo").value || "____________________";
  const data = document
    .getElementById("data")
    .value.split("-")
    .reverse()
    .join("/");
  const imgElement = document.getElementById("logo");

  let imgData = null;
  try {
    imgData = getBase64Image(imgElement);
  } catch (e) {
    console.warn("Logo não carregada");
  }

  const itemRows = document.querySelectorAll(".item-row");
  const listaItens = [];
  itemRows.forEach((row) => {
    const nomeItem = row.querySelector(".item-name").value.trim();
    const caItem = row.querySelector(".item-ca").value.trim();
    if (nomeItem) {
      listaItens.push({ nome: nomeItem, ca: caItem });
    }
  });

  let currentY = 20;

  // Cabeçalho PDF
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("Cautela de Entrega de EPI", 20, currentY);
  currentY += 5;

  if (imgData) {
    doc.addImage(imgData, "PNG", 165, 8, 25, 15);
  }

  doc.setLineWidth(0.5);
  doc.line(20, currentY, 190, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setTextColor(0);

  doc.setFont(undefined, "bold");
  doc.text(
    "Empresa: ELINSA ELETROTÉCNICA INDUSTRIAL E NAVAL DO BRASIL LTDA",
    20,
    currentY
  );
  currentY += 7;
  doc.setFont(undefined, "normal");

  doc.text(`Colaborador: ${nome}`, 20, currentY);
  currentY += 7;
  doc.text(`Matrícula: ${documento}`, 20, currentY);
  currentY += 7;
  doc.text(`Cargo: ${cargo}`, 20, currentY);
  currentY += 7;
  doc.text(`Data de Retirada: ${data}`, 20, currentY);
  currentY += 12;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("EQUIPAMENTOS RECEBIDOS E CONFERIDOS", 20, currentY);
  currentY += 8;

  doc.setFontSize(7);
  doc.setFont(undefined, "normal");

  const termosTexto =
    "Declaro para todos os efeitos legais, que estou ciente das obrigações que passo a assumir com relação a cada EPI, constante na Norma Regulamentadora NR – 6 da portaria 3214/78, inscrita no subitem 6.7.1, a saber:\n" +
    "• Usar o EPI apenas para a finalidade a que se destina;\n" +
    "• Responsabilizar-me pela guarda e conservação do EPI;\n" +
    "• Comunicar ao Departamento de Segurança da empresa qualquer alteração que torne o EPI impróprio para o uso;\n" +
    "• Que me encontro ciente e coloco minha anuência às disposições do Art. 462, parágrafo 1º da Consolidação das Leis do Trabalho, autorizando o desconto salarial proporcional ao custo da reparação do dano que eventualmente, vier a provocar em qualquer EPI, já que atesto tê-lo recebido em perfeitas condições;\n" +
    "• Que estou ciente também da disposição legal constante na NR – 1, especificamente do subitem 1.8.1, de que constitui ato faltoso a recusa injustificada de usar o EPI fornecido pela Empresa, incorrendo nas penalidades previstas na Lei;\n" +
    "• Que devo devolver todo o EPI em meu poder, no ato do meu desligamento da Empresa.\n\n" +
    "Obs.: Item “h” do Ato de Indisciplina e/ou insubordinação – Art. 482 do Decreto-Lei nº 5452 de 01/03/43 – CLT: Advertência Verbal, Advertência por Escrito, Suspensão, Demissão por Justa Causa.\n\n" +
    "Declaro haver recebido da ELINSA ELETROTÉCNICA INDUSTRIAL E NAVAL DO BRASIL LTDA, o(s) Equipamento(s) de Proteção Individual (EPI´s) abaixo relacionado(s), tendo sido orientado para sua correta utilização e quanto às precauções a tomar no sentido de evitar acidentes do trabalho ou doenças profissionais ou do trabalho.";

  const splitTermos = doc.splitTextToSize(termosTexto, 170);
  doc.text(splitTermos, 20, currentY);

  currentY += splitTermos.length * 3 + 8;

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    "(Assine ao lado de cada item para confirmar o recebimento)",
    20,
    currentY
  );
  doc.setTextColor(0);
  currentY += 8;

  listaItens.forEach((item) => {
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(10);
    const textoItem = item.ca
      ? `• ${item.nome} (CA: ${item.ca})`
      : `• ${item.nome}`;
    doc.text(textoItem, 20, currentY);

    doc.setDrawColor(150);
    doc.setLineDash([1, 1], 0);
    doc.line(130, currentY, 190, currentY);
    doc.setLineDash([]);
    doc.setDrawColor(0);

    doc.setFontSize(7);
    doc.text("Assinatura", 130, currentY + 3);
    doc.setFontSize(10);

    currentY += 10;
  });

  currentY += 55;

  if (currentY > 275) {
    doc.addPage();
    currentY = 40;
  }

  doc.line(65, currentY, 145, currentY);
  doc.text("Assinatura do Colaborador", 105, currentY + 5, {
    align: "center",
  });

  doc.save(
    `Cautela_${nome.replace(/\s+/g, "_")}_${data.replace(/\//g, "-")}.pdf`
  );
}
