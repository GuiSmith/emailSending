const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const idInput = document.querySelector('input[name=id]');
let feedbackElement = document.querySelector('.feedback-element');

updateForm();

async function updateForm(smtpId = null){
    let searchId;
    //Se foi informado um ID para atualizar o formulário
    if (smtpId != null) {
        searchId = smtpId;
    }else{
        //Se há um ID informado na URL da página
        if (id != null) {
            searchId = id;
        }else{
            searchId = null;
        }
    }
    
    if (searchId != null) {
        let smtpRequest = await fetch(`../../back/getSmtp.php?id=${searchId}`);
        smtpRequest = await smtpRequest.json();
        console.log(smtpRequest);
        if (smtpRequest.ok) {
            let smtpData = smtpRequest.obj;
            idInput.value = smtpData.id;
            document.querySelector('input[name=smtp]').value = smtpData.smtp;
            document.querySelector('input[name=sender]').value = smtpData.sender;
            document.querySelector('input[name=password]').value = smtpData.pass;
            //Adicionando ação de deletar
            document.querySelector('#delete-button').addEventListener('click',async () => {
                if (confirm('Tem certeza que deseja deletar o registro atual?')) {
                    let deleteObj = {id: searchId};
                    let deleteRequest = await fetch(`../../back/deleteSmtp.php`, {
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
            console.log(smtpRequest.message, smtpRequest.error);
        }
    }else{
        console.log('Não atualizado pois ID não foi informado');
    }
}

//Cria um novo ou edita
document.querySelector('#save-button').addEventListener('click', async () => {
    //Pega dados do e-mail
    emailData = {
        smtp: document.querySelector('input[name=smtp]').value,
        password: document.querySelector('input[name=password]').value,
        sender: document.querySelector('input[name=sender]').value
    };
    if (Object.values(emailData).includes('')) {
        feedbackElement.textContent = "Preencha todas as informações!";
        feedbackElement.style.color = 'red';
    }else{
        //Declara o caminho da requisição
        let link;
        //Testa se a operação é de criação ou edição
        if (idInput.value == '') {
            link = 'back/setSmtp.php';
        }else{
            link = 'back/updateSmtp.php';
            emailData.id = idInput.value;
        }
        //Cria opções da requisição para o banco de dados
        options = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(emailData)
        };
        //Faz a requisição para o banco de dados
        let response = await fetch(`../../${link}`,options);
        response = await response.json();
        console.log(response);
        feedbackElement.textContent = response.message;
        if (response.ok) {
            feedbackElement.style.color = 'green';
            if (idInput.value == '') {
                updateForm(response.id['LAST_INSERT_ID()']);
            }
        }else{
            feedbackElement.style.color = 'red';
        }
    }
});