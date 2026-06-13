class openNewAcc{
    accountType:any;
    existingAccount:any;
    openNewAccBtn:any;

    optionType:any;
    optionExistingAcc:any;

    constructor(page){
        this.accountType = page.locator('//select[@id = "type"]');
        this.existingAccount = page.locator('//select[@id = "fromAccountId"]');
        this.openNewAccBtn = page.locator('//input');
    }

    async selectAccountType(type){
        await this.accountType.selectOption({label:type});
    }

    async selectExistingAccount(account){
        await this.existingAccount.selectOption(account);
    }

}

export default openNewAcc;
