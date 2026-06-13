class transferFunds {
    amount:any;
    fromAccount:any;
    toAccount:any;
    transferButton:any;

    constructor(page){
        this.amount = page.locator('//input[@id="amount"]');
        this.fromAccount = page.locator('//select[@id="fromAccountId"]');
        this.toAccount = page.locator('//select[@id="toAccountId"]');
        this.transferButton = page.locator('//input[@value="Transfer"]');
    }
}

export default transferFunds;