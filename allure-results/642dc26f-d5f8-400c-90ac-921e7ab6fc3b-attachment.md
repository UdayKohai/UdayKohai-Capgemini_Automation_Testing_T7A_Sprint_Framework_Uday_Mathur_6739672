# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\accountDetailValidation.spec.ts >> Verify account detail API
- Location: tests\api\accountDetailValidation.spec.ts:9:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1  | import {test,expect,request} from '@playwright/test';
  2  | import fs from 'fs';
  3  | import path from 'path';
  4  | 
  5  | // importing data
  6  | let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountDetail.json'));
  7  | let data = JSON.parse(datafile);
  8  | 
  9  | test("Verify account detail API", async ({request})=>{
  10 |     // declaring variables 
  11 |     const url = data.url;
  12 |     let username = data.username;
  13 |     let password = data.password;
  14 |     let expectedType = data.type;
  15 |     let expectedBalance = data.balance;
  16 | 
  17 |     // request for laoging in
  18 |     let login = await request.get(`${url}/login/${username}/${password}`,{
  19 |         ignoreHTTPSErrors: true,
  20 |         headers: {
  21 |         Accept: 'application/json'
  22 |         }
  23 |     });
> 24 |     expect(login.status()).toBe(200);
     |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  25 |     let loginResponse = await login.json();
  26 |     // variable for customerID
  27 |     let customerId = loginResponse.id;
  28 | 
  29 |     // request for geting list of account
  30 |     let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
  31 |         ignoreHTTPSErrors: true,
  32 |         headers: {
  33 |         Accept: 'application/json'
  34 |         }
  35 |     });
  36 |     expect(accountList.status()).toBe(200);
  37 |     let accountListResponse = await accountList.json();
  38 |     // getting details of last account created
  39 |     let lastAccount = accountListResponse[accountListResponse.length - 1];
  40 | 
  41 |     // Validating if last account details are expected values
  42 |     expect(lastAccount.type).toBe(expectedType);
  43 |     expect(lastAccount.balance).toBe(expectedBalance);
  44 | 
  45 | 
  46 | });
```