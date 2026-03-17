const leaderboardService = require('../modules/leaderboard/leaderboard.service');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    socket.on('join_contest', (contestId) => {
      socket.join(`contest:${contestId}`);
      console.log(`User joined contest room: ${contestId}`);
    });

    socket.on('attempt_started', ({ contestId, username }) => {
      io.to(`contest:${contestId}`).emit('participant_update', {
        username,
        status: 'typing',
      });
    });

    socket.on('attempt_finished', async ({ contestId, username }) => {
      io.to(`contest:${contestId}`).emit('participant_update', {
        username,
        status: 'finished',
      });

      // Broadcast updated leaderboard
      try {
        const leaderboard = await leaderboardService.getLeaderboard(contestId);
        io.to(`contest:${contestId}`).emit('leaderboard_update', leaderboard);
      } catch (err) {
        console.error('Leaderboard broadcast error:', err.message);
      }
    });

    socket.on('contest_countdown', ({ contestId, seconds }) => {
      io.to(`contest:${contestId}`).emit('contest_countdown', { seconds });
    });

    socket.on('disconnect', () => {
      console.log(`⚡ Socket disconnected: ${socket.id}`);
    });
  });
};
