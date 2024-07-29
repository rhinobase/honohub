export function listRecords(reference: string) {
  return `curl -L '${reference}'`;
}

export function createRecord(reference: string) {
  return `curl -L '${reference}' \\
  -H 'Content-Type: application/json' \\
  -d '<PAYLOAD>'`;
}

export function retrieveRecord(reference: string) {
  return `curl -L '${reference}/:id'`;
}

export function updateRecord(reference: string) {
  return `curl -L -X PATCH '${reference}/:id' \\
  -H 'Content-Type: application/json' \\
  -d '<PAYLOAD>'`;
}

export function deleteRecord(reference: string) {
  return `curl -L -X DELETE '${reference}/:id'`;
}

export function countRecords(reference: string) {
  return `curl -L '${reference}/count'`;
}
