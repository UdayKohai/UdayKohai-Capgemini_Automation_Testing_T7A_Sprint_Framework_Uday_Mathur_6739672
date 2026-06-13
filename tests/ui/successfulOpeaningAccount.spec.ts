import {test, expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import openNewAcc from '../../pages/openNewAcc.page';
import accountOpened from '../../pages/accountOpened.page';

import fs from 'fs'
import path from 'path';


// importing data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/savingAcc.json'));
let data = JSON.parse(datafile);

test("Verifying Successful Opening Account Created Page", async ({page,browserName})=>{

    // declaring variables required
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let accountType = data.accountType;

    // navigating to the webpage
    await page.goto(url);

    // declaing objects for POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let openNewAccPage = new openNewAcc(page);
    let accountOpenedPage = new accountOpened(page);

    // logic if login is required or not
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // opeaing new account page
    await accountServicesPage.openNewAccount.click();

    // selecting account type
    await openNewAccPage.selectAccountType(accountType);
    await page.waitForTimeout(2000);
    // Clicking on button to create account
    await openNewAccPage.openNewAccBtn.click();
    await page.waitForTimeout(2000);

    
    // validating new page is coming and required messages are shown 
    await expect(accountOpenedPage.acceptedMessage).toContainText('Account Opened!');
    let newAccountId = await accountOpenedPage.accountId.textContent();
    console.log(`New Account ID : ${newAccountId}`);

    // screenshot 

    await page.screenshot({path:`Screenshot/UI/successfulOpeaingAccount${browserName}.png`});

    
});
