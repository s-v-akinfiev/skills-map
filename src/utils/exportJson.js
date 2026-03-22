function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function formatJson(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export function exportJsonFile(filename, data) {
  downloadTextFile(filename, formatJson(data));
}

