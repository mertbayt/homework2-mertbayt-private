// server.mjs
import {createServer} from 'net';
import {readFile, readdir} from 'fs/promises';
import {extname, join} from 'path';
import {fileURLToPath} from 'url';

// absolute path path including filename of _this_ file (`server.mjs`)
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);

// absolute path of the directory that this files is in
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// absolute path to the public directory (you can use this along with 
// join from the path module and a file name to craft an absolute path
// to a file in src/public
const __root = join(__dirname, 'public');

const MIMETYPES = new Map();
MIMETYPES.set('.jpg', 'image/jpg');
MIMETYPES.set('.html', 'text/html');
MIMETYPES.set('.txt', 'text/plain');
MIMETYPES.set('.css', 'text/css');
MIMETYPES.set('.md', 'text/plain');

const DESCRIPTIONS = new Map();
DESCRIPTIONS.set(200, 'OK');
DESCRIPTIONS.set(404, 'Not Found');
DESCRIPTIONS.set(500 , 'Server Error');

// Create a server that listens for incoming connections
createServer(sock => {
  // Event listener for data sent by the client
  sock.on('data', async data => {
    // Extracting the header from the client request
    const [header] = data.toString().split('\r\n');
    // Extracting the method and path from the header
    const [method, path] = header.split(' ');

    // Check if the request method is GET
    if (method === 'GET') {
      try {
        // If the request path is root
        if (path === '/') {
          // Read all the files in the __root directory
          const files = await readdir(__root);
          // Create links for each file
          const links = files.map(file => `<a href="/${file}">${file}</a>`).join('<br>');
          // Set the HTTP status and description
          const status = 200;
          const description = DESCRIPTIONS.get(status);
          // Construct and send the HTTP response with the file links
          const response = `HTTP/1.1 ${status} ${description}\r\nContent-Type: text/html\r\n\r\n${links}`;
          sock.end(response);
        } else {
          // Construct the absolute file path
          const filePath = join(__root, path.slice(1));
          // Read the content of the file
          const fileContent = await readFile(filePath);
          // Get the file extension and the corresponding MIME type
          const ext = extname(path);
          const mimeType = MIMETYPES.get(ext);
          // Set the HTTP status and description
          const status = 200;
          const description = DESCRIPTIONS.get(status);
          // Construct and send the HTTP response with the file content
          const response = `HTTP/1.1 ${status} ${description}\r\nContent-Type: ${mimeType}\r\n\r\n`;
          sock.write(response);
          sock.end(fileContent);
        }
      } catch (error) {
        // In case of error, send a 404 Not Found response
        const status = 404;
        const description = DESCRIPTIONS.get(status);
        const response = `HTTP/1.1 ${status} ${description}\r\nContent-Type: text/plain\r\n\r\nFile Not Found`;
        sock.end(response);
      }
    }
  });
// The server is listening on port 3000
}).listen(3000);