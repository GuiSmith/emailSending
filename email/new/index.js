import {setNavbar,getURLid, getAllMessages, getAllSmtps, setEmail, getEmail, updateEmail, duplicateEmail, deleteEmail, fillInputs, setFeedback, setListOptions, setSummernote, getMessage, setSummernoteContent, getSmtp} from '../../functions.js';

const idInput = document.querySelector('input[name=id]'); 
let saveButton = document.querySelector('.save-button');

async function updateForm(lastInsertId = null){

    //If last insert ID wasn't informed, then gets the ID informed in the URL
    if (!lastInsertId) lastInsertId = getURLid();

    setListOptions('datalist[id=smtp-list]',await getAllSmtps(), 'sender');
    setListOptions('datalist[id=message-list]',await getAllMessages(), 'subject');

    //Fills sender when selecting a smtp
    let smtp = document.querySelector('[name=smtp_id]');
    smtp.addEventListener('change', async () => {
        let smtpData = await getSmtp(smtp.value);
        document.querySelector('[name=sender]').value = smtpData.sender;
    });

    //Fills subject and content when selecting a message
    let message = document.querySelector('[name=message_id]');
    message.addEventListener('change', async () => {
        let messageData = await getMessage(message.value);
        document.querySelector('[name=subject]').value = messageData.subject;
        setSummernoteContent(messageData.content);
    });
    
    //If last insert ID isn't null
    if (lastInsertId != null) {
        let emailData = await getEmail(lastInsertId); //Gets email with informed ID
        fillInputs(emailData,{dates:['created_at','updated_at']});
        //Sets up delete button
        document.querySelector('.delete-button').addEventListener('click', async () => {
            if (confirm('Tem certeza de que deseja deletar o e-mail?')) { //Waits confirmations for deleting
                if (await deleteEmail(lastInsertId)) { //If email is deleted, redirects user to message grid
                    setTimeout(() => {
                        window.location.href = '../';
                    },300);
                }
            }
        });
        //Sets up update button
        saveButton.addEventListener('click',updateEmail);
        //Sets up duplicate button
        document.querySelector('.duplicate-button').addEventListener('click', duplicateEmail);;
    }else{
        //New Message
        saveButton.addEventListener('click', async () => {
            try {
                updateForm(await setEmail());
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