import {test, expect,request} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import openNewAcc from '../../pages/openNewAcc.page';
import accountOpened from '../../pages/accountOpened.page';

import fs from 'fs'
import path from 'path';

// importing data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e4.json'));
let data = JSON.parse(datafile);

test("End to end test 4 - Open a multiple new accounts (UI) and Validating new account details (API) and Account List Updated (API)", 
    async ({page, request, browserName})=>{

    // Declaring variables
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let accountType:string [] = data.accountType;
    let balance = data.balance;
    let baseUrl = data.baseUrl;
    console.log(accountType);
    let customerId;
    let noOfAcc=0; //variable to count how many accounts are created 

    // navigate to website
    await page.goto(url);

    // Declaring Objects of required POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let openNewAccPage = new openNewAcc(page);
    let accountOpenedPage = new accountOpened(page);

    // Login Logic
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // loop logic to create multiple account
    for(const account of accountType){
        // Nav to open account page
        await accountServicesPage.openNewAccount.click();
        await openNewAccPage.selectAccountType(account);
        await page.waitForTimeout(2000);
        await openNewAccPage.openNewAccBtn.click();
        await page.waitForTimeout(2000);

        // Validating successful account creation message
        await expect(accountOpenedPage.acceptedMessage).toContainText("Account Opened!");

        // Account ID of account created
        let accountId = await accountOpenedPage.accountId.textContent();

        // API request to get details of new account
        let accounntDetail = await request.get(`${baseUrl}/accounts/${accountId}`,{
            ignoreHTTPSErrors: true,
            headers: {
            Accept: 'application/json'
            }
        });
        expect(accounntDetail.status()).toBe(200);
        let accountDetailResponse = await accounntDetail.json();

        customerId = await accountDetailResponse.customerId;
        
        // Validating API response deatils of account
        expect(accountDetailResponse.id).toBe(Number(accountId));
        expect(accountDetailResponse.type).toBe(account);
        expect(accountDetailResponse.balance).toBe(Number(balance));

        // Incrementing the no of account created
        noOfAcc +=1;
    }

    // API request to get account list of customer
    let accountList = await request.get(`${baseUrl}/customers/${customerId}/accounts`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });

    // Account list response 
    let accountListResponse = await accountList.json();
    console.log('Account List Response: ');
    console.log(accountListResponse);

    // Validating that customner has at least that much account that were created in the loop
    expect(accountListResponse.length).toBeGreaterThanOrEqual(noOfAcc);
    
    // Screenshot
    await page.screenshot({path:`Screenshot/E2E/E2E4${browserName}.png`})

});