let absolutePath = location.href.match(/(.*?\/emailSender\/)/)[1];
let feedbackElementClass = 'feedback-element';

//Fills elements' value with given object's properties
//Object property name and element name attribute must match
export function fillInputs(obj){
    for (let item in obj) {
        try {
            document.querySelector(`[name=${item}]`).value=obj[item];    
        } catch (error) {
            
        }
    }
}

//Returns an object of input values
function createObj(array){
    let obj = {};
    array.forEach((property) => {
        obj[property] = document.querySelector(`[name=${property}]`).value;
    });
    return obj;
}

//Gets the ID given in the URL
export function getURLid(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

//Creates list of options for datalists
export async function setListOptions(elementQuery, objList, textProperty){
    const datalist = document.querySelector(elementQuery);
    objList.forEach((obj) => {
        let option = document.createElement('option');
        option.value = obj.id;
        option.textContent = obj[textProperty];
        datalist.appendChild(option);
    });
}

//Sets feedback based on a condition and displays a text
export function setFeedback(condition,string){
    try {
        let feedbackElement = document.querySelector(`.${feedbackElementClass}`);
        if (condition) {
            feedbackElement.style.color = 'green';
        }else{
            feedbackElement.style.color = 'red';
        }
        feedbackElement.textContent = string;   
    } catch (error) {
        console.log(error);
    }
}

//Sets up navbar
export function setNavbar(){
    document.querySelector('.navbar').innerHTML = `
        <a href="${absolutePath}">Home</a>
        <a href="${absolutePath}smtp/">SMTP</a>
        <a href="${absolutePath}messages/">Mensagens</a>
    `;
}

//Creates a table with given list and headers
export function createTable(list){
    let table = document.createElement('table');
    let header = document.createElement('tr');
    //Adiciona header na tabela
    table.appendChild(header);
    /*
    //Defines header of the table as an array passed as an argument (headers).
    //Removed because headers are renamed when selecting in the database
    headers.forEach((headerItem) => {
        let th = document.createElement('th');
        th.textContent = headerItem;
        header.appendChild(th);
    });
    */
    //Defines headers of the table as the property's name
    Object.keys(list[0]).forEach((item) => {
        let cell = document.createElement('th');
        cell.textContent = item;
        header.appendChild(cell);
    });
    //Fills up table
    list.forEach((obj) => {
        let row = document.createElement('tr');
        row.id = obj.ID;
        row.addEventListener('click', (event) => {
            if (Array.from(row.classList).includes('selected-row')) { //Checks if the row clicked is already selected
                if (event.shiftKey) {
                    row.classList.remove('selected-row'); //If it is, unselect it
                }else{
                    resetSelected();
                }
            }else{
                if (!event.shiftKey) { //Checks if shift key is being pressed
                    resetSelected();
                }
                row.classList.add('selected-row'); //If it isn't, select it
            }
        });
        row.addEventListener('dblclick',() => {
            window.location.href = `new/index.html?id=${row.id}`; //Edit row if double clicked
        });
        for (let item in obj){
            let td = document.createElement('td');
            td.textContent = (String(obj[item]).length > 24) ? (String(obj[item]).substring(0,24) + "...") : (String(obj[item]));
            // td.textContent = String(obj[item]).substring(0,24) + () ? () : ();
            row.appendChild(td);
        }
        table.appendChild(row);
    });
    //Format edit button
    try {
        document.querySelector('.edit-button').addEventListener('click', () => {
            let selectedRows = getSelectedRows();
            if (selectedRows.length > 1) { //Checks if more than one row is selected
                setFeedback(false,'Não é possível editar diversos itens!');
            }else{
                if (selectedRows.length == 0) {
                    setFeedback(false,'Selecione um item para editar!');
                }else{
                    window.location.href = `new/index.html?id=${selectedRows[0].id}`;
                    // console.log(selectedRows[0].id);
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
    return table;
}

//Reset selected rows
function resetSelected(){
    try {
        let selectedRows = getSelectedRows();
        selectedRows.forEach((selectedRow) => {
            selectedRow.classList.remove('selected-row');
        });
    } catch (error) {
        
    }
}

//Get selected rows
function getSelectedRows(){
    return Array.from(document.querySelectorAll('.selected-row'));
}

//SMTP

//Creates an SMTP
export async function setSmtp(){
    //Pega dados do smtp
    let smtpObj = createObj(['smtp','sender','password']);
    //Tests if there's an empty value
    if (Object.values(smtpObj).includes('')) {
        setFeedback(false,'Preencha todas as informações!');
    }else{
        //Faz a requisição para o banco de dados
        let response = await fetch(`${absolutePath}back/smtp/setSmtp.php`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(smtpObj)
        });
        response = await response.json();
        setFeedback(response.ok,response.message);
        if (response.ok) {
            return response.id['LAST_INSERT_ID()'];
        }else{
            return 0;
        }
    }
}

//Update SMTP
export async function updateSmtp(){
    //Pega dados do smtp
    let smtpObj = createObj(['id','smtp','sender','password']);
    //Tests if there's an empty value
    if (Object.values(smtpObj).includes('')) {
        setFeedback(false,'Preencha todas as informações!');
    }else{
        //Faz a requisição para o banco de dados
        let response = await fetch(`${absolutePath}back/smtp/updateSmtp.php`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(smtpObj)
        });
        response = await response.json();
        setFeedback(response.ok,response.message);
    }
}

//Gets an SMTP
export async function getSmtp(id){
    try {
        let response = await fetch(`${absolutePath}/back/smtp/getSmtp.php?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });
        response = await response.json();
        return response.obj;
    } catch (error) {
        setFeedback(response.ok,response.message);
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

//Gets all SMTPs
export async function getAllSmtps(){
    try {
        let response = await fetch(`${absolutePath}back/smtp/getAllSmtps.php?`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });
        response = await response.json();
        // console.log(response.list);
        return response.list;
    } catch (error) {
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

//Deletes an SMTP
export async function deleteSmtp(id){
    if (confirm('Tem certeza de que deseja deletar o SMTP?')) {
        let obj = {
            id: id
        };
        let response = await fetch(`${absolutePath}back/smtp/deleteSmtp.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        response = await response.json();
        setFeedback(response.ok,response.message);
        setTimeout(() => {
            //window.location.href = '../';
        },300);  
    }
}

//Message

//Sets message
export async function setMessage(){
    //Gets message data
    let messageObj = createObj(['name','smtp_id','subject','content']);
    //Tests if there's an empty value
    if (Object.values(messageObj).includes('')) {
        setFeedback(false,'Preencha todas as informações!');
    }else{
        //Faz a requisição para o banco de dados
        let response = await fetch(`${absolutePath}back/message/setMessage.php`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(messageObj)
        });
        response = await response.json();
        setFeedback(response.ok,response.message);
        if (response.ok) {
            return response.id['LAST_INSERT_ID()'];
        }else{
            return 0;
        }
    }   
}

//Updates message
export async function updateMessage(){
    //Gets message data
    let messageObj = createObj(['id','name','smtp_id','subject','content']);
    //Tests if there's an empty value
    if (Object.values(messageObj).includes('')) {
        setFeedback(false,'Preencha todas as informações!');
    }else{
        //Faz a requisição para o banco de dados
        let response = await fetch(`${absolutePath}back/message/updateMessage.php`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(messageObj)
        });
        response = await response.json();
        setFeedback(response.ok,response.message);
    }   
}

//Gets the message
export async function getMessage(id){
    let messageRequest = await fetch(`${absolutePath}back/message/getMessage.php?id=${id}`);
    messageRequest = await messageRequest.json();
    if (messageRequest.ok) {
        return messageRequest.obj;
    }else{
        console.log(messageRequest.message);
        setFeedback(messageRequest.ok,messageRequest.message);
        return null;
    }
}

//Gets all Messages
export async function getAllMessages(){
    try {
        let response = await fetch(`${absolutePath}back/message/getAllMessages.php`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });
        response = await response.json();
        console.log(response.list);
        return response.list;
    } catch (error) {
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

//Deletes an Message
export async function deleteMessage(id){
    if (confirm('Tem certeza de que deseja deletar a mensagem?')) {
        let obj = {
            id: id
        };
        let response = await fetch(`${absolutePath}back/message/deleteMessage.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        response = await response.json();
        setFeedback(response.ok,'Mensagem deletada com sucesso');
        setTimeout(() => {
            window.location.href = '../';
        },300);  
    }
}