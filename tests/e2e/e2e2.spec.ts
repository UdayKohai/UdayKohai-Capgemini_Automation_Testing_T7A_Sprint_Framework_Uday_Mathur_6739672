
import {test,expect, request} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import transferFunds from '../../pages/transferFunds.page.ts';
import transferComplete from '../../pages/transferComplete.page';

import fs from 'fs'
import path from 'path';

// importing data from json file
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e2.json'));
let data = JSON.parse(datafile);


test("End to End 2 - Transfering funds via UI and Verifying details via API",async({page,request,browserName})=>{
    // declaring Variablesrequired
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let fromAccount = data.fromAccount;
    let toAccount = data.toAccount;
    let  amount = data.amount;
    let baseUrl = data.baseUrl;

    // Navigating to the website 
    await page.goto(url);

    // Declaring Objects of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let transferFundsPage = new transferFunds(page);
    let transferCompletedPage = new transferComplete(page);

    // Login Logic
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // navigating to transfer page
    await accountServicesPage.transferFunds.click();
    
    // filling out details for transaction
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index:Number(fromAccount)});
    let fromAccountId = await transferFundsPage.fromAccount.inputValue();

    // API request to det details of fromAccount
    let fromAccountdetail = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetail.status()).toBe(200);
    let fromAccountDetailResponse = await fromAccountdetail.json();
    // fromAccount balace before transaction
    let fromAccountBalaceBefore = await fromAccountDetailResponse.balance;


    await transferFundsPage.toAccount.selectOption({index:Number(toAccount)});
    let toAccountId = await transferFundsPage.toAccount.inputValue();
    // API request to get details of toAccount
    let toAccountdetail = await request.get(`${baseUrl}/accounts/${toAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(toAccountdetail.status()).toBe(200);
    let toAccountDetailResponse = await toAccountdetail.json();
    // Balance of toAccoutn before transaction
    let toAccountBalaceBefore = await toAccountDetailResponse.balance;

    await transferFundsPage.transferButton.click();

    // request to get details of fromaccount after ransaction
    let fromAccountdetailafter = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetailafter.status()).toBe(200);
    let fromAccountDetialResponseafter = await fromAccountdetailafter.json();
    // balance of from account after transaction
    let fromAccountBalaceafter = await fromAccountDetialResponseafter.balance;


    // request to ge toAccount Details after transaction
    let toAccountdetailafter = await request.get(`${baseUrl}/accounts/${toAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(toAccountdetailafter.status()).toBe(200);
    let toAccountDetailResponseafter = await toAccountdetailafter.json();
    // toaccount balace afer ransaction
    let toAccountBalaceafter = await toAccountDetailResponseafter.balance;

    // checking if balance of from account is updated corectly
    expect(toAccountBalaceafter).toBe(Number(toAccountBalaceBefore)+Number(amount));
    // checking if toaccount balace is updqated correcly
    expect(fromAccountBalaceafter).toBe(Number(fromAccountBalaceBefore)-Number(amount));

    console.log("Transaction is Validated")

    // Screenshot
    await page.screenshot({path:`Screenshot/E2E/E2E2${browserName}.png`})


})