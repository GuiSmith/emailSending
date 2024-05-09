import {setNavbar,getURLid, getSmtp, setSmtp, updateSmtp, fillInputs, deleteSmtp, setFeedback} from '../../functions.js';
const idInput = document.querySelector('input[name=id]'); 
let saveButton = document.querySelector('#save-button');

setNavbar();
updateForm();

async function updateForm(lastInsertId = null){

    //If last insert ID wasn't informed, then gets the ID informed in the URL
    if (!lastInsertId) lastInsertId = getURLid();
    
    //If last insert ID isn't null
    if (lastInsertId != null) {
        let smtpData = await getSmtp(lastInsertId); //Gets smtp with informed ID
        fillInputs(smtpData,{dates:['created_at']});
        //Sets up delete button
        document.querySelector('#delete-button').addEventListener('click', async () => {await deleteSmtp(lastInsertId)});
        //Sets up update button
        saveButton.addEventListener('click',updateSmtp);

    }else{
        //New Smtp
        saveButton.addEventListener('click', async () => {
            try {
                updateForm(await setSmtp());
            } catch (error) {
                setFeedback(false,'Algo ocorreu ao atualizar o formulário');
                console.log(error);
            }            
        });
        console.log('Não atualizado pois ID não foi informado');
    }
}