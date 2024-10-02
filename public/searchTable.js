const [form] = document.forms;
const feedback = document.querySelector(".feedback");
const table = document.querySelector("table");
const tbodyRows = [...table.tBodies[0].rows];

const getCellValue = (cell) => {
  return cell.innerText || cell.textContent;
};

form.searchBox.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const hasValue = !!e.target.value.length;
  let resultCount = 0;

  tbodyRows.forEach((row) => {
    const cells = row.querySelectorAll('td:not([data-searchable="false"])');
    let isFound = false;

    cells.forEach((cell) => {
      const value = getCellValue(cell).toLowerCase();
      const isMatch = value.includes(term);

      if (isMatch) {
        isFound = true;
      }

      cell.classList.toggle("is-match", hasValue && isMatch);
    });

    row.classList.toggle("is-hidden", !isFound);
    resultCount += isFound ? 1 : 0;
  });

  feedback.textContent = hasValue
    ? resultCount === 1
      ? "Showing 1 result"
      : `Showing ${resultCount} results`
    : null;
});
