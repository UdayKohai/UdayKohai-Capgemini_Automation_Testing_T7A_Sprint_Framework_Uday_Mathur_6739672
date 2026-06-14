# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\transactionValidation.spec.ts >> Verify transaction validation API
- Location: tests\api\transactionValidation.spec.ts:10:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1  | import {test, expect,request} from '@playwright/test';
  2  | 
  3  | import fs from 'fs';
  4  | import path from 'path';
  5  | 
  6  | // import data form json
  7  | let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/transactionValidation.json'));
  8  | let data = JSON.parse(datafile);
  9  | 
  10 | test("Verify transaction validation API", async ({request})=>{
  11 |     // declaring variables
  12 |     const url = data.url;
  13 |     let username = data.username;
  14 |     let password = data.password;
  15 |     let ammount = data.ammount;
  16 | 
  17 |     // request loging in
  18 |     let login = await request.get(`${url}/login/${username}/${password}`,{
  19 |         ignoreHTTPSErrors: true,
  20 |         headers: {
  21 |         Accept: 'application/json'
  22 |         }
  23 |     });
> 24 |     expect(login.status()).toBe(200);
     |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  25 |     let loginResponse = await login.json();
  26 |     // customer ID
  27 |     let customerId = loginResponse.id;
  28 | 
  29 |     // request to get account list
  30 |     let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
  31 |         ignoreHTTPSErrors: true,
  32 |         headers: {
  33 |         Accept: 'application/json'
  34 |         }
  35 |     });
  36 |     expect(accountList.status()).toBe(200);
  37 | 
  38 |     // getting from account id and balace fefore transaction
  39 |     let accountListResponse = await accountList.json();
  40 |     let fromAccountId = accountListResponse[0].id;
  41 |     let fromAccountBalance = accountListResponse[0].balance;
  42 |     // getting to account id and balace fefore transaction
  43 | 
  44 |     let toAccountId = accountListResponse[1].id;
  45 |     let toAccountBalance = accountListResponse[1].balance;
  46 | 
  47 |     // request to perform transcation
  48 |     let transaction = await request.post(`${url}/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${ammount}`,{
  49 |         ignoreHTTPSErrors: true,
  50 |         headers: {
  51 |         Accept: 'application/json'  
  52 |         }
  53 |     });
  54 |     expect(transaction.status()).toBe(200);
  55 | 
  56 | 
  57 |     // request for updaed account list
  58 |     let newaccountList = await request.get(`${url}/customers/${customerId}/accounts`,{
  59 |         ignoreHTTPSErrors: true,
  60 |         headers: {
  61 |         Accept: 'application/json'
  62 |         }
  63 |     });
  64 |     expect(newaccountList.status()).toBe(200);
  65 |     let newaccountListResponse = await newaccountList.json();
  66 |     // updated balacnes of from and to account
  67 |     let newFromAccountBalance = newaccountListResponse[0].balance;
  68 |     let newToAccountBalance = newaccountListResponse[1].balance;
  69 | 
  70 |     // validating if balances match the transaction
  71 |     expect(newFromAccountBalance).toBe(fromAccountBalance - ammount);
  72 |     expect(newToAccountBalance).toBe(Number(toAccountBalance) + (Number(ammount)));
  73 | 
  74 | 
  75 | });
```