import { createServer } from 'http';

import app, { port } from './app';

app.set('port', port);

const server = createServer(app);
server.listen(port, (err) => {
  err && console.error(err);
  console.log(`Server running on port ${port}`);
});
