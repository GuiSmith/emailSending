//Retorna o SMTP do ID informado
export async function getSmtp(id){
    try {
        let response = await fetch(`../back/getSmtp.php?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });
        response = await response.json();
        return response.obj;
    } catch (error) {
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

export async function getAllSmtps(relativePath){
    try {
        let response = await fetch(`${relativePath}back/getAllSmtps.php?`, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        });
        response = await response.json();
        return response.list;
    } catch (error) {
        console.error(`Ops, erro ao processar: ${error}`);
    }
}

//Creates a table 
export function createTable(list, headers, link = 'id'){
    let table = document.createElement('table');
    let header = document.createElement('tr');
    //Adiciona header na tabela
    table.appendChild(header);
    headers.forEach((headerItem) => {
        let th = document.createElement('th');
        th.textContent = headerItem;
        header.appendChild(th);
    });
    //Define cabeçalho da tabela, retirado pois o script abaixo define o nome do atributo como o cabeçalho
    /*Object.keys(list[0]).forEach((item) => {
        let cell = document.createElement('th');
        cell.textContent = item;
        header.appendChild(cell);
    });*/
    //Preenche tabela
    list.forEach((obj) => {
        let row = document.createElement('tr');
        row.addEventListener('click',() => {
            window.location.href = `new/index.html?id=${obj.id}`;
        });
        for (let item in obj){
            let td = document.createElement('td');
            td.textContent = obj[item];
            row.appendChild(td);
        }
        table.appendChild(row);
    });
    return table;
}

export async function getAllMessages(){
    
}

export function setNavbar(main){
    const links = `
        <a href="../">Home</a>
        <a href="../smtp/">SMTP</a>
        <a href="../messages/">Mensagens</a>
    `;
    const navElement = document.querySelector('.navbar');
    if (main) {
        navElement.innerHTML = links.replaceAll('../','');
    }else{
        navElement.innerHTML = links;
    }
}

export async function setListOptions(elementQuery, objList, textProperty){
    const datalist = document.querySelector(elementQuery);
    objList.forEach((obj) => {
        let option = document.createElement('option');
        option.value = obj.id;
        option.textContent = obj[textProperty];
        datalist.appendChild(option);
    });
}