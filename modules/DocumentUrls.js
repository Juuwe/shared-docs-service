class DocumentUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getDocs() {
        return `${this.baseUrl}/document`;
    }

    getDocById(id) {
        return `${this.baseUrl}/document/${id}`;
    }

    createDoc() {
        return `${this.baseUrl}/document`;
    }

    removeDocById() {
        return `${this.baseUrl}/document/${id}`;
    }

    updateDocById() {
        return `${this.baseUrl}/document/${id}`;
    }
}

export const docUrls = new DocumentUrls();
