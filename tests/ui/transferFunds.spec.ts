import {test, expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import transferFunds from '../../pages/transferFunds.page';
import transferComplete from '../../pages/transferComplete.page';

import fs from 'fs';
import path from 'path';

// importing data from json
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/transferFunds.json'));
let data = JSON.parse(datafile);

test("Transfer funds between accounts", async ({page,browserName})=>{
    // declaring variables required for a valid amount
    let url = data[0].url;
    let username = data[0].username;
    let password = data[0].password;
    let amount = data[0].transferAmount;

    // Navigating to the website
    await page.goto(url);

    // Declaring objects for POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);


    // logic if login is required or not
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // Navigating to transfet funds page
    await accountServicesPage.transferFunds.click();

    // performing required action for transaction
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();

    // assertion if transaction succeeded
    await expect(page.locator('//span[@id="amountResult"]')).toContainText(`$${amount}`);

    // Screenshot
        await page.screenshot({path:`Screenshot/UI/transferingValidAmount${browserName}.png`});


});

test("Transfer 0 funds between accounts", async ({page,browserName})=>{
    // declaring required variables
    let url = data[1].url;
    let username = data[1].username;
    let password = data[1].password;
    let amount = data[1].transferAmount;

    // navigating to the website
    await page.goto(url);

    // declaring objects of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);


    // logic if login is required or not
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // nav to tranafer funds page
    await accountServicesPage.transferFunds.click();

    // filling out required details with 0 as input of ammount 
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();

    // validating if test passed or not

    await expect(page.locator('//span[@id="amountResult"]')).toContainText(`$${amount}`);

    // Scereenshot
    await page.screenshot({path:`Screenshot/UI/transferFunds0ammount${browserName}.png`});


});

test("Transfer Negative funds between accounts", async ({page,browserName})=>{
    // Decalaring required variables
    let url = data[2].url;
    let username = data[2].username;
    let password = data[2].password;
    let amount = data[2].transferAmount;

    // Nav to website
    await page.goto(url);

    // Declaring required objects of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);

    // login logic if required
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // nav to transfer funds page
    await accountServicesPage.transferFunds.click();

    // filling details including negative integer as amount
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();
    
    // assertion if test succeeded
    const expectedAmount = `-$${Math.abs(Number(amount)).toFixed(2)}`;
    await expect(page.locator('#amountResult'))
        .toContainText(expectedAmount);

    // screenshot
        await page.screenshot({path:`Screenshot/UI/transferFunds(NegativeAmmount)t${browserName}.png`});


});

test("Transfer More than balance funds between accounts", async ({page,browserName})=>{
    // declaring required variables
    let url = data[3].url;
    let username = data[3].username;
    let password = data[3].password;
    let amount = data[3].transferAmount;

    // Nav to website
    await page.goto(url);

    // Declaring objects of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);

    // Login Logic
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // nav to transfer page
    await accountServicesPage.transferFunds.click();

    // filling trnasfer details (ammount being more than balance )
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();


    // Assertion if test succeeded
    await expect(page.locator('//span[@id="amountResult"]')).toContainText(`$${amount}`);

    // Screenshot
    await page.screenshot({path:`Screenshot/UI/transferFunds(MoreBalance)${browserName}.png`});


});

test("Transfer invalid fund (string) between accounts", async ({page,browserName})=>{
    // declaring variables
    let url = data[4].url;
    let username = data[4].username;
    let password = data[4].password;
    let amount = data[4].transferAmount;

    // Nav to websie
    await page.goto(url);

    // declaring objects of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);
    let transferCompletePage = new transferComplete(page);


    // login logic
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // Nav to transfer funds page
    await accountServicesPage.transferFunds.click();

    // filling string in ammount 
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index: 0});
    await transferFundsPage.toAccount.selectOption({index: 1});
    await transferFundsPage.transferButton.click();

    // validating Error message is shown or not

    await expect(transferCompletePage.showErrorMsg).toContainText('Error')

    // Screenshot
    await page.screenshot({path:`Screenshot/UI/transferFunds(string)${browserName}.png`});


    

});