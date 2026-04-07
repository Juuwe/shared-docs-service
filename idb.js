// Простая обёртка для работы с IndexedDB
const PRESETS = [
  { id: 1, title: 'РПЗ.docx', text: 'Содержание пояснительной записки...' },
  { id: 2, title: 'Титул.pdf', text: 'Текст титульного листа...' },
  { id: 101, title: 'Range Rover.glb', is3D: true, modelPath: 'models/Range Rover.glb' },
  {
    id: 5,
    title: 'Машина + Дерево',
    is3D: true,
    models: [{ model: 'models/Range Rover.glb' }, { model: 'models/Big Tree.glb' }],
  },
];

// Единая функция получения ВСЕХ данных
function getData() {
  return getAllModelsFromDB().then((userModels) => {
    const formattedUserModels = userModels.map((m) => ({
      ...m,
      id: `user-${m.id}`,
      is3D: true,
    }));
    return [...PRESETS, ...formattedUserModels];
  });
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ModelGalleryDB', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('models')) {
        db.createObjectStore('models', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function addModelToDB(model) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('models', 'readwrite');
        const store = tx.objectStore('models');
        const req = store.add(model);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function getAllModelsFromDB() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('models', 'readonly');
        const store = tx.objectStore('models');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function getModelByIdFromDB(id) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('models', 'readonly');
        const store = tx.objectStore('models');
        const req = store.get(Number(id));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}
