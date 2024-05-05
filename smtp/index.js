import {setNavbar ,getAllSmtps, createTable, setButtons, deleteSmtp} from '../functions.js';

main();
async function main(){
    const list = await getAllSmtps();
    const headers = ['ID','SMTP','E-mail de envio'];
    createTable(list, headers, '.table-container');
    setButtons({
        edit: true,
        delete: deleteSmtp
    });
}

setNavbar();