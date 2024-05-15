let absolutePath = location.href.match(/(.*?\/emailsender\/)/)[1];
let feedbackElementClass = 'feedback-element';

//Sets summernote content
export function setSummernoteContent(string){
    $('#summernote').summernote('code', string);
}

//Fills elements' value with given object's properties
//Object property name and element name attribute must match
export async function fillInputs(obj, options = {}){
    for (let item in obj) {
        try {
            let input = document.querySelector(`[name=${item}]`);
            if (options.dates && options['dates'].includes(item)) {
                input.value=dateFormat(obj[item]);
            }else{
                if (input.id == 'summernote') {
                   await setSummernoteContent(obj[item]);
                }else{
                    input.value=obj[item];
                }
            }
        } catch (error) {
            
        }
    }
}

//Sets summernote's config
export function setSummernote(){
    $(document).ready(function() {
        $('#summernote').summernote({
            placeholder: 'Digite aqui...',
            height: 300,
            callbacks: {
            onInit: function() {
                    // Find the Summernote container and set its background color
                    $('.note-editor').css('background-color', 'white');
                }
            }
        });
    });  
}

//Returns an object of input values
function createObj(array){
    let obj = {};
    array.forEach((property) => {
        try {
            obj[property] = document.querySelector(`[name=${property}]`).value;
        } catch (error) {
            console.log(`Erro com a propriedade ${property}`);
            console.log(error);
        }
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

//Formats dates
function dateFormat(string){
    if (string == null) {
        return "";
    }else{
        let date = new Date(string);
        let day = String(date.getDate()).padStart(2, '0'); // Pad with '0' if less than 2 digits
        let dayWeek = date.getDay();
        let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        let year = date.getFullYear();
        let hour = String(date.getHours()).padStart(2, '0'); // Pad with '0' if less than 2 digits
        let minutes = String(date.getMinutes()).padStart(2, '0'); // Pad with '0' if less than 2 digits
        let seconds = String(date.getSeconds()).padStart(2, '0'); // Pad with '0' if less than 2 digits
        return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
    }
}

//Sets up navbar
export function setNavbar(){
    document.querySelector('.navbar').innerHTML = `
        <a href="${absolutePath}">Home</a>
        <a href="${absolutePath}smtp/">SMTP</a>
        <a href="${absolutePath}messages/">Mensagens</a>
        <a href="${absolutePath}email/">Enviar</a>
    `;
}

//Creates a table with given list and headers
export function createTable(list,headers,tableContainerQuery, options = {}){
    if (list) {
        let table = document.createElement('table');
        let header = document.createElement('tr');
        let tableContainer = document.querySelector(tableContainerQuery).appendChild(table);
        table.classList.add('grid-table');
        table.appendChild(header);
        //Defines header of the table as an array passed as an argument (headers).
        //Removed because headers are renamed when selecting in the database
        headers.forEach((headerItem) => {
            let th = document.createElement('th');
            th.textContent = headerItem;
            header.appendChild(th);
        });
        /*
        //Defines headers of the table as the property's name
        Object.keys(list[0]).forEach((item) => {
            let cell = document.createElement('th');
            cell.textContent = item;
            header.appendChild(cell);
        });
        */
        //Fills up table
        list.forEach((obj) => {
            let row = document.createElement('tr');
            row.id = obj.id; //Passing down the object's ID as the row ID, makes it easier to configure buttons based on selected rows
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
            if (!options.edit) { //If editing rows is allowed, configure the edit action
                row.addEventListener('dblclick',() => {
                    window.location.href = `new/index.html?id=${row.id}`; //Edit row if double clicked
                });
            }
            for (let item in obj){ //Creating the rows' elements
                let td = document.createElement('td');
                if (options.dates && options['dates'].includes(item)) {
                    td.textContent = dateFormat(obj[item]);
                }else{
                    td.textContent = (String(obj[item]).length > 24) ? (String(obj[item]).substring(0,24) + "...") : (String(obj[item]));
                }
                row.appendChild(td);
            }
            table.appendChild(row);
        });
    }else{
        console.log(`list given has no registers`);
        // console.log(list);
        setFeedback(false,'0 registros');
    }
}

//Buttons configuration
export function setButtons(obj){
    try {
        if (obj.edit) { //Allows editing
            document.querySelector('.edit-button').addEventListener('click', () => {
                let selectedRows = getSelectedRows();
                if (selectedRows.length > 1) { //Checks if more than one row is selected
                    setFeedback(false,'Não é possível editar diversos itens!');
                }else{
                    if (selectedRows.length == 0) {
                        setFeedback(false,'Selecione um item para editar!');
                    }else{
                        window.location.href = `new/index.html?id=${selectedRows[0].id}`;
                    }
                }
            });
        }
        if (obj.delete) { //Allows deleting
            document.querySelector('.delete-button').addEventListener('click', () => {
                let selectedRows = getSelectedRows();
                if (selectedRows.length == 0) {
                    setFeedback(false,'Selecione um item para deletar!');
                }else{
                    if (confirm('Tem certeza de que deseja deletar os itens selecionados?')) {
                        selectedRows.forEach((row) => {
                            obj.delete(row.id);
                        });
                    }
                    window.location.reload();
                }
            });
        }
        if (obj.duplicate) { //Allows duplicating
            document.querySelector('.duplicate-button').addEventListener('click', () => {
                let selectedRows = getSelectedRows();
                if (selectedRows.length > 1) { //Checks if more than one row is selected
                    setFeedback(false,'Não é possível duplicar diversos itens!');
                }else{
                    if (selectedRows.length == 0) {
                        setFeedback(false,'Selecione um item para duplicar!');
                    }else{
                        obj.duplicate(selectedRows[0].id);
                    }
                }
            });
        }
        
    } catch (error) {
        console.log(`Error configuring buttons ${error}`);
        console.log(obj);
    }
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
        // console.log(response.list);
        return response.list;
    } catch (error) {
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

//Deletes a Message
export async function deleteMessage(id){
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
    setFeedback(response.ok,response.message);
    return response.ok;
}

//Duplicates a message
export async function duplicateMessage(){
    let newId = await setMessage();
    if (newId != 0) { //If it's different from zero, then the duplicate was created;
        window.location.href = `index.html?id=${newId}`;
    }else{
        setFeedback(false,'Ocorreu um erro ao duplicar mensagem!');
    }
}

//Creates an email
export async function setEmail(){
//Gets message data
    let emailObj = createObj(['smtp_id','message_id','subject','content','address']);
    //Faz a requisição para o banco de dados
    let response = await fetch(`${absolutePath}back/email/setEmail.php`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(emailObj)
    });
    response = await response.json();
    setFeedback(response.ok,response.message);
    if (response.ok) {
        return response.id['LAST_INSERT_ID()'];
    }else{
        console.log(response);
        return 0;
    }
}

//Gets an email
export async function getEmail(id){
    let response = await fetch(`${absolutePath}back/email/getEmail.php?id=${id}`);
    response = await response.json();
    if (response.ok) {
        return response.obj;
    }else{
        console.log(response.message);
        setFeedback(response.ok,response.message);
        return null;
    }
}

//Deletes an email
export async function deleteEmail(id){
    let response = await fetch(`${absolutePath}back/email/deleteEmail.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:id})
    });
    response = await response.json();
    setFeedback(response.ok,response.message);
    return response.ok;
}

//Updates an email
export async function updateEmail(){
    //Gets message data
    let obj = createObj(['id','smtp_id','message_id','subject','content','address']);
    //Faz a requisição para o banco de dados
    let response = await fetch(`${absolutePath}back/email/updateEmail.php`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(obj)
    });
    response = await response.json();
    setFeedback(response.ok,response.message);
}

//Duplicates an email
export async function duplicateEmail(){
    let newId = await setEmail();
    if (newId != 0) { //If it's different from zero, then the duplicate was created;
        window.location.href = `index.html?id=${newId}`;
    }else{
        setFeedback(false,'Ocorreu um erro ao duplicar mensagem!');
    }
} 

//Gets all emails
export async function getAllEmails(){
    try {
        let response = await fetch(`${absolutePath}back/email/getAllEmails.php`, {
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