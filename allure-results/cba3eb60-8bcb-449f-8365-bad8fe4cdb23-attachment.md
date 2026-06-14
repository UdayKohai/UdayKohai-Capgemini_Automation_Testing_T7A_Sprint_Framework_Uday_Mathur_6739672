# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\e2e2.spec.ts >> End to End 2 - Transfering funds via UI and Verifying details via API
- Location: tests\e2e\e2e2.spec.ts:16:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 115.5
Received: 215.5
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - link:
        - /url: admin.htm
        - img [ref=e4] [cursor=pointer]
      - link "ParaBank":
        - /url: index.htm
        - img "ParaBank" [ref=e5] [cursor=pointer]
      - paragraph [ref=e6]: Experience the difference
    - generic [ref=e7]:
      - list [ref=e8]:
        - listitem [ref=e9]: Solutions
        - listitem [ref=e10]:
          - link "About Us" [ref=e11] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=e12]:
          - link "Services" [ref=e13] [cursor=pointer]:
            - /url: services.htm
        - listitem [ref=e14]:
          - link "Products" [ref=e15] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/products.jsp
        - listitem [ref=e16]:
          - link "Locations" [ref=e17] [cursor=pointer]:
            - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - listitem [ref=e18]:
          - link "Admin Page" [ref=e19] [cursor=pointer]:
            - /url: admin.htm
      - list [ref=e20]:
        - listitem [ref=e21]:
          - link "home" [ref=e22] [cursor=pointer]:
            - /url: index.htm
        - listitem [ref=e23]:
          - link "about" [ref=e24] [cursor=pointer]:
            - /url: about.htm
        - listitem [ref=e25]:
          - link "contact" [ref=e26] [cursor=pointer]:
            - /url: contact.htm
    - generic [ref=e27]:
      - generic [ref=e28]:
        - paragraph [ref=e29]: Welcome John Doe
        - heading "Account Services" [level=2] [ref=e30]
        - list [ref=e31]:
          - listitem [ref=e32]:
            - link "Open New Account" [ref=e33] [cursor=pointer]:
              - /url: openaccount.htm
          - listitem [ref=e34]:
            - link "Accounts Overview" [ref=e35] [cursor=pointer]:
              - /url: overview.htm
          - listitem [ref=e36]:
            - link "Transfer Funds" [ref=e37] [cursor=pointer]:
              - /url: transfer.htm
          - listitem [ref=e38]:
            - link "Bill Pay" [ref=e39] [cursor=pointer]:
              - /url: billpay.htm
          - listitem [ref=e40]:
            - link "Find Transactions" [ref=e41] [cursor=pointer]:
              - /url: findtrans.htm
          - listitem [ref=e42]:
            - link "Update Contact Info" [ref=e43] [cursor=pointer]:
              - /url: updateprofile.htm
          - listitem [ref=e44]:
            - link "Request Loan" [ref=e45] [cursor=pointer]:
              - /url: requestloan.htm
          - listitem [ref=e46]:
            - link "Log Out" [ref=e47] [cursor=pointer]:
              - /url: logout.htm
      - generic [ref=e50]:
        - heading "Transfer Complete!" [level=1] [ref=e51]
        - paragraph [ref=e52]: "$100.00 has been transferred from account #13788 to account #13899."
        - paragraph [ref=e53]: See Account Activity for more details.
  - generic [ref=e55]:
    - list [ref=e56]:
      - listitem [ref=e57]:
        - link "Home" [ref=e58] [cursor=pointer]:
          - /url: index.htm
        - text: "|"
      - listitem [ref=e59]:
        - link "About Us" [ref=e60] [cursor=pointer]:
          - /url: about.htm
        - text: "|"
      - listitem [ref=e61]:
        - link "Services" [ref=e62] [cursor=pointer]:
          - /url: services.htm
        - text: "|"
      - listitem [ref=e63]:
        - link "Products" [ref=e64] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/products.jsp
        - text: "|"
      - listitem [ref=e65]:
        - link "Locations" [ref=e66] [cursor=pointer]:
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
        - text: "|"
      - listitem [ref=e67]:
        - link "Forum" [ref=e68] [cursor=pointer]:
          - /url: http://forums.parasoft.com/
        - text: "|"
      - listitem [ref=e69]:
        - link "Site Map" [ref=e70] [cursor=pointer]:
          - /url: sitemap.htm
        - text: "|"
      - listitem [ref=e71]:
        - link "Contact Us" [ref=e72] [cursor=pointer]:
          - /url: contact.htm
    - paragraph [ref=e73]: © Parasoft. All rights reserved.
    - list [ref=e74]:
      - listitem [ref=e75]: "Visit us at:"
      - listitem [ref=e76]:
        - link "www.parasoft.com" [ref=e77] [cursor=pointer]:
          - /url: http://www.parasoft.com/
