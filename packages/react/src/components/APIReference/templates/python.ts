export function listRecords(reference: string) {
  return `import requests

response = requests.get(
  "${reference}"
)

print(response.json())`;
}

export function createRecord(reference: string) {
  return `import requests

response = requests.post(
  "${reference}",
  data={ ... }
)

print(response.json())`;
}

export function retrieveRecord(reference: string) {
  return `import requests

response = requests.get(
  "${reference}/:id"
)

print(response.json())`;
}

export function updateRecord(reference: string) {
  return `import requests

response = requests.put(
  "${reference}/:id",
  data={ ... }
)

print(response.json())`;
}

export function deleteRecord(reference: string) {
  return `import requests

response = requests.delete(
  "${reference}/:id"
)

print(response.json())`;
}

export function countRecords(reference: string) {
  return `import requests

response = requests.get(
  "${reference}/count"
)

print(response.json())`;
}
