const docsService = require('../services/docsService');

const getAllDocs = (req, res) => {
    const { title } = req.query;
    const docs = docsService.findAll(title);
    res.json(docs);
};

const getDocById = (req, res) => {
    const id = parseInt(req.params.id);
    const doc = docsService.findOne(id);

    if (!doc) {
        return res.status(404).json({ error: 'Документ не найден' });
    }

    res.json(doc);
};

const createDoc = (req, res) => {
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newDoc = docsService.create({ src, title, text });
    res.status(201).json(newDoc);
};

const updateDoc = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedDoc = docsService.update(id, req.body);

    if (!updatedDoc) {
        return res.status(404).json({ error: 'Документ не найден' });
    }

    res.json(updatedDoc);
};

const deleteDoc = (req, res) => {
    const id = parseInt(req.params.id);
    const success = docsService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Документ не найден' });
    }

    res.status(204).send(); // 204 No Content
};

module.exports = {
    getAllDocs,
    getDocById,
    createDoc,
    updateDoc,
    deleteDoc
};
