const { sendSuccess } = require('../utils/response');

const formatUptime = (uptimeSeconds) => {
    const total = Math.max(0, Math.floor(uptimeSeconds));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
};

const health = (req, res) => {
    sendSuccess(res, 'Server healthy', {
        status: 'ok',
        uptime: formatUptime(process.uptime()),
        timestamp: new Date().toISOString(),
    });
};

module.exports = { health };
