import {setNavbar,getURLid, getMessage, setMessage, updateMessage, deleteMessage, duplicateMessage, fillInputs, setFeedback, setListOptions, getAllSmtps, setSummernote} from '../../functions.js';
const idInput = document.querySelector('input[name=id]'); 
let saveButton = document.querySelector('.save-button');

async function updateForm(lastInsertId = null){

    //If last insert ID wasn't informed, then gets the ID informed in the URL
    if (!lastInsertId) lastInsertId = getURLid();

    setListOptions('datalist[id=smtp-list]',await getAllSmtps(), 'sender');
    
    //If last insert ID isn't null
    if (lastInsertId != null) {
        let messageData = await getMessage(lastInsertId); //Gets smtp with informed ID
        fillInputs(messageData,{dates:['created_at','updated_at']});
        console.log(messageData);
        //Sets up delete button
        document.querySelector('.delete-button').addEventListener('click', async () => {
            if (confirm('Tem certeza de que deseja deletar a mensagem?')) { //Waits confirmations for deleting
                if (await deleteMessage(lastInsertId)) { //If message is deleted, redirects user to message grid
                    setTimeout(() => {
                        window.location.href = '../';
                    },300);
                }
            }
        });
        //Sets up update button
        saveButton.addEventListener('click',updateMessage);
        //Sets up duplicate button
        document.querySelector('.duplicate-button').addEventListener('click', duplicateMessage);;
    }else{
        //New Message
        saveButton.addEventListener('click', async () => {
            try {
                updateForm(await setMessage());
            } catch (error) {
                setFeedback(false,'Algo ocorreu ao atualizar o formulário');
                console.log(error);
            }            
        });
        console.log('Não atualizado pois ID não foi informado');
    }
}

setNavbar();
updateForm();
setSummernote();