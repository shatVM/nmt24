// https://chatgpt.com/c/67f5191d-78a0-8007-9689-9e2b117cf5a7

document.querySelector('.PassedTests').addEventListener("click", () => {
    const resultItems = document.querySelectorAll(".user-results__item");
    const subjectMap = new Map();
    const results = [];

    const groupCountsMap = new Map(); // Для зберігання кількості учнів у кожній підгрупі

    resultItems.forEach(item => {
        const nameText = item.querySelector(".result-item__name")?.textContent || "";
        const titleText = item.querySelector(".result-item__title")?.childNodes[0]?.textContent.trim() || "";
        const variant = item.querySelector(".result-item__test-name a")?.textContent.trim() || "";

        // Витягуємо клас + підгрупу
        const nameParts = nameText.trim().split(" ");
        const classGroup = nameParts.slice(-2).join(" ");

        // Заповнюємо map предметів → множина варіантів
        if (!subjectMap.has(titleText)) {
            subjectMap.set(titleText, new Set());
        }
        subjectMap.get(titleText).add(variant);

        // Пушимо у масив результатів
        results.push({ classGroup, subject: titleText, variant });

        // Підрахунок учнів у підгрупі
        if (!groupCountsMap.has(classGroup)) {
            groupCountsMap.set(classGroup, new Set());
        }
        groupCountsMap.get(classGroup).add(nameText); // за ПІБ
    });

    const subjectsWithVariants = Array.from(subjectMap.entries()).map(([subject, variantSet]) => ({
        subject,
        variants: Array.from(variantSet).sort()
    }));

    const groupCounts = Array.from(groupCountsMap.entries()).map(([group_subgroup, studentSet]) => ({
        group_subgroup,
        counts: studentSet.size
    }));

    // Генерація таблиці
    const table = generateSummaryTable(subjectsWithVariants, results, groupCounts);
    const output = document.querySelector(".adminPagePassedTests");
    output.innerHTML = "";

    //output.appendChild(table);

    const wrapper = document.createElement("div");
    wrapper.className = "summary-wrapper";

    wrapper.appendChild(table);
    document.querySelector(".adminPagePassedTests").appendChild(wrapper);
});

