# Practica 4

## Deno, oak, oak-graphql, mongoDB

Agenda con autentificación de usuario:

- Querys: 
    Para cualquier usuario: *getTask, getTasks, getTaskByStatus, getUsers.*
    Para usuarios autenticados: *getMyTasks, getMyOpenTasks.* 
- Mutations: 
    Para los usuarios autenticados: *addTask, removeTask, UpdateTask, CompleteTask, StartTask.*
    Para autentificarse: *signUp, signIn, logIn, deleteAccount.*

### Run:

1.  Confirar el .env para tu DB.
2.  Ir al direccorio del proyecto ("AgendaConUsuarios")
3.  `deno run --allow-net --allow-env --allow-write --allow-read --allow-plugin --unstable --watch server.ts` 
4. En el navegador (por defecto puerto 4000): "localhost/4000/graphql"

*En caso de error en la primera ejecución del programa, probar a comentar el app.use() que maneja la autentificación de usuario y despues descomentarlo y guardar :)*
