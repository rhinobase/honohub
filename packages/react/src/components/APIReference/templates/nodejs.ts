export function listRecords(reference: string) {
  return `const axios = require('axios');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '${reference}',
    headers: { }
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}

export function createRecord(reference: string) {
  return `const axios = require('axios');

  let data = JSON.stringify(<PAYLOAD>);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '${reference}',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}

export function retrieveRecord(reference: string) {
  return `const axios = require('axios');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '${reference}/:id',
    headers: { }
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}

export function updateRecord(reference: string) {
  return `const axios = require('axios');

  let data = JSON.stringify(<PAYLOAD>);

  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: '${reference}/:id',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}

export function deleteRecord(reference: string) {
  return `const axios = require('axios');

  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: '${reference}/:id',
    headers: { }
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}

export function countRecords(reference: string) {
  return `const axios = require('axios');

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '${reference}/count',
    headers: { }
  };

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    }
    catch (error) {
      console.log(error);
    }
  }

  makeRequest();`;
}
