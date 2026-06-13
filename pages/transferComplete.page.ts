class transferComplete{
    transferAmmount:any;
    fromAccount:any;
    toAccount:any;
    showResultMsg:any;
    showErrorMsg:any;

    constructor(page){
        this.transferAmmount = page.locator('//span[@id="amountResult"]');
        this.fromAccount = page.locator('//span[@id="fromAccountIdResult"]');
        this.toAccount = page.locator('//span[@id="toAccountIdResult"]');
        this.showResultMsg = page.locator('//div[@id="showResult"]/h1');
        this.showErrorMsg = page.locator('//div[@id="showError"]/h1');
    }
}

export default transferComplete;