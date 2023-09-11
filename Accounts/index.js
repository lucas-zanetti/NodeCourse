import inquirer from 'inquirer';
import chalk from 'chalk';

import fs from 'fs';

const accountsDirectory = 'accounts';

operation();

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
    .then(answer =>{
        const action = answer['action'];

        switch(action){
            case 'Criar Conta':
                createAccount();
                break;
            case 'Depositar':
                deposit();
                break;
            case 'Sair':
                finishProgram();
                break;
            default:
                console.error('Action error!')
                operation();
        }
    })
    .catch(err => console.log(err));
}

function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por utilizar nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir:'));

    buildAccount();
}

function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta: '
    }])
    .then(answer =>{
        const accountName = answer['accountName'];

        createDirectory(accountsDirectory);

        let accountFilePath = `${accountsDirectory}/${accountName}.json`;

        if(checkFileExistence(accountFilePath)){
            console.log(chalk.bgRed.black(`Esta conta '${accountName}' já existe! Escolha outro nome`));

            return buildAccount();
        }

        finishAccountCreation(accountFilePath);
    })
    .catch(err => console.log(err));
}

function createDirectory(directoryPath){
    if(!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath);
    }
}

function checkFileExistence(filePath){
    return fs.existsSync(filePath)
}

function finishAccountCreation(accountFilePath){
    fs.writeFileSync(accountFilePath, '{ "balance": 0 }', err => console.log(err));
    
    console.log(chalk.green('Parabéns a sua conta foi criada!'));

    operation();
}

function finishProgram(){
    console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));

    process.exit();
}

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta para depositar?'
        }
    ])
    .then(answer =>{
        const accountName = answer['accountName'];

        if(!existAccount(accountName)){
            return deposit();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ])
        .then(answer =>{
            const amount = answer['amount'];
    
            addAmount(accountName, amount);
            operation();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

function existAccount(accountName){
    if(!fs.existsSync(`${accountsDirectory}/${accountName}.json`)){
        console.log(chalk.bgRed.black(`Esta conta '${accountName}' não existe!`));
        return false;
    }

    return true;
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName);

    if(!amount){
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
        `${accountsDirectory}/${accountName}.json`,
        JSON.stringify(accountData),
        err => console.log(err)
    );

    console.log(chalk.green(`Foi depositado o valor de R$${amount} a conta ${accountName}!`));
}

function getAccount(accountName){
    const accountJson = fs.readFileSync(
        `${accountsDirectory}/${accountName}.json`,
        {
            encoding: 'utf-8',
            flag: 'r'
        });
    
    return JSON.parse(accountJson);
}