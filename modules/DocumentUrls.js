class DocumentUrls {
    constructor() {
        this.baseUrl = '';
    }

    getDocs() {
        return `/documents`;
    }

    getDocById(id) {
        return `/documents/${id}`;
    }

    createDoc() {
        return `/documents`;
    }

    removeDocById(id) {
        return `/documents/${id}`;
    }

    updateDocById(id) {
        return `/documents/${id}`;
    }
}

export const docUrls = new DocumentUrls();
