
import {test,expect, request} from '@playwright/test';
import customerLogin from '../../pages/customerLogin.page';
import accountServices from '../../pages/AccountServices.page';
import transferFunds from '../../pages/transferFunds.page.ts';
import transferComplete from '../../pages/transferComplete.page';

import fs from 'fs'
import path from 'path';

// Importing data from json file
let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e5.json'));
let data = JSON.parse(datafile);


test("End to End 5 - Multiple transaction via UI and Verifying balance via API",async({page,request,browserName})=>{

    // Declarin Variables required
    let url = data.url;
    let username = data.username;
    let password = data.password;
    let fromAccount = data.fromAccount;
    let toAccount = data.toAccount;
    let  amount = data.amount;
    let baseUrl = data.baseUrl;

    let totalamount=0; //total ammount of transaction made
    let transactionCount =0; //no of transaction made

    // Navigating to website
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

    // Navigate to transfer funds
    await accountServicesPage.transferFunds.click();
    await transferFundsPage.fromAccount.selectOption({index:Number(fromAccount)});
    // account ID of from account
    let fromAccountId = await transferFundsPage.fromAccount.inputValue();

    // API request to get from account details
    let fromAccountdetail = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetail.status()).toBe(200);
    let fromAccountDetailResponse = await fromAccountdetail.json();
    // balance of from accout before any transcation
    let fromAccountBalaceBefore = await fromAccountDetailResponse.balance;

    await transferFundsPage.toAccount.selectOption({index:Number(toAccount)});
    // Account ID of toAccount
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
    // balance of toAccount before any transaction
    let toAccountBalaceBefore = await toAccountDetailResponse.balance;

    // Loop to create multiple transcation
    for(const a of amount){
        // Nav to transfer funds page
        await accountServicesPage.transferFunds.click();
        
        // Filling details
        await transferFundsPage.amount.fill(a);
        await transferFundsPage.fromAccount.selectOption(fromAccountId);
        await transferFundsPage.toAccount.selectOption(toAccountId)

        await transferFundsPage.transferButton.click();

        // Incrementing the ammount of transation done
        totalamount += Number(a);
        // Incrementing no of transcation
        transactionCount +=1;
    }
    
    // API request to get details of fromAcvcount after all transcation
    let fromAccountdetailafter = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(fromAccountdetailafter.status()).toBe(200);
    let fromAccountDetialResponseafter = await fromAccountdetailafter.json();
    // balance of fromaccount after transaction
    let fromAccountBalaceafter = await fromAccountDetialResponseafter.balance;


    // API request to get toAccount details after all transaction
    let toAccountdetailafter = await request.get(`${baseUrl}/accounts/${toAccountId}`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept: 'application/json'
        }
    })
    expect(toAccountdetailafter.status()).toBe(200);
    let toAccountDetailResponseafter = await toAccountdetailafter.json();
    // Blance of toAccount after all transaction
    let toAccountBalaceafter = await toAccountDetailResponseafter.balance;

    // Validating Balance of fromAccount is updated correctly
    expect(toAccountBalaceafter).toBe(Number(toAccountBalaceBefore)+Number(totalamount));

    // Validating Balance of toAccount is updated correctly
    expect(fromAccountBalaceafter).toBe(Number(fromAccountBalaceBefore)-Number(totalamount));

    console.log("Transaction balance is Validated")

    // API request to get transaction list of from account
    let transactionList = await request.get(`${baseUrl}/accounts/${fromAccountId}/transactions`,{
        ignoreHTTPSErrors:true,
        headers:{
            Accept :'application/json'
        }
    })

    expect(transactionList.status()).toBe(200);

    let transactionListResponse = await transactionList.json();
    console.log(transactionListResponse);

    // Validating that fromAccount has at least that no of transaction that have takne place in test
    expect(transactionListResponse.length).toBeGreaterThanOrEqual(transactionCount);

    // Screenshot
    await page.screenshot({path:`Screenshot/E2E/E2E5${browserName}.png`})

})