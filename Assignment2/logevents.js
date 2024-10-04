const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const fs = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${uuid()}\t${dateTime}\t${message}\n`;

  try {
    if (!await fs.stat(path.join(__dirname, 'logs')).catch(() => false)) {
      await fs.mkdir(path.join(__dirname, 'logs'));
    }

    await fs.appendFile(path.join(__dirname, 'logs', './eventLogs.txt'), logItem);
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;
