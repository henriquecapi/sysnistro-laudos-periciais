require('dotenv').config();
const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on https://henriquecapi.github.io/sysnistro-laudos-periciais/`);
});
