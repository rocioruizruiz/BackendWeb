import { deepPrint } from "../src/deepPrint.ts"
import { deepClone } from "../src/deepClone.ts"
import { deepEqual } from "../src/deepEqual.ts"
import { IAlumno, IProfesor } from "../src/schemas.ts"


//EJEMPLOS:     Person1 == Persona3. Persona 2 == Persona4. Persona 5 == Pesona6
const persona1 = {
    name:"Nacho",
    edad:23,
    amigos:[
        "Teje","Ig","Luis","Gil"
    ]
}

const persona2= {
    name:"Jaime",
    edad:20,
    amigos:[
        "Nacho",
        "Ig",
        "Luis",
        "Gil"
    ]
}
const persona3= {
    name:"Nacho",
    edad:23,
    amigos:[
        "Teje",
        "Ig",
        "Luis",
        "Gil"
    ]
}
const persona4= {
    name:"Jaime",
    edad:20,
    amigos:[
        "Nacho",
        "Ig",
        "Luis",
        "Gil"
    ]
}
const persona5= {
    name:"Alberto",
    edad:20,
    coche:false,
    genero:'M',
    amigos:[
        {
            name:"Manuel",
            edad:20
        },
        {
            name:"Mateo",
            edad:30
        }
    ]
}
const persona6= {
    name:"Alberto",
    edad:20,
    coche:false,
    genero:'M',
    amigos:[
        {
            name:"Manuel",
            edad:20
        },
        {
            name:"Mateo",
            edad:30
        }
    ]
}
// DEEP EQUAL.
console.log(deepEqual(persona1,persona3)); //true
console.log(deepEqual(persona2,persona4)); //true
console.log(deepEqual(persona5,persona6)); //true
console.log(deepEqual(persona1,persona6)); //false
console.log(deepEqual(persona2,persona5)); //false
console.log(deepEqual(persona3,persona6)); //false

//DEEP CLONE
console.log(deepClone(persona1)); // { name: "Nacho", edad: 23, amigos: [ "Teje", "Ig", "Luis", "Gil" ] }
console.log(deepClone(persona2)); // { name: "Jaime", edad: 20, amigos: [ "Nacho", "Ig", "Luis", "Gil" ] }
console.log(deepClone(persona3)); // { name: "Nacho", edad: 23, amigos: [ "Teje", "Ig", "Luis", "Gil" ] }
console.log(deepClone(persona4)); // { name: "Jaime", edad: 20, amigos: [ "Nacho", "Ig", "Luis", "Gil" ] }
console.log(deepClone(persona5)); // {name: "Alberto",edad: 20,coche: false,genero: "M", amigos: [ { name: "Manuel", edad: 20 }, { name: "Mateo", edad: 30 } ]}
console.log(deepClone(persona6)); // {name: "Alberto",edad: 20,coche: false,genero: "M", amigos: [ { name: "Manuel", edad: 20 }, { name: "Mateo", edad: 30 } ]}

//DEEP PRINT

deepPrint(persona1); // { name: "Nacho", edad: 23, amigos: [ "Teje", "Ig", "Luis", "Gil" ] }
deepPrint(persona2); // { name: "Jaime", edad: 20, amigos: [ "Nacho", "Ig", "Luis", "Gil" ] }
deepPrint(persona3); // { name: "Nacho", edad: 23, amigos: [ "Teje", "Ig", "Luis", "Gil" ] }
deepPrint(persona4); // { name: "Jaime", edad: 20, amigos: [ "Nacho", "Ig", "Luis", "Gil" ] }
deepPrint(persona5); // {name: "Alberto",edad: 20,coche: false,genero: "M", amigos: [ { name: "Manuel", edad: 20 }, { name: "Mateo", edad: 30 } ]}
deepPrint(persona6); // {name: "Alberto",edad: 20,coche: false,genero: "M", amigos: [ { name: "Manuel", edad: 20 }, { name: "Mateo", edad: 30 } ]}

