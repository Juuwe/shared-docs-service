export const merge = (...objects) => {
    const result = {};
    let i = 0;
    while (i < objects.length) {
        const obj = objects[i];
        for (const key in obj) {
            // Если ключа еще нет — записываем.
            // Это гарантирует, что данные из первого объекта (документа)
            // не будут перезаписаны системными дефолтами.
            if (!(key in result)) {
                result[key] = obj[key];
            }
        }
        i++;
    }
    return result;
};
