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

const buttonAll = document.getElementsByClassName('exportMarkToExcel')[1];
buttonAll.onclick = allToExcell;

//Всі дані з веб-сторінки в ексель 
function allToExcell() {
    const data = [['ПІБ', 'Група', 'Підгрупа', 'Тест', 'Варіант', 'Дата', 'Відповіді', 'НМТ', 'Оцінка']];

    document.querySelectorAll('.user-results__item').forEach(item => {

        const nameClassText = item.querySelector('.result-item__name')?.textContent.trim() || '';
        const nameMatch = nameClassText.match(/^(.+?)\s+(\d{1,2}-[А-Я])\s+(\d)$/);
        const name = nameMatch ? nameMatch[1] : '';
        const group = nameMatch ? nameMatch[2] : '';
        const subgroup = nameMatch ? nameMatch[3] : '';
        //console.log(name, group, subgroup);

        const testLinkElement = item.querySelector('.result-item__test-name a');
        const testVariant = testLinkElement ? testLinkElement.textContent.trim() : '';
        const test = item.querySelector('.result-item__title')?.childNodes[0].textContent.trim() || '';
        const subject = test;
        const variant = testVariant;
        console.log(subject);
        console.log(variant);
        
        const dateText = item.querySelector('.result-item__date')?.textContent.trim() || '';
        const dateMatch = dateText.match(/Дата:\s*([\d.]+)/);
        const date = dateMatch ? dateMatch[1] : '';
        //console.log(date);

        const result = item.querySelector('.result-item__score')?.textContent.trim(':') || '';

        
        const answersMatch = result.replace(/\s+/g, ' ').match(/Відповіді:\s*([\d\sз]+)/);
        const answers = answersMatch ? answersMatch[1].trim() : '';
        //console.log(answersMatch);         
        
        const nmtMatch = result.match(/НМТ:\s*([\d]+)/);
        const nmt = nmtMatch ? nmtMatch[1] : '';        
        //console.log(nmt);

        const scoreMatch = result.match(/Оцінка:\s*([\d]+)/);
        const score = scoreMatch ? scoreMatch[1] : '';
        //console.log(score);

        const answersText = answers ? answers[1].trim() : '';

        data.push([name, group, subgroup, subject, variant, date, answers, nmt, score]);
    }); 

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();

    const columnWidths = [
        { wpx: 220 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 130 },
        { wpx: 60 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 }
    ];
    ws['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, "Всі дані");
    XLSX.writeFile(wb, "all_results.xlsx");
}