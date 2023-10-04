
const createServer = require('./index')
const {
    PORT,
  } = require('./config');

const app = createServer();


 // eslint-disable-next-line no-console
 app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));