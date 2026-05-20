const wrapper = document.querySelector(".wrapper"),
qrinput = wrapper.querySelector(".form input"),
generatebtn = document.getElementById("gerar"),
qrimg = document.getElementById("imagemQr"),
printbtn = document.getElementById("imprimir"),
downloadbtn = document.getElementById("baixar");

generatebtn.addEventListener("click", () => {
    let qrValue = qrinput.value.trim();
    if (!qrValue) return alert("Por favor, digite um texto ou URL!");
    
    generatebtn.innerText = "Gerando QR Code...";
    generatebtn.disabled = true;
    
    qrimg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`;
    
    qrimg.addEventListener("load", () => {
        wrapper.classList.add("active");
        generatebtn.innerText = "Gerar QR Code";
        generatebtn.disabled = false;
    });
    
    qrimg.addEventListener("error", () => {
        alert("Erro ao gerar QR Code. Tente novamente.");
        generatebtn.innerText = "Gerar QR Code";
        generatebtn.disabled = false;
    });
});

qrinput.addEventListener("keyup", () => {
    if (!qrinput.value.trim()) {
        wrapper.classList.remove("active");
    }
});

// Permitir gerar com Enter
qrinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        generatebtn.click();
    }
});

// Imprimir ou salvar como PDF
printbtn.addEventListener("click", () => {
    if (!qrimg.src || !wrapper.classList.contains("active")) {
        return alert("Gere um QR Code primeiro!");
    }
    
    const janela = window.open("", "_blank");
    const doc = janela.document;
    doc.title = `QR Code - ${qrinput.value}`;

    const style = doc.createElement("style");
    style.textContent = `
        body { 
            text-align: center; 
            font-family: Arial, sans-serif; 
            margin: 50px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
        }
        img { 
            width: 250px; 
            height: 250px; 
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        p { 
            margin-top: 20px; 
            font-size: 16px; 
            color: #555;
            max-width: 400px;
            word-break: break-all;
        }
        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        @media print {
            body { margin: 0; }
        }
    `;
    doc.head.appendChild(style);

    const heading = doc.createElement("h2");
    heading.textContent = "QR Code Gerado";

    const image = doc.createElement("img");
    image.src = qrimg.src;
    image.alt = "QR Code";

    const content = doc.createElement("p");
    content.textContent = `Conteúdo: ${qrinput.value}`;

    doc.body.appendChild(heading);
    doc.body.appendChild(image);
    doc.body.appendChild(content);

    janela.onload = function() {
        janela.print();
    };
    janela.document.close();
});

// Baixar imagem PNG
downloadbtn.addEventListener("click", () => {
    if (!qrimg.src || !wrapper.classList.contains("active")) {
        return alert("Gere um QR Code primeiro!");
    }
    
    const link = document.createElement("a");
    link.href = qrimg.src;
    link.download = "QRCode-Gerado.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});