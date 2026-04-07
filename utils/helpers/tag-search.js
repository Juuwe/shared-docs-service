export function areTagsIdentical(tags1, tags2) {
    if (tags1.length !== tags2.length) return false;

    const tagMap = new Map();
    let i = 0;

    while (i < tags1.length) {
        const tag = tags1[i];
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        i++;
    }

    i = 0;

    while (i < tags2.length) {
        const tag = tags2[i];
        const count = tagMap.get(tag);

        if (!count) {
            return false;
        }

        tagMap.set(tag, count - 1);
        i++;
    }

    return true;
};
