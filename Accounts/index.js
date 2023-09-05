import inquirer from 'inquirer';
import chalk from 'chalk';

import fs from 'fs';

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

        const accountsDirectory = 'accounts';

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