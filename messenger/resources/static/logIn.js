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

function validate(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const logInRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:LogInRequest>' +
        '         <gs:username>'+username+'</gs:username>' +
        '         <gs:password>'+password+'</gs:password>' +
        '      </gs:LogInRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

    if(!xhr){
        console.log("XHR issue");
        return;
    }

    xhr.onload = function (){
        var results = xhr.responseXML;
        console.log(results);
        if(results.getElementsByTagName("ns2:valid")[0].innerHTML === "true"){
            window.sessionStorage.setItem("username",username);
            window.sessionStorage.setItem("login","true");
            if(results.getElementsByTagName("ns2:admin")[0].innerHTML === "true"){
                window.sessionStorage.setItem("isAdmin","true");
                window.location.replace("mainAdmin.html");
            }else{
                window.sessionStorage.setItem("isAdmin","false");
                window.location.replace("mainUser.html");
            }
        }else{
            window.sessionStorage.setItem("login","false");
            window.alert("Wrong username or password!!!");
        }
    }

    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(logInRequest);

}

function indexPage(){
    window.location.replace("index.html");
}
/*
async function isAdmin(username){
    const isAdminRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">\n' +
        '   <soapenv:Header/>' +
        '   <soapenv:Body>' +
        '      <gs:IsAdminRequest>' +
        '         <gs:username>'+username+'</gs:username>' +
        '      </gs:IsAdminRequest>' +
        '   </soapenv:Body>' +
        '</soapenv:Envelope>';
    var xhr = createCORSRequest("POST", "http://localhost:8080/ws");

    if(!xhr){
        console.log("XHR issue");
        return;
    }

    xhr.onload = function (){
        var results = xhr.responseXML;
        console.log(results);
        return results.includes("true");
    }

    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.send(isAdminRequest);
}

 */