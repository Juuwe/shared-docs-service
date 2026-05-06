class Ajax {
    async get(url) {
        const response = await fetch(url);
        return this._handleResponse(response);
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this._handleResponse(response);
    }

    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this._handleResponse(response);
    }

    async delete(url) {
        const response = await fetch(url, { method: 'DELETE' });
        return this._handleResponse(response);
    }

    async _handleResponse(response) {
        if (!response.ok) {
            console.error(`Ошибка: ${response.status}`);
            return null;
        }
        // Для DELETE 204 No Content возвращает пустой body
        if (response.status === 204) return true;
        return await response.json();
    }
}

export const ajax = new Ajax();
