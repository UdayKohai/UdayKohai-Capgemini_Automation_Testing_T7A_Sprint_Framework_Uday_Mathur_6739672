import {test, expect,request} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import openNewAcc from '../../pages/openNewAcc.page';
import accountOpened from '../../pages/accountOpened.page';
import transferFunds from '../../pages/transferFunds.page.ts';
import transferComplete from '../../pages/transferComplete.page';

import fs from 'fs'
import path from 'path';

// imporing data from json file
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e3.json'));
let data = JSON.parse(datafile);

test("End to End 3 - Full user end to end process of UI and validation via API", async({page,request,browserName})=>{
    // Declaring variables 
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let accountType = data.accountType;
    let fromAccount = Number(data.fromAccount);
    let toAccount = Number(data.toAccount);
    let amount = data.amount;
    let baseUrl = data.baseUrl;

    // Navigating to Website
    await page.goto(url);

    // Declaring Object of POM
    let loginPage = new customerLogin(page);
    let accountServicesPage = new accountServices(page);
    let openNewAccPage = new openNewAcc(page);
    let accountOpenedPage = new accountOpened(page);
    let transferFundsPage = new transferFunds(page);
    let transferCompletedPage = new transferComplete(page);

    // Login Logic
    const Logedin = await accountServicesPage.LogOut.isVisible();
    if( !Logedin){
        await loginPage.usernameInp.fill(username);
        await loginPage.passwordInp.fill(password);
        await loginPage.loginBtn.click();
    }

    // Navigate to Opeaning new account
    await accountServicesPage.openNewAccount.click();
    // selecting Account type
    await openNewAccPage.selectAccountType(accountType);
    await page.waitForTimeout(2000);
    await openNewAccPage.openNewAccBtn.click();
    await page.waitForTimeout(2000);

    // Validating success page of Opeaning Account
    await expect(accountOpenedPage.acceptedMessage).toContainText("Account Opened!");

    // account id of toAccount for transaction
    let toaccountId = await accountOpenedPage.accountId.textContent();

    // API request to login
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

    // API request to get details of toAccount
    let accounntDetail = await request.get(`${baseUrl}/accounts/${toaccountId}`,{
        ignoreHTTPSErrors: true,
        headers: {
        Accept: 'application/json'
        }
    });


    expect(accounntDetail.status()).toBe(200);

    let accountDetailResponse = await accounntDetail.json();
    // balance of toAccount before transaction
    let toAccountBalaceBefore = await accountDetailResponse.balance;

    
    // Validating response details
    expect(accountDetailResponse.id).toBe(Number(toaccountId));
    expect(accountDetailResponse.customerId).toBe(customerId);
    expect(accountDetailResponse.type).toBe(accountType);

    // Navigating to transfet funds page
    await accountServicesPage.transferFunds.click();
    // filling out details
    await transferFundsPage.amount.fill(amount);
    await transferFundsPage.fromAccount.selectOption({index:Number(fromAccount)});
    // Account ID  of from account
    let fromAccountId = await transferFundsPage.fromAccount.inputValue();

    // API request to get details of fromAccount
    let fromAccountdetail = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetail.status()).toBe(200);
    let fromAccountDetailResponse = await fromAccountdetail.json();
    // Balance of from account before transaction
    let fromAccountBalaceBefore = await fromAccountDetailResponse.balance;

    await transferFundsPage.toAccount.selectOption(toaccountId);
    await transferFundsPage.transferButton.click();

    // Validating Successful transfer funds page
    await expect(transferCompletedPage.showResultMsg).toBeVisible();
    await expect(transferCompletedPage.transferAmmount).toContainText(`${amount}`);

    // API request to get details of from account after transaction
    let fromAccountdetailafter = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetailafter.status()).toBe(200);
    let fromAccountDetialResponseafter = await fromAccountdetailafter.json();
    // fromAccount balace after transaction
    let fromAccountBalaceafter = await fromAccountDetialResponseafter.balance;

    // API requuest to get detail of toaccount after transaction
    let toAccountdetailafter = await request.get(`${baseUrl}/accounts/${toaccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(toAccountdetailafter.status()).toBe(200);
    let toAccountDetailResponseafter = await toAccountdetailafter.json();
    // Balance of toAccount after transaction
    let toAccountBalaceafter = await toAccountDetailResponseafter.balance;

    // Validating if balance of fromaccount is correct
    expect(toAccountBalaceafter).toBe(Number(toAccountBalaceBefore)+Number(amount));
    
    // Validating if balance of toaccount is correct
    expect(fromAccountBalaceafter).toBe(Number(fromAccountBalaceBefore)-Number(amount));

        // Screenshot
    await page.screenshot({path:`Screenshot/E2E/E2E3${browserName}.png`})
})