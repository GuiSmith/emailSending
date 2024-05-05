import {setNavbar ,getAllSmtps, createTable, setButtons, deleteSmtp} from '../functions.js';

main();
async function main(){
    const list = await getAllSmtps();
    const headers = ['ID','SMTP','E-mail de envio','Criado em'];
    createTable(list, headers, '.table-container', {dates:['created_at']});
    setButtons({
        edit: true,
        delete: deleteSmtp
    });
}

setNavbar();