function generateSummaryTable(subjectsWithVariants, results, groupCounts) {
    const classGroups = Array.from(new Set(results.map(r => r.classGroup))).sort();

    const table = document.createElement("table");

    table.classList.add("summary-table");

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const subjectHeaderRow = document.createElement("tr");
    subjectHeaderRow.appendChild(document.createElement("th"));

    subjectsWithVariants.forEach(({ subject, variants }) => {
        const th = document.createElement("th");
        th.colSpan = variants.length;
        th.textContent = subject;
        th.style.border = "1px solid black";
        th.style.textAlign = "center";
        subjectHeaderRow.appendChild(th);
    });
    thead.appendChild(subjectHeaderRow);

    const variantHeaderRow = document.createElement("tr");
    const emptyTh = document.createElement("th");
    emptyTh.textContent = "Клас";
    emptyTh.style.border = "1px solid black";
    variantHeaderRow.appendChild(emptyTh);

    subjectsWithVariants.forEach(({ variants }) => {
        variants.forEach(v => {
            const th = document.createElement("th");
            th.textContent = v;
            th.style.border = "1px solid black";
            variantHeaderRow.appendChild(th);
        });
    });
    thead.appendChild(variantHeaderRow);

    classGroups.forEach(classGroup => {
        const row = document.createElement("tr");

        const classCell = document.createElement("td");
        classCell.textContent = classGroup;
        classCell.style.border = "1px solid black";
        row.appendChild(classCell);

        const totalCount = groupCounts.find(g => g.group_subgroup === classGroup)?.counts || 0;

        subjectsWithVariants.forEach(({ subject, variants }) => {
            variants.forEach(variant => {
                const cell = document.createElement("td");
                cell.style.border = "1px solid black";
                cell.style.textAlign = "center";

                //
                cell.dataset.classGroup = classGroup;
                cell.dataset.subject = subject;
                cell.dataset.variant = variant;
                cell.classList.add("has-result");
                //

                const passedCount = results.filter(r =>
                    r.classGroup === classGroup &&
                    r.subject === subject &&
                    r.variant === variant
                ).length;

                if (passedCount > 0) {
                    const checkmarkContainer = document.createElement("div");
                    checkmarkContainer.className = "checkmark-container";

                    const icon = document.createElement("div");
                    icon.textContent = "✅";

                    const count = document.createElement("div");
                    count.className = "checkmark-count";
                    count.textContent = `(${passedCount}/${totalCount})`;

                    checkmarkContainer.appendChild(icon);
                    checkmarkContainer.appendChild(count);
                    cell.appendChild(checkmarkContainer);
                }

                row.appendChild(cell);
            });
        });

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}


document.addEventListener("mouseover", e => {
    const resultItems = document.querySelectorAll(".user-results__item");
    const subjectMap = new Map();

    const results = Array.from(document.querySelectorAll(".result-item__info")).map(item => {
        const nameText = item.querySelector(".result-item__name")?.textContent.trim() || "";
        const nameParts = nameText.split(" ");
        const classGroup = nameParts.slice(-2).join(" ");
        const studentName = nameParts.slice(0, -2).join(" ");
    
        const subject = item.querySelector(".result-item__title")?.childNodes[0]?.textContent.trim() || "";
        const variant = item.querySelector(".result-item__test-name a")?.textContent.trim() || "";
    
        const dateText = item.querySelector(".result-item__date")?.textContent.trim() || "";
        const date = dateText.replace("Дата: ", "").split(" ")[0];
        const time = dateText.replace("Дата: ", "").split(" ")[1];
    
        const userScore = item.querySelector(".user-score b")?.textContent.trim() || "—";
        const generalScore = item.querySelector(".general-score b")?.textContent.trim() || "—";
        const answers = `${userScore} з ${generalScore}`;
    
        const scoreHTML = item.querySelector(".result-item__score")?.innerHTML || "";
    
        const nmtMatch = scoreHTML.match(/НМТ:\s*<b>(\d+)<\/b>/);
        const nmt = nmtMatch ? nmtMatch[1] : "—";
    
        const gradeMatch = scoreHTML.match(/Оцінка:\s*<b>(\d+)<\/b>/);
        const score = gradeMatch ? gradeMatch[1] : "—";

        const [day, month, year] = date.split(".");
        
        const isoDate = `${year}-${month}-${day}T${time}`;
    
        return {
            classGroup,
            studentName,
            subject,
            variant,
            date: isoDate,
            answers,
            nmt,
            score
        };
    });

    results.sort((a, b) => {
        const nameCompare = a.studentName.localeCompare(b.studentName, 'uk', { sensitivity: 'base' });
        if (nameCompare !== 0) return nameCompare;
      
        return new Date(a.date) - new Date(b.date); // старіші перші
      });
      
    

    const cell = e.target.closest(".has-result");
    if (!cell) return;

    const { classGroup, subject, variant } = cell.dataset;

    const studentList = results
        .filter(r => r.classGroup === classGroup && r.subject === subject && r.variant === variant)
        .map(r => `
    <tr>
      <td>${r.studentName.split(' ')[0] + ' ' +r.studentName.split(' ')[1] }</td>
      <td>${new Date(r.date).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
      <td>${r.answers || ""}</td>
      <td>${r.nmt || ""}</td>
      <td>${r.score}</td>
    </tr>
  `).join("");

    modal.innerHTML = `
  <div class="modal-table">
  <div class = "modal-header"><strong>${classGroup}</strong><span> ${subject} ${variant}</span><hr></div>
    <table>
      <thead>
        <tr>
          <th>ПІБ</th>
          <th>Дата</th>
          <th>Відповіді</th>
          <th>НМТ</th>
          <th>Оцінка</th>
        </tr>
      </thead>
      <tbody>${studentList}</tbody>
    </table>
  </div>
`;

    modal.style.display = "block";
});

document.addEventListener("mousemove", e => {
    modal.style.left = `${e.pageX + 20}px`;
    modal.style.top = `${e.pageY - 20}px`;
});

document.addEventListener("mouseout", e => {
    if (e.target.closest(".has-result")) {
        modal.style.display = "none";
    }
});

const modal = document.createElement("div");
modal.className = "custom-tooltip";
document.body.appendChild(modal);

