# Practica 3

## Deno, oak, oak-graphql

Agenda:

- Querys: Ver una tarea, Ver todas las tareas, filtrar tarea por estado de la tarea, filtrar estado por fecha tope de realización.
- Mutations: Añadir tarea, Borrar tarea, actualizar tarea, completar tarea, empezar tarea.

### Run:

1.  Confirar el .env para tu DB.
2.  Ir al direccorio del proyecto ("agenda")
3.  `deno run --allow-net --allow-env --allow-write --allow-read --allow-plugin --unstable --watch app.ts`

### Test:

1. En el navegador: "localhost/8080/graphql"
2. Prueba ejemplos con el sguiente formato (recuerda cambiar los id):
```
addTask(input: {
    nombre: "Tarea Nueva"
    descripcion: "dec"
    state: "TODO"
    enddate: "11-12-2000"
    
  }){
    done
  }
  startTask(_id:"5fc12e02003307e50058f048"){
    done
  }
  updateTask(_id:"5fc12e02003307e50058f048", input:{
    nombre: "Estoy en ello"
    descripcion: ".."
    state:"DOING"
    enddate: "03.03.2001"
  }){
    done
  }
  completeTask(_id:"5fc12e02003307e50058f048"){
    done
  }
  removeTask(_id:"55fc12e02003307e50058f048"){
    done
  }
}
```

```
query{
  getTask(_id:"55fc12e02003307e50058f048"){
    nombre
    enddate
  }
  getTaskByState(state:"TODO"){
    nombre
    descripcion 
    state
    enddate
  }
  getTaskByDate(enddate:"03-04-2001"){
    _id
    nombre
    enddate
    state
  }
  getTasks{
    nombre
    state
    enddate
  }
}

```
