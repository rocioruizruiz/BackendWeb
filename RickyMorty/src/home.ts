const home = (ctx:any) => {
    ctx.response.body =
      "Hello to Rick & Morty REST API\nGET: '/characters' returns all characters in database\n" + 
      "GET: '/episodes' returns all characters in database\n" +
      "GET: '/locations' returns all characters in database\n";
}

export { home }