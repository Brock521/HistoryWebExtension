document.addEventListener("DOMContentLoaded", async () => {
  try {
    const info = await fetchData();
    if (info) {
      const validColumns = getValidColumns();
      setUpTable(validColumns);
      displayTableData(info, validColumns);
    }

    setupEventListeners(info);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

async function fetchData() {
  const response = await fetch("http://localhost:8080/BrowserActivity/Api");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function setupEventListeners(info) {
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", () => fetchAndDisplayData(info));

  const filterContainer = document.getElementById("filteritemscategory");
  const checkBoxes = filterContainer.querySelectorAll("input[type='checkbox']");
  
  checkBoxes.forEach((checkbox) => {
    checkbox.addEventListener("click", () => handleColumnVisibilityChange(checkbox, info));
  });

  const columnButtons = document.getElementById("historytable").querySelectorAll("button");
  columnButtons.forEach((button) => {
    button.addEventListener("click", (event) => handleSortButtonClick(event, info));
  });
}

async function fetchAndDisplayData(info) {
  try {
    const newInfo = await fetchData();
    resetColumnButtonText();
    displayTableData(newInfo, getValidColumns());
  } catch (error) {
    console.error("Error fetching new data:", error);
  }
}

function handleColumnVisibilityChange(checkbox, info) {
  const columnName = checkbox.id;
  const table = document.getElementById("historytable");
  const tableHeadRow = table.querySelector("thead tr");

  if (checkbox.checked) {
    addColumnButton(columnName, tableHeadRow, info);
  } else {
    removeColumnButton(columnName, tableHeadRow);
  }

  displayTableData(info, getValidColumns());
}

function addColumnButton(columnName, tableHeadRow, info) {
  const columnCell = document.createElement("th");
  const columnButton = document.createElement("button");
  columnButton.textContent = columnName;
  columnButton.addEventListener("click", (event) => handleSortButtonClick(event, info));

  columnCell.appendChild(columnButton);

  const validColumns = getValidColumns();
  const index = validColumns.indexOf(columnName);
  const existingCells = tableHeadRow.querySelectorAll("th");

  if (index >= existingCells.length) {
    tableHeadRow.appendChild(columnCell);
  } else {
    tableHeadRow.insertBefore(columnCell, existingCells[index]);
  }
}

function removeColumnButton(columnName, tableHeadRow) {
  const buttons = tableHeadRow.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.textContent.replace(/[▴▾]/g, "") === columnName) {
      button.parentElement.remove();
    }
  });
}

function handleSortButtonClick(event, info) {
  const sortingInfo = handleSortButtonText(event.currentTarget);
  const sortedTableData = sortTableData(info, sortingInfo[0], sortingInfo[1]);
  displayTableData(sortedTableData, getValidColumns());
}

function handleSortButtonText(button) {
  const ascChar = "▴";
  const descChar = "▾";
  let currButtonText = button.textContent;
  let filterSymbol = null;
  let column = null;

  if (!currButtonText.includes(ascChar) && !currButtonText.includes(descChar)) {
    column = currButtonText;
    filterSymbol = ascChar;
  } else if (currButtonText.includes(ascChar)) {
    column = currButtonText.replace(ascChar, "");
    filterSymbol = descChar;
  } else if (currButtonText.includes(descChar)) {
    column = currButtonText.replace(descChar, "");
    filterSymbol = "";
  }

  resetColumnButtonText();
  button.textContent = column + filterSymbol;
  return [column, filterSymbol];
}

function resetColumnButtonText() {
  const table = document.getElementById("historytable");
  const buttons = table.querySelectorAll("thead button");

  buttons.forEach((button) => {
    button.textContent = button.textContent.replace(/[▴▾]/g, "");
  });
}

function getValidColumns() {
  const filterContainer = document.getElementById("filteritemscategory");
  const checkboxes = filterContainer.querySelectorAll("input[type='checkbox']:checked");
  return Array.from(checkboxes).map(checkbox => checkbox.id);
}

function setUpTable(validColumns) {
  const table = document.getElementById("historytable");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  validColumns.forEach((column) => {
    const columnHead = document.createElement("th");
    const columnButton = document.createElement("button");
    columnButton.textContent = column;
    columnHead.appendChild(columnButton);
    headRow.appendChild(columnHead);
  });

  head.appendChild(headRow);
  table.appendChild(head);

  const tableBody = document.createElement("tbody");
  table.appendChild(tableBody);
}

function sortTableData(info, column, symbol ) {
  if (!Array.isArray(info) || info.length === 0 || !column) {
    return info; // Return the original data if inputs are invalid
  }

  let modifiedData = [...info];

  if (symbol === "▴") {
    // Ascending order
    modifiedData.sort((a, b) => {
      if (a[column] > b[column]) return -1;
      if (a[column] < b[column]) return 1;
      return 0;
    });
  } else if (symbol === "▾") {
    // Descending order
    modifiedData.sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
  }

  return modifiedData;
}

function displayTableData(info, validColumns) {
  if (!info || info.length === 0) {
    console.log("No data was returned");
    return;
  }

  const table = document.getElementById("historytable");
  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = "";

  info.forEach((item) => {
    const tableRow = document.createElement("tr");

    validColumns.forEach((key) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = item[key] || '';
      tableRow.appendChild(tableCell);
    });

    tableBody.appendChild(tableRow);
  });
}
