export const deepClone = (obj:object):object => {
    if (typeof obj === 'object') {
        let cloned_obj:any = Array.isArray(obj) ? [] : {};
        for (let key:number = 0; key < Object.keys(obj).length; key++){
            cloned_obj[Object.keys(obj)[key]] = deepClone(Object.values(obj)[key]);
        }
        return cloned_obj;
    } else {
        return obj;
    }
};