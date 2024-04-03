import { getAllSmtps, setListOptions } from "../../functions.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const idInput = document.querySelector('input[name=id]');
let feedbackElement = document.querySelector('.feedback-element');

updateForm();

async function updateForm(messageId = null){
    let searchId;
    //Se foi informado um ID para atualizar o formulário
    if (messageId != null) {
        searchId = messageId;
    }else{
        //Se há um ID informado na URL da página
        if (id != null) {
            searchId = id;
        }else{
            searchId = null;
        }
    }

    let smtpList = await getAllSmtps('../../');
    setListOptions('#smtp-list',smtpList,'sender');
    
    if (searchId != null) {
        let messageRequest = await fetch(`../../back/getMessage.php?id=${searchId}`);
        messageRequest = await messageRequest.json();
        console.log(messageRequest);
        if (messageRequest.ok) {
            let messageData = messageRequest.obj;
            idInput.value = messageData.id;
            document.querySelector('input[name=name]').value = messageData.name;
            document.querySelector('input[name=smtp-id]').value = messageData.smtp_id;
            document.querySelector('input[name=subject]').value = messageData.subject;
            document.querySelector('textarea[name=content]').value = messageData.content;
            //Adicionando ação de deletar
            document.querySelector('#delete-button').addEventListener('click',async () => {
                if (confirm('Tem certeza que deseja deletar o registro atual?')) {
                    let deleteObj = {id: searchId};
                    let deleteRequest = await fetch(`../../back/deletemessage.php`, {
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(deleteObj)
                    });
                    deleteRequest = await deleteRequest.json();
                    feedbackElement.textContent = deleteRequest.message;
                    if (deleteRequest.ok) {
                        feedbackElement.style.color = 'green';
                        window.location.href = '../';
                    }else{
                        feedbackElement.style.color = 'red';
                    }
                }
            });
        }else{
            console.log(messageRequest.message, messageRequest.error);
        }
    }else{
        console.log('Não atualizado pois ID não foi informado');
    }
}

//Cria um novo ou edita
document.querySelector('#save-button').addEventListener('click', async () => {
    //Pega dados do e-mail
    let messageData = {
        name: document.querySelector('input[name=name]').value,
        smtp_id: document.querySelector('input[name=smtp-id]').value,
        subject: document.querySelector('input[name=subject]').value,
        content: document.querySelector('textarea[name=content]').value
    };
    if (Object.values(messageData).includes('')) {
        feedbackElement.textContent = "Preencha todas as informações!";
        feedbackElement.style.color = 'red';
    }else{
        //Declara o caminho da requisição
        let link;
        //Testa se a operação é de criação ou edição
        if (idInput.value == '') {
            link = 'setMessage.php';
        }else{
            link = 'updateMessage.php';
            messageData.id = idInput.value;
        }
        //Cria opções da requisição para o banco de dados
        let options = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(messageData)
        };
        //Faz a requisição para o banco de dados
        let response = await fetch(`../../back/${link}`,options);
        response = await response.json();
        console.log(response);
        feedbackElement.innerHTML = response.message;
        if (response.ok) {
            feedbackElement.style.color = 'green';
            if (idInput.value == '') {
                updateForm(response.id['LAST_INSERT_ID()']);
            }
        }else{
            feedbackElement.textContent += `: <i>${response.error}</i>`;
            feedbackElement.style.color = 'red';
        }
    }
});