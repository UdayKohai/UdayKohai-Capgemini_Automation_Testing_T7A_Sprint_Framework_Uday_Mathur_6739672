pipeline {
agent any

```
options {
    timestamps()
}

stages {

    stage('Install Dependencies') {
        steps {
            bat 'npm install'
        }
    }

    stage('Install Playwright Browsers') {
        steps {
            bat 'npx playwright install'
        }
    }

    // =========================
    // UI TESTS
    // =========================

    stage('UI - Register Customer') {
        steps {
            bat 'npx playwright test tests/ui/registeringcustomer.spec.ts --workers=1'
        }
    }

    stage('UI - Open New Account') {
        steps {
            bat 'npx playwright test tests/ui/opeaningnewaccount.spec.ts --workers=1'
        }
    }

    stage('UI - Validate Account Opening Message') {
        steps {
            bat 'npx playwright test tests/ui/successfulOpeaingAccountMessage.spec.ts --workers=1'
        }
    }

    stage('UI - Validate Transfer Success Message') {
        steps {
            bat 'npx playwright test tests/ui/successfulTransferFundsMsg.spec.ts --workers=1'
        }
    }

    stage('UI - Transfer Funds') {
        steps {
            bat 'npx playwright test tests/ui/transferFunds.spec.ts --workers=1'
        }
    }

    // =========================
    // API TESTS
    // =========================

    stage('API - Account Creation') {
        steps {
            bat 'npx playwright test tests/api/accountcreationviaapi.spec.ts --workers=1'
        }
    }

    stage('API - Account Detail Validation') {
        steps {
            bat 'npx playwright test tests/api/accountdetailValidation.spec.ts --workers=1'
        }
    }

    stage('API - Account List Validation') {
        steps {
            bat 'npx playwright test tests/api/accountlist.spec.ts --workers=1'
        }
    }

    stage('API - Transaction List Validation') {
        steps {
            bat 'npx playwright test tests/api/transactionlist.spec.ts --workers=1'
        }
    }

    stage('API - Transaction Balance Validation') {
        steps {
            bat 'npx playwright test tests/api/transactionbalanceValidation.spec.ts --workers=1'
        }
    }

    stage('API - Verify Account Creation') {
        steps {
            bat 'npx playwright test tests/api/Verifyaccountcreation.spec.ts --workers=1'
        }
    }

    // =========================
    // E2E TESTS
    // =========================

    stage('E2E 1') {
        steps {
            bat 'npx playwright test tests/e2e/e2e1.spec.ts --workers=1'
        }
    }

    stage('E2E 2') {
        steps {
            bat 'npx playwright test tests/e2e/e2e2.spec.ts --workers=1'
        }
    }

    stage('E2E 3') {
        steps {
            bat 'npx playwright test tests/e2e/e2e3.spec.ts --workers=1'
        }
    }

    stage('E2E 4') {
        steps {
            bat 'npx playwright test tests/e2e/e2e4.spec.ts --workers=1'
        }
    }

    stage('E2E 5') {
        steps {
            bat 'npx playwright test tests/e2e/e2e5.spec.ts --workers=1'
        }
    }
}

post {
    always {

        publishHTML([
            allowMissing: true,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright HTML Report'
        ])

        archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

        archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true

        archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
}
```

}
