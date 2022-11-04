function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        alert
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        console.log("CORS not supported");
        alert("CORS not supported");
        xhr = null;
    }
    return xhr;
}

function request(str) {
    var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

    if(!xhr){
        console.log("XHR issue");
        return;
    }

    xhr.onload = function (){
        var results = xhr.responseText;
        console.log(results);
    }

    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(str);
}

function getUserList(){
    const xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:GetUserListRequest/>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';

    function userListText(response) {
        let result = "";
        for(let i=0; i<response.getElementsByTagName("ns2:userList").length; i++){
            result = result + "<br>" + "username: " + response.getElementsByTagName("ns2:username")[i].innerHTML+
                "  email: " + response.getElementsByTagName("ns2:email")[i].innerHTML +
                "  gender: " + response.getElementsByTagName("ns2:gender")[i].innerHTML +
                "  user type: " + response.getElementsByTagName("ns2:usertype")[i].innerHTML +
                "  address: " + response.getElementsByTagName("ns2:address")[i].innerHTML;
        }
        return result;
    }

    function getUserListRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            document.getElementById("userList").innerHTML = userListText(results);

        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    getUserListRequest(xmlRequest);
}


function removeUser(){
    let username = document.getElementById("username").value;
    let xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:getUsernameRequest>' +
        '         <gs:username>'+username+'</gs:username>' +
        '      </gs:getUsernameRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';

    function removeUserRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            if(results.getElementsByTagName("ns2:valid")[0].innerHTML==="true"){
                const removeUserRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
                    '   <soapenv:Header/>' +
                    '   <soapenv:Body>' +
                    '      <gs:RemoveUserRequest>' +
                    '         <gs:username>'+username+'</gs:username>' +
                    '      </gs:RemoveUserRequest>' +
                    '   </soapenv:Body>' +
                    '</soapenv:Envelope>';
                request(removeUserRequest);
            }else{
                window.alert("User with username: "+username+" cannot found")
            }
        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    removeUserRequest(xmlRequest);
}
function addUser(){
    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("pass").value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let gender = document.getElementById("gender").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;
    let birthday = document.getElementById("birthday").value;
    let usertype = document.getElementById("usertype").value;
    const addUserRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:AddUserRequest>' +
        '         <gs:username>'+username+'</gs:username>' +
        '         <gs:password>'+password+'</gs:password>' +
        '         <gs:name>'+firstname+'</gs:name>' +
        '         <gs:surname>'+lastname+'</gs:surname>' +
        '         <gs:usertype>'+usertype+'</gs:usertype>' +
        '         <gs:email>'+email+'</gs:email>' +
        '         <gs:address>'+address+'</gs:address>' +
        '         <gs:birthdate>'+birthday+'</gs:birthdate>' +
        '         <gs:gender>'+gender+'</gs:gender>' +
        '         <gs:isActive>'+'false'+'</gs:isActive>' +
        '      </gs:AddUserRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    request(addUserRequest);
}

function sendMessage(username){
    let to = document.getElementById("to").value;
    let xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:getUsernameRequest>' +
        '         <gs:username>'+to+'</gs:username>' +
        '      </gs:getUsernameRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';

    function sendMessageRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            if(results.getElementsByTagName("ns2:valid")[0].innerHTML==="true"){
                let from = sessionStorage.getItem("username");
                let message = document.getElementById("message").value;
                const sendMessageRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
                    '   <soapenv:Header/>' +
                    '   <soapenv:Body>' +
                    '      <gs:SendMessageRequest>' +
                    '         <gs:to>'+to+'</gs:to>' +
                    '         <gs:from>'+from+'</gs:from>' +
                    '         <gs:body>'+message+'</gs:body>' +
                    '      </gs:SendMessageRequest>' +
                    '   </soapenv:Body>' +
                    '</soapenv:Envelope>';
                request(sendMessageRequest);
            }else{
                window.alert("User with username: "+to+" cannot found")
            }
        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    sendMessageRequest(xmlRequest);
}

function getInbox(){
    let username = sessionStorage.getItem("username");
    const xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:GetInboxRequest>' +
        '         <gs:to>'+username+'</gs:to>' +
        '      </gs:GetInboxRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    function getInboxRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            document.getElementById("myInbox").innerHTML = makeMessageBoxText(results,"ns2:inbox","ns2:from");
        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    getInboxRequest(xmlRequest);
}

function getOutbox(){
    let username = sessionStorage.getItem("username");
    const xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:GetOutboxRequest>' +
        '         <gs:from>'+username+'</gs:from>' +
        '      </gs:GetOutboxRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    function getOutboxRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            document.getElementById("myOutbox").innerHTML = makeMessageBoxText(results,"ns2:outbox","ns2:to");
        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    getOutboxRequest(xmlRequest);
}

function makeMessageBoxText(inboxList,outerTagName,innerTagName){
    let result = "";
    for(let i=0; i<inboxList.getElementsByTagName(outerTagName).length; i++){
        result = result +"<br>"+inboxList.getElementsByTagName(innerTagName)[i].innerHTML+": "+
            inboxList.getElementsByTagName("ns2:messageBody")[i].innerHTML;
    }
    return result;
}

function  updatePassword(){
    const xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:UpdatePasswordRequest>' +
        '         <gs:username>'+window.sessionStorage.getItem("username")+'</gs:username>' +
        '         <gs:password>'+document.getElementById("newPassword").value+'</gs:password>' +
        '      </gs:UpdatePasswordRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    request(xmlRequest);
}

function blockDirectAccess(){
    if(window.sessionStorage.length===0) window.location.replace("login.html");
    else return true;
}

function logOutIfNotActive(){
    let currentUsername = window.sessionStorage.getItem("username");
    let xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:getUsernameRequest>' +
        '         <gs:username>'+currentUsername+'</gs:username>' +
        '      </gs:getUsernameRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';

    function checkUserRequest(str) {
        var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

        if(!xhr){
            console.log("XHR issue");
            return;
        }

        xhr.onload = function (){
            var results = xhr.responseXML;
            console.log(results);
            if(results.getElementsByTagName("ns2:valid")[0].innerHTML==="false"){
                window.alert("This user is removed");
                window.location.replace("login.html");
            }
        }

        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.send(str);
    }
    checkUserRequest(xmlRequest);
}

function logout(){
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.location.replace("login.html");
}