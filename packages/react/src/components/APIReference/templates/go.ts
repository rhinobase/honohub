export function listRecords(reference: string) {
  return `
  package main

  import (
    "fmt"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}"
    method := "GET"

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, nil)

    if err != nil {
      fmt.Println(err)
      return
    }
    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
  }
  `;
}

export function createRecord(reference: string) {
  return `
  package main

  import (
    "fmt"
    "strings"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}"
    method := "POST"

    payload := strings.NewReader('{
      "id": 4,
      "status": false,
      "message": "The API is working"
  }')

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, payload)

    if err != nil {
      fmt.Println(err)
      return
    }
    req.Header.Add("Content-Type", "application/json")

    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
  }
  `;
}

export function retrieveRecord(reference: string) {
  return `
  package main

  import (
    "fmt"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}/:id"
    method := "GET"

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, nil)

    if err != nil {
      fmt.Println(err)
      return
    }
    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
  }
  `;
}

export function updateRecord(reference: string) {
  return `
  package main

  import (
    "fmt"
    "strings"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}/:id"
    method := "PATCH"

    payload := strings.NewReader('{
      "message": "Update is working"
    }')

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, payload)

    if err != nil {
      fmt.Println(err)
      return
    }
    req.Header.Add("Content-Type", "application/json")

    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
    }
  `;
}

export function deleteRecord(reference: string) {
  return `
  package main

  import (
    "fmt"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}/:id"
    method := "DELETE"

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, nil)

    if err != nil {
      fmt.Println(err)
      return
    }
    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
  }
  `;
}

export function countRecords(reference: string) {
  return `
  package main

  import (
    "fmt"
    "net/http"
    "io/ioutil"
  )

  func main() {

    url := "${reference}/count"
    method := "GET"

    client := &http.Client {
    }
    req, err := http.NewRequest(method, url, nil)

    if err != nil {
      fmt.Println(err)
      return
    }
    res, err := client.Do(req)
    if err != nil {
      fmt.Println(err)
      return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
      fmt.Println(err)
      return
    }
    fmt.Println(string(body))
  }
  `;
}
