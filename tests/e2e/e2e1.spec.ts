import {test, expect,request} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import openNewAcc from '../../pages/openNewAcc.page';
import accountOpened from '../../pages/accountOpened.page';

import fs from 'fs'
import path from 'path';

// importing data from json file
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e1.json'));
let data = JSON.parse(datafile);

test("End to end test - Open a new account (UI) and Validating new account details (API)", async ({page, request,browserName})=>{
    // declaring required variables
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let accountType = data.accountType;
    let balance = data.balance;
    let baseUrl = data.baseUrl;

    // navigating to the website
    await page.goto(url);

    // Declaring objects of POM 
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

    // Navigating to open new account page
    await accountServicesPage.openNewAccount.click();

    // Selectign new account Details
    await openNewAccPage.selectAccountType(accountType);
    await page.waitForTimeout(2000);
    await openNewAccPage.openNewAccBtn.click();
    await page.waitForTimeout(2000);

    // Validating Successful creation of account page
    await expect(accountOpenedPage.acceptedMessage).toContainText("Account Opened!");

    // declaring account Id of new account
    let accountId = await accountOpenedPage.accountId.textContent();

    // request to login via api
    let apiLogin = await request.get(`${baseUrl}/login/${username}/${password}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });

    expect(apiLogin.status()).toBe(200);

    let loginResponse = await apiLogin.json();
    // Customer ID 
    let customerId = loginResponse.id;

    // Request to get account details
    let accounntDetail = await request.get(`${baseUrl}/accounts/${accountId}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });


    expect(accounntDetail.status()).toBe(200);

    let accountDetailResponse = await accounntDetail.json();

    // Validating account details recived by api request
    expect(accountDetailResponse.id).toBe(Number(accountId));
    expect(accountDetailResponse.customerId).toBe(customerId);
    expect(accountDetailResponse.type).toBe(accountType);
    expect(accountDetailResponse.balance).toBe(Number(balance));

    // Screenshot
    await page.screenshot({path:`Screenshot/E2E/E2E1${browserName}.png`})


});