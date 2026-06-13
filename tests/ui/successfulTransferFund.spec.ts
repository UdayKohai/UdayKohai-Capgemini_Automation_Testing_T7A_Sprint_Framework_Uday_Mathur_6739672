import {test, expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import transferFunds from '../../pages/transferFunds.page';
import transferComplete from '../../pages/transferComplete.page';

import fs from 'fs';
import path from 'path';
// importing data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/successfulTransferFund.json'));
let data = JSON.parse(datafile);

test("Transfer funds between accounts", async ({page,browserName})=>{

    // Declaring variables that are required
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let amount = data.transferAmount;

    // Navigating to website
    await page.goto(url);

    // Declaring objects of required POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);
    let transferCompletedPage = new transferComplete(page);


    // logic if login is required or not
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // navigating to transfer funds page
    await accountServicesPage.transferFunds.click();

    // filling amount for transfer
    await transferFundsPage.amount.fill(amount);
    // slecting fromaccout and toaccount option 
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();

    // Validating if Required messages and page are shown
    await expect(transferCompletedPage.showResultMsg).toBeVisible();
    await expect(transferCompletedPage.transferAmmount).toContainText(`${amount}`);

    // Screenshot
    await page.screenshot({path:`Screenshot/UI/successfulTransferFund${browserName}.png`});


});