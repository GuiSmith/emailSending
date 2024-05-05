import {setNavbar ,getAllMessages, createTable, deleteMessage, setButtons} from '../functions.js';

main();
async function main(){
    const list = await getAllMessages();
    const headers = ['ID','Remetente','SMTP','Assunto', 'Texto'];
    createTable(list, headers, '.table-container');
    setButtons({
        edit: true,
        delete: deleteMessage,
    });
}

setNavbar();