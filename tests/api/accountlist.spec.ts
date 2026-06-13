import {test, request , expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';

import fs from 'fs';
import path from 'path';

// importing data
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountlist.json'));
let data = JSON.parse(datafile);

test("Verify account list API", async ({page,request})=>{

    // Declaring variables
    const url = data.url;
    let username = data.username;
    let password = data.password;

    // request to loging in
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });

    let loginResponse = await login.json();
    // variable for customerID
    let customerId = loginResponse.id;

    console.log(loginResponse);
    console.log(customerId);


    // request for getting account list of customer
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    let accountListResponse = await accountList.json();
    // printing out the whole account list
    console.log('Account List Response: ');
    console.log(accountListResponse);
});