class DocumentUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getDocs() {
        return `${this.baseUrl}/documents`;
    }

    getDocById(id) {
        return `${this.baseUrl}/documents/${id}`;
    }

    createDoc() {
        return `${this.baseUrl}/documents`;
    }

    removeDocById() {
        return `${this.baseUrl}/documents/${id}`;
    }

    updateDocById() {
        return `${this.baseUrl}/documents/${id}`;
    }
}

export const docUrls = new DocumentUrls();
