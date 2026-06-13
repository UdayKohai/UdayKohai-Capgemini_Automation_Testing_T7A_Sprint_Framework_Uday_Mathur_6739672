import {test, expect,request} from '@playwright/test';

import fs from 'fs';
import path from 'path';

// importing data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/transcationList.json'));
let data = JSON.parse(datafile);

test("Verify transaction list is Updated (API)", async ({request})=>{
    // declaring variables
    const url = data.url;
    let username = data.username;
    let password = data.password;
    let ammount = data.ammount;

    // request to log in
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(login.status()).toBe(200);
    let loginResponse = await login.json();
    // customer ID variable
    let customerId = loginResponse.id;

    // request to get account list of customer
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(accountList.status()).toBe(200);
    let accountListResponse = await accountList.json();

    // fromaccount and taccount ID variables
    let fromAccountId = accountListResponse[0].id;
    let toAccountId = accountListResponse[1].id;

    // request to perform a transcattion
    let transaction = await request.post(`${url}/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${ammount}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'  
        }
    });
    expect(transaction.status()).toBe(200);

    // request to recieve transaction of fromaccount
    let transactionList = await request.get(`${url}/accounts/${fromAccountId}/transactions`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept :'application/json'
        }
    })

    expect(transactionList.status()).toBe(200);

    // printing response
    let transactionListResponse = await transactionList.json();
    console.log(transactionListResponse);

    // checking if transaction has occured or not
    expect(transactionListResponse.length).toBeGreaterThanOrEqual(1);


});