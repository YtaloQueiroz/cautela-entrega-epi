// JavaScript original extraído do HTML
const canvas = document.getElementById('signaturePad');
const ctx = canvas.getContext('2d');
let writing = false;

document.getElementById('data').valueAsDate = new Date();

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", { clientX: touch.clientX, clientY: touch.clientY });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
    canvas.dispatchEvent(mouseEvent);
});

function startPosition(e) {
    writing = true;
    draw(e);
}

function endPosition() {
    writing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!writing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function generatePDF() {
    const aceite = document.getElementById('aceite');
    if (!aceite.checked) {
        alert("⚠️ É obrigatório marcar a caixa 'Declaro que li e aceito os termos'.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nome = document.getElementById('nome').value || "Não informado";
    const documento = document.getElementById('documento').value || "Não informado";
    const data = document.getElementById('data').value.split('-').reverse().join('/');

    const rawItens = document.getElementById('itens').value;
    const listaItens = rawItens.split('\n').filter(item => item.trim() !== '');

    const signatureImage = canvas.toDataURL('image/png');

    let currentY = 20;

    doc.setFontSize(22);
    doc.text("Cautela de Entrega de EPI", 20, currentY);
    currentY += 15;

    doc.setFontSize(12);
    doc.text(`Colaborador: ${nome}`, 20, currentY);
    currentY += 10;
    doc.text(`Matrícula: ${documento}`, 20, currentY);
    currentY += 10;
    doc.text(`Data de Retirada: ${data}`, 20, currentY);
    currentY += 20;

    doc.setFontSize(12);
    doc.text("1. TERMOS DE RESPONSABILIDADE", 20, currentY);
    currentY += 10;

    doc.setFontSize(8);
    const texto = "Declaro haver recebido os EPIs... (texto completo)";
    const split = doc.splitTextToSize(texto, 170);
    doc.text(split, 20, currentY);

    currentY += split.length * 3.5 + 20;

    doc.addImage(signatureImage, 'PNG', 70, currentY, 50, 20);
    currentY += 40;

    doc.setFontSize(12);
    doc.text("2. LISTA DE EQUIPAMENTOS", 20, currentY);
    currentY += 10;

    doc.setFontSize(10);
    listaItens.forEach((item) => {
        doc.text(`• ${item}`, 20, currentY);
        currentY += 8;
    });

    doc.save(`Cautela_${nome.replace(/\s+/g, '_')}.pdf`);
}
