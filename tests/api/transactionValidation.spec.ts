import {test, expect,request} from '@playwright/test';

import fs from 'fs';
import path from 'path';

// import data form json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/transactionValidation.json'));
let data = JSON.parse(datafile);

test("Verify transaction validation API", async ({request})=>{
    // declaring variables
    const url = data.url;
    let username = data.username;
    let password = data.password;
    let ammount = data.ammount;

    // request loging in
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(login.status()).toBe(200);
    let loginResponse = await login.json();
    // customer ID
    let customerId = loginResponse.id;

    // request to get account list
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(accountList.status()).toBe(200);

    // getting from account id and balace fefore transaction
    let accountListResponse = await accountList.json();
    let fromAccountId = accountListResponse[0].id;
    let fromAccountBalance = accountListResponse[0].balance;
    // getting to account id and balace fefore transaction

    let toAccountId = accountListResponse[1].id;
    let toAccountBalance = accountListResponse[1].balance;

    // request to perform transcation
    let transaction = await request.post(`${url}/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${ammount}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'  
        }
    });
    expect(transaction.status()).toBe(200);


    // request for updaed account list
    let newaccountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(newaccountList.status()).toBe(200);
    let newaccountListResponse = await newaccountList.json();
    // updated balacnes of from and to account
    let newFromAccountBalance = newaccountListResponse[0].balance;
    let newToAccountBalance = newaccountListResponse[1].balance;

    // validating if balances match the transaction
    expect(newFromAccountBalance).toBe(fromAccountBalance - ammount);
    expect(newToAccountBalance).toBe(Number(toAccountBalance) + (Number(ammount)));


});