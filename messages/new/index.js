import {setNavbar,getURLid, getMessage, setMessage, updateMessage, deleteMessage, fillInputs, setFeedback, setListOptions, getAllSmtps} from '../../functions.js';
const idInput = document.querySelector('input[name=id]'); 
let saveButton = document.querySelector('#save-button');

setNavbar();
updateForm();

async function updateForm(lastInsertId = null){

    //If last insert ID wasn't informed, then gets the ID informed in the URL
    if (!lastInsertId) lastInsertId = getURLid();

    setListOptions('datalist[id=smtp-list]',await getAllSmtps(), 'sender');
    
    //If last insert ID isn't null
    if (lastInsertId != null) {
        let messageData = await getMessage(lastInsertId); //Gets smtp with informed ID
        fillInputs(messageData);
        //Sets up delete button
        document.querySelector('#delete-button').addEventListener('click', async () => {await deleteMessage(lastInsertId)});
        //Sets up update button
        saveButton.addEventListener('click',updateMessage);

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