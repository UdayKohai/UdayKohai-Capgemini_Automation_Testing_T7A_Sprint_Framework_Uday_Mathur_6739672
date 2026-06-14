# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accountCreation.spec.ts >> Creating account via API
- Location: tests\api\accountCreation.spec.ts:10:5

# Error details

```
SyntaxError: Unexpected token 'I', "Invalid us"... is not valid JSON
```

# Test source

```ts
  1  | import {test, expect, request} from '@playwright/test';
  2  | 
  3  | import fs from 'fs';
  4  | import path from 'path';
  5  | 
  6  | // importing data 
  7  | let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountCreation.json'));
  8  | let data = JSON.parse(datafile);
  9  | 
  10 | test("Creating account via API", async ({request})=>{
  11 | 
  12 |     // Declaring required variables
  13 |     const url = data.url;
  14 |     let username = data.username;
  15 |     let password = data.password;
  16 |     let expectedType = data.type;
  17 | 
  18 |     // Loging in as Customer via API
  19 |     let login = await request.get(`${url}/login/${username}/${password}`,{
  20 |         ignoreHTTPSErrors: true,
  21 |         headers: {
  22 |         Accept: 'application/json'
  23 |         }
  24 |     });
> 25 |     let loginResponse = await login.json();
     |                         ^ SyntaxError: Unexpected token 'I', "Invalid us"... is not valid JSON
  26 |     // taking CustomerId from reponse
  27 |     let customerId = loginResponse.id;
  28 | 
  29 | 
  30 |     // Sending request to account list of customer
  31 |     let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
  32 |         ignoreHTTPSErrors: true,
  33 |         headers: {
  34 |         Accept: 'application/json'
  35 |         }
  36 |     });
  37 |     let accountListResponse = await accountList.json();
  38 |     // getting from account id of customer
  39 |     let fromaccountId = accountListResponse[0].id;
  40 | 
  41 |     // logic to map Data into request parameter i.r. int
  42 |     let type
  43 |     if( expectedType = "CHECKING"){
  44 |         type = 0;   
  45 |     }
  46 |     if (expectedType = "SAVINGS") {
  47 |         type =1;
  48 |     } else {
  49 |         console.log("Invalid type");
  50 |     }
  51 | 
  52 | 
  53 |     // sending request to create account
  54 |     let createdAccounts = await request.post(`${url}/createAccount`,{
  55 |         params: {
  56 |         customerId,
  57 |         newAccountType : type,
  58 |         fromAccountId: fromaccountId
  59 |         },
  60 |         headers: {
  61 |         Accept: 'application/json'
  62 |         },
  63 |         ignoreHTTPSErrors: true 
  64 |     }
  65 |     );
  66 | 
  67 |     // assertion to check if requets is successful
  68 |     expect(createdAccounts.status()).toBe(200);
  69 |     
  70 |     // printing response 
  71 |     let createdAccountsResponse = createdAccounts.json();
  72 |     console.log(createdAccountsResponse)
  73 |     // printing accountID of created account
  74 |     let accountId = createdAccountsResponse.id;
  75 |     console.log('Account ID: ' + accountId);
  76 | });
```