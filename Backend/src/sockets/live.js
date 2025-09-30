export function initLive(io){
  io.on('connection', (socket)=>{
    socket.on('join_event', (eventId)=> socket.join(`event/${eventId}`));
    socket.on('leave_event', (eventId)=> socket.leave(`event/${eventId}`));
  });
}
export function emitLeaderboard(io, eventId, payload){
  io.to(`event/${eventId}`).emit('leaderboard:update', payload);
}
export function emitLiveBlog(io, eventId, entry){
  io.to(`event/${eventId}`).emit('liveblog:new', entry);
}
