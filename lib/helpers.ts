// src/lib/helpers.ts
"use client"; // Required for document interaction

export const exportToJson = (data: any, filename: string): void => {
  try {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}.json`;
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  } catch (error) {
    console.error("Error exporting to JSON:", error);
    // Potentially show a toast message to the user
  }
};

export const exportToCsv = (data: any[], filename: string): void => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data to export or data is not an array.");
    // Potentially show a toast message
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row =>
        headers.map(headerName => {
          const cellValue = row[headerName];
          // Handle null, undefined, and ensure proper CSV escaping for values containing commas or quotes
          let escapedValue = cellValue === null || cellValue === undefined ? '' : String(cellValue);
          if (/[",\n\r]/.test(escapedValue)) {
            escapedValue = `"${escapedValue.replace(/"/g, '""')}"`;
          }
          return escapedValue;
        }).join(',')
      )
    ];

    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csvRows.join('\n')
    )}`;
    const link = document.createElement("a");
    link.href = csvString;
    link.download = `${filename}.csv`;
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    // Potentially show a toast message
  }
};
