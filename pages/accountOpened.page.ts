class accountOpened{
    accountId:any;
    acceptedMessage:any;
    errorMessage:any;

    constructor(page){
        this.accountId = page.locator(`//a[@id="newAccountId"]`);
        this.acceptedMessage = page.locator(`//div[@id="openAccountResult"]/h1`);
        this.errorMessage = page.locator(`//div[@id="openAccountError"]/h1`);
    }
}

export default accountOpened;