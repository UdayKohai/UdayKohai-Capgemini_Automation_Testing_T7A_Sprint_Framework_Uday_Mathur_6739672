class accountServices{
    openNewAccount:any;
    accountOverview:any;
    transferFunds:any;
    billPay:any;
    FindTransactions:any;
    UpdateContactInfo:any;
    RequestLoan:any;
    LogOut:any;

    constructor(page){
        this.openNewAccount = page.locator('//a[text()="Open New Account"]');
        this.accountOverview = page.locator('//a[text()="Accounts Overview"]');
        this.transferFunds = page.locator('//div[@id="leftPanel"]//a[text()="Transfer Funds"]');
        this.billPay = page.locator('//a[text()="Bill Pay"]');
        this.FindTransactions = page.locator('//a[text()="Find Transactions"]');
        this.UpdateContactInfo = page.locator('//a[text()="Update Contact Info"]');
        this.RequestLoan = page.locator('//a[text()="Request Loan"]');
        this.LogOut = page.locator('//a[text()="Log Out"]');
    }

}
export default accountServices;
