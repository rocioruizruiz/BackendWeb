const status = (ctx:any) => {
  ctx.response.body = {
    data: "OK",
  }
  ctx.response.status = 200;
      
}

export { status }