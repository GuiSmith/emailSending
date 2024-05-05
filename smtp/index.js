import {setNavbar ,getAllSmtps, createTable} from '../functions.js';

main();
async function main(){
    const list = await getAllSmtps('../');
    const headers = ['ID','SMTP','E-mail de envio'];
    const table = createTable(list, headers);
    table.classList.add('grid-table');
    document.querySelector('.table-container').appendChild(table);
}

setNavbar();