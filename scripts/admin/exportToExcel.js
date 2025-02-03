function showExportModal() {
    if (document.getElementById('exportModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'exportModal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.3)';
    
    const fields = new Set();
    document.querySelectorAll('.user-results__item .result-item__title').forEach(item => {
        fields.add(item.childNodes[0].textContent.trim());
    });
    
    const sortedFields = Array.from(fields).sort((a, b) => {
        const order = ['Українська мова', 'Математика', 'Історія України', 'Англійська мова'];
        const indexA = order.includes(a) ? order.indexOf(a) : order.length + a.localeCompare(b);
        const indexB = order.includes(b) ? order.indexOf(b) : order.length + b.localeCompare(a);
        return indexA - indexB;
    });
    
    const fieldArray = ['ПІБ', ...sortedFields];
    
    const orderContainer = document.createElement('ul');
    orderContainer.className = 'export-block'
    orderContainer.style.listStyle = 'none';
    orderContainer.style.padding = '0';
    orderContainer.style.marginBottom = '10px';
    
    fieldArray.forEach(field => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.cursor = 'grab';
        li.draggable = true;
        if (field === 'ПІБ') {
            li.innerHTML = `<div><input type='checkbox' class='test-check-box' value='${field}' checked> <span>${field} </span></div>
                        <input type='number' class='column-width' value='200' style='width: 60px; margin-left: 10px;'>`; 
        } else {
            li.innerHTML = `<div><input type='checkbox' class='test-check-box' value='${field}' checked><span> ${field} </span></div>
            <input type='number' class='column-width' value='100' style='width: 60px; margin-left: 10px;'>`;
        }           
       
        orderContainer.appendChild(li);
        
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', field);
        });
    });
    
    orderContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    orderContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedField = e.dataTransfer.getData('text/plain');
        const items = [...orderContainer.children];
        const draggedIndex = items.findIndex(li => li.textContent.includes(draggedField));
        const targetIndex = items.findIndex(li => li.contains(e.target));
        
        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            orderContainer.insertBefore(items[draggedIndex], items[targetIndex]);
        }
    });
    
    modal.appendChild(orderContainer);
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Експортувати';
    exportButton.className = 'test-footer__button test-footer__submit'; 
    exportButton.onclick = () => exportToExcel(orderContainer);
    modal.appendChild(exportButton);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрити';
    closeButton.className = 'test-footer__button admin-page__delete'; 
    closeButton.onclick = () => document.body.removeChild(modal);
    closeButton.style.marginLeft = '10px';
    modal.appendChild(closeButton);
    
    document.body.appendChild(modal);
}

function exportToExcel(orderContainer) {
    const dataMap = new Map();
    
    document.querySelectorAll('.user-results__item').forEach(item => {
        const nameClassText = item.querySelector('.result-item__name')?.textContent.trim() || '';
        const [name] = nameClassText.split(/\s+(?=\d)/);
        
        if (!dataMap.has(name)) {
            dataMap.set(name, { 'ПІБ': name });
        }
        
        const subject = item.querySelector('.result-item__title')?.childNodes[0].textContent.trim() || '';
        const nmtText = item.querySelector('.result-item__score')?.textContent || '';
        const nmtMatch = nmtText.match(/НМТ:\s*([^\n]+)/);
        const nmt = nmtMatch ? nmtMatch[1].trim() : '';
        
        dataMap.get(name)[subject] = nmt;
    });
    
    const headers = [];
    const columnWidths = [];
    
    [...orderContainer.children].forEach(li => {
        const checkbox = li.querySelector('.test-check-box');
        const widthInput = li.querySelector('.column-width');
        
        if (checkbox.checked) {
            headers.push(checkbox.value);
            columnWidths.push(parseInt(widthInput.value));
        }
    });
    
    const data = [headers];
    
    dataMap.forEach(entry => {
        const row = headers.map(header => entry[header] || '');
        data.push(row);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = columnWidths.map(width => ({ wpx: width }));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Результати");
    XLSX.writeFile(wb, "results.xlsx");
    document.body.removeChild(document.getElementById('exportModal'));
}

const button = document.getElementsByClassName('exportMarkToExcel')[0];
button.onclick = showExportModal;

if (!window.XLSX) {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => console.log("XLSX бібліотека завантажена");
    document.head.appendChild(script);
}