import {test, expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import openNewAcc from '../../pages/openNewAcc.page';

import fs from 'fs'
import path from 'path';

// importing data from json file

let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/savingAcc.json'));
let data = JSON.parse(datafile);

test("Open a new savings account", async ({page,browserName})=>{

    // creating variables for the test from data 

    let url = data.url;
    let username = data.username;
    let password = data.password;
    let accountType = data.accountType;

    // navigating to the website

    await page.goto(url);

    // creating objects of Page Object Models 

    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let openNewAccPage = new openNewAcc(page);


    // logic to check if login is required or not 

    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // clicking on opeaing account anchor tag
    await accountServicesPage.openNewAccount.click();

    // selecting "SAVINGS" account
    await openNewAccPage.selectAccountType(accountType);
    await page.waitForTimeout(2000);
    // Clicking on Create Account
    await openNewAccPage.openNewAccBtn.click();
    await page.waitForTimeout(2000);

    // Validating if sucesspage is achieved or not

    await expect(page.locator('//h1').nth(1)).toContainText("Account Opened!");


    await page.screenshot({path:`Screenshot/UI/opeaingSavingsAccount${browserName}.png`});

    
});


let datafile2 = fs.readFileSync(path.join(__dirname,'../../test-data/checkingAcc.json'));
let data2 = JSON.parse(datafile2);

test("Open a new current account", async ({page,browserName})=>{

    // Declearing Variables 

    let url = data2.url;
    let username = data2.username;
    let password = data2.password;
    let accountType = data2.accountType;

    // Navigating to the website

    await page.goto(url);

    // Declaring pages object of POM 
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let openNewAccPage = new openNewAcc(page);

    // logic if Login is required
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // opeaing new accout option
    await accountServicesPage.openNewAccount.click();

    // Selecting "CHECKING" account
    await openNewAccPage.selectAccountType(accountType);
    await page.waitForTimeout(2000);
    await openNewAccPage.openNewAccBtn.click();

    await page.waitForTimeout(2000);

    // Validating if sucesspage is achieved or not
    await expect(page.locator('//h1').nth(1)).toContainText("Account Opened!");

    await page.screenshot({path:`Screenshot/UI/opeaingCheckingAccount${browserName}.png`});

    
});