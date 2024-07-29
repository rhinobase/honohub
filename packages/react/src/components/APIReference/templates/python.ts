export function listRecords(reference: string) {
  return `
  import requests

  url = "${reference}"

  payload = {}
  headers = {}

  response = requests.request("GET", url, headers=headers, data=payload)

  print(response.text)
`;
}

export function createRecord(reference: string) {
  return `
  import requests
  import json

  url = "${reference}"

  payload = json.dumps({
    "id": 4,
    "status": False,
    "message": "The API is working"
  })
  headers = {
    'Content-Type': 'application/json'
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  print(response.text)
  `;
}

export function retrieveRecord(reference: string) {
  return `
  import requests

  url = "${reference}/:id"

  payload = {}
  headers = {}

  response = requests.request("GET", url, headers=headers, data=payload)

  print(response.text)
  `;
}

export function updateRecord(reference: string) {
  return `
  import requests
  import json

  url = "${reference}/:id"

  payload = json.dumps({
    "message": "Update is working"
  })
  headers = {
    'Content-Type': 'application/json'
  }

  response = requests.request("PATCH", url, headers=headers, data=payload)

  print(response.text)
  `;
}

export function deleteRecord(reference: string) {
  return `
  import requests

  url = "${reference}/:id"

  payload = {}
  headers = {}

  response = requests.request("DELETE", url, headers=headers, data=payload)

  print(response.text)
  `;
}

export function countRecords(reference: string) {
  return `
  import requests

  url = "${reference}/count"

  payload = {}
  headers = {}

  response = requests.request("GET", url, headers=headers, data=payload)

  print(response.text)
  `;
}
