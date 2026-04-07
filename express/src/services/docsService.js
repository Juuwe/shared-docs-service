const fileService = require("./fileService");

// Переменная для хранения пути к файлу данных, будет установлена при инициализации
let dataFilePath;

// Функция инициализации сервиса с путем к файлу данных
const init = (filePath) => {
  dataFilePath = filePath;
};

const findAll = (title) => {
  const docs = fileService.readData(dataFilePath);
  if (title) {
    return docs.filter((doc) =>
      doc.title.toLowerCase().includes(title.toLowerCase()),
    );
  }
  return docs;
};

const findOne = (id) => {
  const docs = fileService.readData(dataFilePath);
  return docs.find((doc) => doc.id === id);
};

const create = (docData) => {
  const docs = fileService.readData(dataFilePath);

  // Генерация ID: берем максимальный ID + 1
  const newId = docs.length > 0 ? Math.max(...docs.map((d) => d.id)) + 1 : 1;

  const newDoc = { id: newId, ...docData };
  docs.push(newDoc);
  fileService.writeData(dataFilePath, docs);

  return newDoc;
};

const update = (id, docData) => {
  const docs = fileService.readData(dataFilePath);
  const index = docs.findIndex((d) => d.id === id);

  if (index === -1) return null;

  docs[index] = { ...docs[index], ...docData };
  fileService.writeData(dataFilePath, docs);

  return docs[index];
};

const remove = (id) => {
  const docs = fileService.readData(dataFilePath);
  const filteredDocs = docs.filter((d) => d.id !== id);

  if (filteredDocs.length === docs.length) {
    return false; // Ничего не удалили
  }

  fileService.writeData(dataFilePath, filteredDocs);
  return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
