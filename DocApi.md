# Documentation API

## 1. Customer / User
## 2. Cart / Transaction

### User biasa / customer
- 1. POST /customer/signup
   >> Request Header
   >> Request Body
    ```json
    {
      "username": "<name to get insert into>",
      "phone_number": "<description to get insert into>"
    }
    ```
  >>> Response (201 - Created - UnVerified)
  ```json
    {
      "id": <given id by system>,
      "username": "<posted name>",
      "phone_number": "<posted description>",
      "status": "<user status>"
    }
  ```
  >>> Response (400 - Bad Request)
  ```json
    {
      "message": "<given error message>"
    }
  ```
<!-- - 2. GET /customer/verif
  >> Request Params
      - verification_id
  >> Response (201 - Created - Verified)
  ```json
    {
      "usename": "<status veriied>"
    }
  ```
  >> Response (400 - Bad Request)
  ```json
    {
      "message": "<given error message>"
    }
  ``` -->
- 3. POST /customer/login
  >> Request Body
    ```json
    {
      "username": "<name to get insert into>",
      "phone_number": "<description to get insert into>"
    }
    ```
  >> Response (200 - Success)
  ```json
    {
      "access_token": "<access_token>"
    }
  ```
  >> Response (400 - Bad Request)
  ```json
    {
      "message": "<given error message>"
    }
  ```

## 2. Cart / Transaction
- 1. POST /cart
   >> Request Header
      - access_token
   >> Request Body
    ```json
    {
      "dataProduct": "<list of all product and quantity>"
    }
    ```
  >>> Response (201 - Created - UnVerified)
  ```json
    {
      "id": "<given id by system>",
      "message": "< success_create message >",
      "dataProduct": "<list of all product and quantity>"
    }
  ```
  >>> Response (400 - Bad Request)
  ```json
    {
      "message": "<given error message>"
    }
  ```