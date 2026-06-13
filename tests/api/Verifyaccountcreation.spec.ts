import {test, expect , request} from '@playwright/test';

import fs from 'fs';
import path from 'path';       

// import data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountlist.json'));
let data = JSON.parse(datafile);

test("Verify account created API", async ({page,request})=>{
    // declare variables
    const url = data.url;
    let username = data.username;
    let password = data.password;

    // requst to log in
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    let loginResponse = await login.json();
    // customer ID
    let customerId = loginResponse.id;

    // request to recieve account list
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    let accountListResponse = await accountList.json();
    console.log('Account List Response: ');
    console.log(accountListResponse);

    // checking if accounts are created in the account or not

    await expect(accountListResponse.length).toBeGreaterThan(2);

    console.log('accountListResponse.length: ' + accountListResponse.length);
    
    console.log('Account created successfully and is present in the account list.');

});