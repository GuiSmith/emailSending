import {setNavbar ,getAllMessages, createTable} from '../functions.js';

main();
async function main(){
    const list = await getAllMessages();
    const headers = ['ID','Remetente','SMTP','Assunto', 'Texto'];
    const table = createTable(list, headers);
    table.classList.add('grid-table');
    document.querySelector('.table-container').appendChild(table);
}

setNavbar(false);