let io;
async function create_io_server(server){
  if(io){
    io.close()
  }
  io = require('socket.io')(server);
  io.on('connection', (clien) => {
    clien.on('msg', (data) => {
      console.info(data);
    });
  });
} 

export { io , create_io_server}