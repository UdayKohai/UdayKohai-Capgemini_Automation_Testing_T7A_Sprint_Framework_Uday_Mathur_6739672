class registerCustomer {
    firstNameInp:any;
    lastNameInp:any;
    addressInp:any;
    cityInp:any;
    stateInp:any;
    zipCodeInp:any;
    phoneNumberInp:any;
    ssnInp:any;
    usernameInp:any;
    passwordInp:any;
    confirmPasswordInp:any;
    registerBtn:any;

    constructor(page){
        this.firstNameInp = page.locator('//input[@id="customer.firstName"]');
        this.lastNameInp = page.locator('//input[@id="customer.lastName"]');
        this.addressInp = page.locator('//input[@id="customer.address.street"]');
        this.cityInp = page.locator('//input[@id="customer.address.city"]');
        this.stateInp = page.locator('//input[@id="customer.address.state"]');
        this.zipCodeInp = page.locator('//input[@id="customer.address.zipCode"]');
        this.phoneNumberInp = page.locator('//input[@id="customer.phoneNumber"]');
        this.ssnInp = page.locator('//input[@id="customer.ssn"]');
        this.usernameInp = page.locator('//input[@id="customer.username"]');
        this.passwordInp = page.locator('//input[@id="customer.password"]');
        this.confirmPasswordInp = page.locator('//input[@id="repeatedPassword"]');
        this.registerBtn = page.locator('//input[@value="Register"]');
    }

}

export default registerCustomer;