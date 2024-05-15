import {setNavbar, createTable, setButtons, getAllEmails, deleteEmail} from '../functions.js';

main();
async function main(){
    const list = await getAllEmails();
    const headers = ['ID','SMTP','ID Mensagem','Assunto','Mensagem','Data cadastro','Enviado em','Destinatários'];
    createTable(list, headers, '.table-container', {dates:['created_at','sent_at']});
    setButtons({
        edit: true,
        delete: deleteEmail
    });
}

setNavbar();