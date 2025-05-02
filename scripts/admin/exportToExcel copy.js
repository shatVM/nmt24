function exportToExcel() {
    const selectedFields = Array.from(document.querySelectorAll('.export-checkbox:checked')).map(cb => cb.value);
    const headers = ['ПІБ', 'Клас', 'Підгрупа', 'Предмет', 'Варіант', 'Дата', 'Час', 'Відповіді', 'НМТ', 'Оцінка'];
    const indices = selectedFields.map(field => headers.indexOf(field));
    const data = [];
    
    document.querySelectorAll('.user-results__item').forEach(item => {
        const nameClassText = item.querySelector('.result-item__name')?.textContent.trim() || '';
        const [name, className, subgroup] = nameClassText.split(/\s+(?=\d)/); // Розділяємо ПІБ, клас та підгрупу
        const subject = item.querySelector('.result-item__title')?.childNodes[0].textContent.trim() || '';
        const variant = item.querySelector('.result-item__test-name a')?.textContent.trim() || '';
        const dateTimeText = item.querySelector('.result-item__date')?.textContent.replace('Дата: ', '').trim() || '';
        const [date, time] = dateTimeText.split(' ');
        const answers = item.querySelector('.user-score')?.textContent.trim() || '';
        const totalAnswers = item.querySelector('.general-score')?.textContent.trim() || '';
        
        const nmtText = item.querySelector('.result-item__score')?.textContent || '';
        const nmtMatch = nmtText.match(/НМТ:\s*(\d+)/);
        const nmt = nmtMatch ? nmtMatch[1] : '';
        
        const grade = item.querySelector('.result-item__score b:nth-of-type(2)')?.textContent.trim() || '';
        
        const rowData = [name, className, subgroup, subject, variant, date, time, answers + '/' + totalAnswers, nmt, grade];
        data.push(indices.map(i => rowData[i]));
    });
    
    

    const ws = XLSX.utils.aoa_to_sheet([
        selectedFields,
        ...data
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Результати");
    XLSX.writeFile(wb, "results.xlsx");

    document.body.removeChild(document.getElementById('exportModal'));
}

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
    
    const fields = ['ПІБ', 'Клас', 'Підгрупа', 'Предмет', 'Варіант', 'Дата', 'Час', 'Відповіді', 'НМТ', 'Оцінка'];
    fields.forEach(field => {
        const label = document.createElement('label');
        label.className = 'export-block'
        label.innerHTML = `<input type='checkbox' class='test-check-box' value='${field}' checked> ${field}`;
        modal.appendChild(label);        
        modal.appendChild(document.createElement('br'));
    });
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Експортувати';
    exportButton.className = 'test-footer__button test-footer__submit'; 
    exportButton.onclick = exportToExcel;
    modal.appendChild(exportButton);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрити';
    closeButton.className = 'test-footer__button admin-page__delete'; //
    closeButton.onclick = () => document.body.removeChild(modal);
    closeButton.style.marginLeft = '10px';
    modal.appendChild(closeButton);
    
    document.body.appendChild(modal);
}

const button = document.getElementsByClassName('exportMarkToExcel')[0];
button.onclick = showExportModal;


function exportToExcel2() {
    const dataMap = new Map();
    
    document.querySelectorAll('.user-results__item').forEach(item => {
        const nameClassText = item.querySelector('.result-item__name')?.textContent.trim() || '';
        const [name] = nameClassText.split(/\s+(?=\d)/); // Витягуємо тільки ПІБ
        const subject = item.querySelector('.result-item__title')?.childNodes[0].textContent.trim() || '';
        
        const nmtText = item.querySelector('.result-item__score')?.textContent || '';
        const nmtMatch = nmtText.match(/НМТ:\s*([^\n]+)/);
        const nmt = nmtMatch ? nmtMatch[1].trim() : '';
        
        if (!dataMap.has(name)) {
            dataMap.set(name, { ПІБ: name });
        }
        dataMap.get(name)[subject] = nmt;
    });
    
    const uniqueSubjects = new Set();
    dataMap.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key !== 'ПІБ') uniqueSubjects.add(key);
        });
    });
    
    const headers = ['ПІБ', ...Array.from(uniqueSubjects)];
    const data = [headers];
    
    dataMap.forEach(entry => {
        const row = headers.map(header => entry[header] || '');
        data.push(row);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Результати");
    XLSX.writeFile(wb, "results.xlsx");
    document.body.removeChild(document.getElementById('exportModal'));
}


const button2 = document.getElementsByClassName('exportMarkToExcel')[1];
button2.onclick = exportToExcel2;


// Підключаємо бібліотеку XLSX, якщо вона ще не підключена
if (!window.XLSX) {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => console.log("XLSX бібліотека завантажена");
    document.head.appendChild(script);
}