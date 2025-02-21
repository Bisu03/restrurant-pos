export const generateItemtId = () => {
    const timestamp = new Date().getTime().toString();
    const randomPart = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return timestamp.slice(-5) + randomPart;
};
export const generateUniqueId = () => {
    const min = 10000;
    const max = 99999;
    const uniqueNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return uniqueNumber;
};