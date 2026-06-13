import {test, expect} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import registerCustomer from '../../pages/registerCustomer.page';

import fs from 'fs'
import path from 'path';

// importing data from json file
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/registerCustomer.json')); 
let data = JSON.parse(datafile); 

test("Register a new customer", async ({page,browserName})=>{

    // skipping test as we only need it to run once 
    test.skip(browserName !== 'chromium', 'This test only runs once');
    // Declearing variables 
    let url = data.url;
    let fname = data.fname;
    let lname = data.lname;
    let address = data.address;
    let city = data.city;
    let state = data.state;
    let zip = data.zip;
    let phone = data.phone;
    let ssn = data.ssn;
    let username = data.username;
    let password = data.password;

    // Navigating to website
    await page.goto(url);

    // Declaring Objects of required POM
    let loginPage = new customerLogin(page);
    let registerPage = new registerCustomer(page);

    // clicking on register account
    await loginPage.registerLink.click();

    // filling required fields
    await registerPage.firstNameInp.fill(fname);
    await registerPage.lastNameInp.fill(lname);
    await registerPage.addressInp.fill(address);
    await registerPage.cityInp.fill(city);
    await registerPage.stateInp.fill(state);
    await registerPage.zipCodeInp.fill(zip);
    await registerPage.phoneNumberInp.fill(phone);
    await registerPage.ssnInp.fill(ssn);
    await registerPage.usernameInp.fill(username);
    await registerPage.passwordInp.fill(password);
    await registerPage.confirmPasswordInp.fill(password);

    await registerPage.registerBtn.click();

    // creating auth for saving storage state for repeated use
    await page.context().storageState({path:'.auth/sessionStorage.json'});

    // assertion for checking if successful registering
    await expect(page.locator(`//h1`)).toContainText("Welcome ");

    // Screenshot of completed test
    await page.screenshot({path:`Screenshot/UI/registeringCustomert${browserName}.png`});
    
});