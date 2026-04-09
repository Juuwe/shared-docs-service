const PRESETS = [
  {
    id: 1,
    title: 'РПЗ.docx',
    text: 'Содержание пояснительной записки...',
    src: 'static/img/docx.png',
    tags: ['документ', 'word'],
  },
  {
    id: 2,
    title: 'Титул.pdf',
    text: 'Текст титульного листа...',
    src: 'static/img/pdf.png',
    tags: ['документ', 'pdf'],
  },
  {
    id: 101,
    title: 'Range Rover.glb',
    is3D: true,
    modelPath: 'models/Range Rover.glb',
    src: 'static/img/glb.png',
    tags: ['модель', '3d', 'машина'],
  },
  {
    id: 5,
    title: 'Машина + Дерево.glb',
    is3D: true,
    models: [{ model: 'models/Range Rover.glb' }, { model: 'models/Big Tree.glb' }],
    src: 'static/img/glb.png',
    tags: ['модель', '3d', 'машина', 'дерево'],
  },

  {
    id: 6,
    title: 'Микросхема.glb',
    is3D: true,
    modelPath: 'models/Circuit parts.glb',
    src: 'static/img/glb.png',
    tags: ['модель', '3d', 'микросхема'],
  },

  {
    id: 7,
    title: 'Документы.glb',
    is3D: true,
    modelPath: 'models/Small Stack of Paper.glb',
    src: 'static/img/glb.png',
    tags: ['модель', '3d', 'документы'],
  }
];

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
