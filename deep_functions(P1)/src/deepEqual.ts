export const deepEqual = (obj1:object,obj2:object):boolean=>{
    let equal:boolean=false;
    if(obj1===obj2){
        return true;
    }else if(obj1!=null&&obj2!=null){
        if(Object.keys(obj1).length !== Object.keys(obj2).length){
            return false;
        }else{
            //for(var elemento in a) {
            for (let elemento:number = 0; elemento < Object.keys(obj1).length; elemento++){
                equal=deepEqual(Object.values(obj1)[elemento], Object.values(obj2)[elemento]);
            }
        }
    }
    else{
        return false;
    }
    return equal;
}



