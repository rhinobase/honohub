export function listRecords(reference: string) {
  return `
    <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('${reference}');
  $request->setMethod(HTTP_Request2::METHOD_GET);
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}

export function createRecord(reference: string) {
  return `
  <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('${reference}');
  $request->setMethod(HTTP_Request2::METHOD_POST);
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  $request->setHeader(array(
    'Content-Type' => 'application/json'
  ));
  $request->setBody('{\n    "id": 4,\n    "status": false,\n    "message": "The API is working"\n}');
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}

export function retrieveRecord(reference: string) {
  return `
  <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('${reference}/:id');
  $request->setMethod(HTTP_Request2::METHOD_GET);
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}

export function updateRecord(reference: string) {
  return `
  <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('${reference}/:id');
  $request->setMethod('PATCH');
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  $request->setHeader(array(
    'Content-Type' => 'application/json'
  ));
  $request->setBody('{\n    "message": "Update is working"\n}');
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}

export function deleteRecord(reference: string) {
  return `
  <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('http://localhost:3000/collections/todos/55');
  $request->setMethod(HTTP_Request2::METHOD_DELETE);
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}

export function countRecords(reference: string) {
  return `
  <?php
  require_once 'HTTP/Request2.php';
  $request = new HTTP_Request2();
  $request->setUrl('${reference}/count');
  $request->setMethod(HTTP_Request2::METHOD_GET);
  $request->setConfig(array(
    'follow_redirects' => TRUE
  ));
  try {
    $response = $request->send();
    if ($response->getStatus() == 200) {
      echo $response->getBody();
    }
    else {
      echo 'Unexpected HTTP status: ' . $response->getStatus() . ' ' .
      $response->getReasonPhrase();
    }
  }
  catch(HTTP_Request2_Exception $e) {
    echo 'Error: ' . $e->getMessage();
  }
  `;
}
