import {test,expect,request} from '@playwright/test';
import fs from 'fs';
import path from 'path';

// importing data
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/accountDetail.json'));
let data = JSON.parse(datafile);

test("Verify account detail API", async ({request})=>{
    // declaring variables 
    const url = data.url;
    let username = data.username;
    let password = data.password;
    let expectedType = data.type;
    let expectedBalance = data.balance;

    // request for laoging in
    let login = await request.get(`${url}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(login.status()).toBe(200);
    let loginResponse = await login.json();
    // variable for customerID
    let customerId = loginResponse.id;

    // request for geting list of account
    let accountList = await request.get(`${url}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(accountList.status()).toBe(200);
    let accountListResponse = await accountList.json();
    // getting details of last account created
    let lastAccount = accountListResponse[accountListResponse.length - 1];

    // Validating if last account details are expected values
    expect(lastAccount.type).toBe(expectedType);
    expect(lastAccount.balance).toBe(expectedBalance);


});