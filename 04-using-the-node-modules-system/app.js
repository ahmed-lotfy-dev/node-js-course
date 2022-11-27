import { createServer } from 'http';

import { someText, handler } from './routes';

console.log(someText);

const server = createServer(handler);

server.listen(3000);
