export const deepPrint =  (obj:object):void => {
    for (let key:number = 0; key < Object.keys(obj).length; key++){
        if (Array.isArray(Object.values(obj)[key])){
            console.log(Object.keys(obj)[key] + ": ");
            deepPrint(Object.values(obj)[key]);
        }else{
            console.log(Object.values(obj)[key]);
        }
    }
};