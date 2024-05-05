import {setNavbar ,getAllMessages, createTable, deleteMessage, setButtons} from '../functions.js';

main();
async function main(){
    const list = await getAllMessages();
    const headers = ['ID','Remetente','SMTP','Assunto', 'Texto','Criado em'];
    createTable(list, headers, '.table-container',{dates:['created_at']});
    setButtons({
        edit: true,
        delete: deleteMessage,
    });
}

setNavbar();