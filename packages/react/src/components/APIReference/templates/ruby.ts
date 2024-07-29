export function listRecords(reference: string) {
  return `
  require "uri"
  require "net/http"

  url = URI("${reference}")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Get.new(url)

  response = http.request(request)
  puts response.read_body

  `;
}

export function createRecord(reference: string) {
  return `
  require "uri"
  require "json"
  require "net/http"

  url = URI("${reference}")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Post.new(url)
  request["Content-Type"] = "application/json"
  request.body = JSON.dump({
    "id": 4,
    "status": false,
    "message": "The API is working"
  })

  response = http.request(request)
  puts response.read_body

  `;
}

export function retrieveRecord(reference: string) {
  return `
  require "uri"
  require "net/http"

  url = URI("${reference}/:id")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Get.new(url)

  response = http.request(request)
  puts response.read_body

  `;
}

export function updateRecord(reference: string) {
  return `
  require "uri"
  require "json"
  require "net/http"

  url = URI("${reference}/:id")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Patch.new(url)
  request["Content-Type"] = "application/json"
  request.body = JSON.dump({
    "message": "Update is working"
  })

  response = http.request(request)
  puts response.read_body

  `;
}

export function deleteRecord(reference: string) {
  return `
  require "uri"
  require "net/http"

  url = URI("${reference}/:id")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Delete.new(url)

  response = http.request(request)
  puts response.read_body
  
  `;
}

export function countRecords(reference: string) {
  return `
  require "uri"
  require "net/http"

  url = URI("${reference}/count")

  http = Net::HTTP.new(url.host, url.port);
  request = Net::HTTP::Get.new(url)

  response = http.request(request)
  puts response.read_body
  
  `;
}
