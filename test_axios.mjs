const axios = require('axios');
axios.post('http://localhost:8080/api/auth/register', {name:'test', email:'test@uwo24.com', password:'test', invite_token:'test'})
  .then(r => console.log('success'))
  .catch(e => console.log('error', e.message));
