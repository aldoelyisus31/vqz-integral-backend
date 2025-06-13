//* Esto es solo para desarrollo. Aun no se determina si en produccion de dockerizara la base de datos o se usara una externa.

const net = require('net');
const fs = require('fs');
const { spawn } = require('child_process');

const env = fs.readFileSync('.env.development', 'utf-8')
  .split('\n')
  .filter(line => line.includes('='))
  .reduce((acc, line) => {
    const [key, val] = line.split('=');
    acc[key.trim()] = val.trim();
    return acc;
  }, {});

const host = env.DB_HOST || 'localhost';
const port = parseInt(env.DB_PORT || '5432', 10);
console.log(`Esperando conexión a ${host}:${port}...`);

/**
 * Waits for a TCP port to become available on a specified host within a given timeout.
 *
 * @param {string} host - The hostname or IP address to connect to.
 * @param {number} port - The port number to check.
 * @param {number} [timeout=30000] - The maximum time to wait for the port to become available, in milliseconds.
 * @returns {Promise<void>} Resolves when the port is available, rejects if the timeout is reached.
 */
function waitForPort(host, port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function check() {
      const socket = net.createConnection({ host, port }, () => {
        socket.end();
        resolve();
      });

      socket.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Timeout esperando el puerto de la base de datos'));
        } else {
          setTimeout(check, 1000);
        }
      });
    }

    check();
  });
}

waitForPort(host, port)
  .then(() => {
    console.log('✅ Base de datos lista. ▸ Iniciando NestJS...');
    spawn('npm', ['run', 'start:dev'], { stdio: 'inherit' });
  })
  .catch(console.error);
