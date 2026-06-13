import {test, expect, request} from '@playwright/test';

import fs from 'fs';
import path from 'path';

// importing data 
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountCreation.json'));
let data = JSON.parse(datafile);

test("Creating account via API", async ({request})=>{

    // Declaring required variables
    const url = data.url;
    let username = data.username;
    let password = data.password;
    let expectedType = data.type;

    // Loging in as Customer via API
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    let loginResponse = await login.json();
    // taking CustomerId from reponse
    let customerId = loginResponse.id;


    // Sending request to account list of customer
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    let accountListResponse = await accountList.json();
    // getting from account id of customer
    let fromaccountId = accountListResponse[0].id;

    // logic to map Data into request parameter i.r. int
    let type
    if( expectedType = "CHECKING"){
        type = 0;   
    }
    if (expectedType = "SAVINGS") {
        type =1;
    } else {
        console.log("Invalid type");
    }


    // sending request to create account
    let createdAccounts = await request.post(`${url}/createAccount`,{
        params: {
        customerId,
        newAccountType : type,
        fromAccountId: fromaccountId
        },
        headers: {
        Accept: 'application/json'
        },
        ignoreHTTPSErrors: true 
    }
    );

    // assertion to check if requets is successful
    expect(createdAccounts.status()).toBe(200);
    
    // printing response 
    let createdAccountsResponse = createdAccounts.json();
    console.log(createdAccountsResponse)
    // printing accountID of created account
    let accountId = createdAccountsResponse.id;
    console.log('Account ID: ' + accountId);
});