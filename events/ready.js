module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`✓ Bot logged in as ${client.user.tag}`);
    console.log(`✓ Monitoring ${client.guilds.cache.size} guild(s)`);
    console.log(`✓ Dashboard running on http://localhost:${require('../../config').DASHBOARD_PORT}`);
  }
};
