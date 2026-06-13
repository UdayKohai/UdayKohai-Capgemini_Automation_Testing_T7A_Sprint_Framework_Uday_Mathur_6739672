import {test,expect,request} from '@playwright/test';
import fs from 'fs';
import path from 'path';

// importing data
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/invalidAccountValidation.json'));
let data = JSON.parse(datafile);

test("Verify account detail API", async ({request})=>{
    // declaring variables
    const url = data.url;
    let username = data.username;
    let password = data.password;
    let invalidAccountId = data.invalidAccountId;

    // request to get details of an invalid accountID
    let invalidAccout = await request.get(`${url}/accounts/${invalidAccountId}`,{
        ignoreHTTPSErrors:true,
        headers: {
        Accept: 'application/json'
        }
    });
    expect(invalidAccout.status()).toBe(400);

    // printing our the response of request
    let resp = await invalidAccout.text();
    console.log(resp);

});