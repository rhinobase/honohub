export function listRecords(reference: string) {
  return `const axios = require('axios');

async function makeRequest() {
  try {
    const response = await axios.get(
      "${reference}"
    );
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

async function makeRequest() {
  try {
    const response = await axios.post(
      "${reference}",
      { ... }
    );
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

async function makeRequest() {
  try {
    const response = await axios.get(
      "${reference}/:id"
    );
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

async function makeRequest() {
  try {
    const response = await axios.put(
      "${reference}/:id",
      { ... }
    );
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

async function makeRequest() {
  try {
    const response = await axios.delete(
      "${reference}/:id"
    );
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

async function makeRequest() {
  try {
    const response = await axios.get(
      "${reference}/count"
    );
    console.log(JSON.stringify(response.data));
  }
  catch (error) {
    console.log(error);
  }
}

makeRequest();`;
}
