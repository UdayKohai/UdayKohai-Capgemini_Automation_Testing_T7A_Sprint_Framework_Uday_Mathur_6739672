class customerLogin{
    usernameInp:any;
    passwordInp:any;
    loginBtn:any;
    registerLink:any;

    constructor(page){
        this.usernameInp = page.locator('//input[@name="username"]');
        this.passwordInp = page.locator('//input[@name="password"]');
        this.loginBtn = page.locator('//input[@type="submit"]');
        this.registerLink = page.locator('//a[text()="Register"]');
    }
}
export default customerLogin;