```

# Test source

```ts
  8   | import fs from 'fs'
  9   | import path from 'path';
  10  | 
  11  | // importing data from json file
  12  | let datafile = fs.readFileSync(path.join(__dirname,'../../test-data/e2e2.json'));
  13  | let data = JSON.parse(datafile);
  14  | 
  15  | 
  16  | test("End to End 2 - Transfering funds via UI and Verifying details via API",async({page,request,browserName})=>{
  17  |     // declaring Variablesrequired
  18  |     let url = data.url;
  19  |     let username = data.username;
  20  |     let password = data.password;
  21  |     let fromAccount = data.fromAccount;
  22  |     let toAccount = data.toAccount;
  23  |     let  amount = data.amount;
  24  |     let baseUrl = data.baseUrl;
  25  | 
  26  |     // Navigating to the website 
  27  |     await page.goto(url);
  28  | 
  29  |     // Declaring Objects of POM
  30  |     let loginPage = new customerLogin(page);
  31  |     let accountServicesPage = new accountServices(page);
  32  |     let transferFundsPage = new transferFunds(page);
  33  |     let transferCompletedPage = new transferComplete(page);
  34  | 
  35  |     // Login Logic
  36  |     const Logedin = await accountServicesPage.LogOut.isVisible();
  37  |     if( !Logedin){
  38  |         await loginPage.usernameInp.fill(username);
  39  |         await loginPage.passwordInp.fill(password);
  40  |         await loginPage.loginBtn.click();
  41  |     }
  42  | 
  43  |     // navigating to transfer page
  44  |     await accountServicesPage.transferFunds.click();
  45  |     
  46  |     // filling out details for transaction
  47  |     await transferFundsPage.amount.fill(amount);
  48  |     await transferFundsPage.fromAccount.selectOption({index:Number(fromAccount)});
  49  |     let fromAccountId = await transferFundsPage.fromAccount.inputValue();
  50  | 
  51  |     // API request to det details of fromAccount
  52  |     let fromAccountdetail = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
  53  |         ignoreHTTPSErrors:true,
  54  |         headers:{
  55  |             Accept: 'application/json'
  56  |         }
  57  |     })
  58  |     expect(fromAccountdetail.status()).toBe(200);
  59  |     let fromAccountDetailResponse = await fromAccountdetail.json();
  60  |     // fromAccount balace before transaction
  61  |     let fromAccountBalaceBefore = await fromAccountDetailResponse.balance;
  62  | 
  63  | 
  64  |     await transferFundsPage.toAccount.selectOption({index:Number(toAccount)});
  65  |     let toAccountId = await transferFundsPage.toAccount.inputValue();
  66  |     // API request to get details of toAccount
  67  |     let toAccountdetail = await request.get(`${baseUrl}/accounts/${toAccountId}`,{
  68  |         ignoreHTTPSErrors:true,
  69  |         headers:{
  70  |             Accept: 'application/json'
  71  |         }
  72  |     })
  73  |     expect(toAccountdetail.status()).toBe(200);
  74  |     let toAccountDetailResponse = await toAccountdetail.json();
  75  |     // Balance of toAccoutn before transaction
  76  |     let toAccountBalaceBefore = await toAccountDetailResponse.balance;
  77  | 
  78  |     await transferFundsPage.transferButton.click();
  79  | 
  80  |     // request to get details of fromaccount after ransaction
  81  |     let fromAccountdetailafter = await request.get(`${baseUrl}/accounts/${fromAccountId}`,{
  82  |         ignoreHTTPSErrors:true,
  83  |         headers:{
  84  |             Accept: 'application/json'
  85  |         }
  86  |     })
  87  |     expect(fromAccountdetailafter.status()).toBe(200);
  88  |     let fromAccountDetialResponseafter = await fromAccountdetailafter.json();
  89  |     // balance of from account after transaction
  90  |     let fromAccountBalaceafter = await fromAccountDetialResponseafter.balance;
  91  | 
  92  | 
  93  |     // request to ge toAccount Details after transaction
  94  |     let toAccountdetailafter = await request.get(`${baseUrl}/accounts/${toAccountId}`,{
  95  |         ignoreHTTPSErrors:true,
  96  |         headers:{
  97  |             Accept: 'application/json'
  98  |         }
  99  |     })
  100 |     expect(toAccountdetailafter.status()).toBe(200);
  101 |     let toAccountDetailResponseafter = await toAccountdetailafter.json();
  102 |     // toaccount balace afer ransaction
  103 |     let toAccountBalaceafter = await toAccountDetailResponseafter.balance;
  104 | 
  105 |     // checking if balance of from account is updated corectly
  106 |     expect(toAccountBalaceafter).toBe(Number(toAccountBalaceBefore)+Number(amount));
  107 |     // checking if toaccount balace is updqated correcly
> 108 |     expect(fromAccountBalaceafter).toBe(Number(fromAccountBalaceBefore)-Number(amount));
      |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  109 | 
  110 |     console.log("Transaction is Validated")
  111 | 
  112 |     // Screenshot
  113 |     await page.screenshot({path:`Screenshot/E2E/E2E2${browserName}.png`})
  114 | 
  115 | 
  116 | })
```