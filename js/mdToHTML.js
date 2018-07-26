
var files       = null,
    direction   = 'rtl';

function onChange(event) {
    files = event.target.files;
    
    // More than one file has been selected
    if(files.length > 1){
        // document.getElementById('manualContent').innerHTML = '<bdi>شما ' +
        // files.length + ' فایل را انتخاب کرده‌اید. برای تبدیل همزمان همه آنها به فرمت HTML، دکمه ذخیره را بفشارید.</bdi>';
        document.getElementById('manualContent').innerHTML = '<bdi>You have selected ' +
        files.length + ' files. To convert all of them to HTML, click on the save button.</bdi>';
        return;
    }

    // One file is selected
    readTheFile();
  }

function readTheFile() {
    if(files == null || files.length < 1){
        alert('You have not selevted any file.');
        return;
    }

    let file = files[0],
        reader = new FileReader();

    reader.onload = function(event) {
        document.getElementById('manualContent').innerHTML = '';
        
        let manualContent = document.getElementById('manualContent'),
            content       = injectToHtml(event.target.result).string;
        
            
        document.getElementById('manualContent').innerHTML = content;
        document.getElementById('manual').className = direction;
    };
    reader.readAsText(file);
}

function refresh() {
    if(files.length > 1)
        return; // There is no preview for more than one file
    
    readTheFile();
}

function injectToHtml(response) {
    response = marked(response, {highlight: function (code) {
                                        return hljs.highlightAuto(code).value;
                                    }
                                });
    
    let text = document.createElement('div');
    text.id = "manualContent";
    let manual = document.createElement('div');
    manual.id = "manual";
    manual.className = direction;
    manual.innerHTML = response;

    let titles = manual.getElementsByTagName('h1'),
        content = addLinkToTitle(manual);

    text.appendChild(manual);

    return {
              element: content,
              string: text.innerHTML
           };
}

function addLinkToTitle(text) {
    var x = text.getElementsByTagName('h1');
    for (var i = 0; i < x.length; i++){
        x[i].id = "part"+ i;
        x[i].classList.add('manual-anchor');
    }
    return text;
}

function changeDirection() {
    direction = 
        (document.getElementById('ltr-checkbox').checked) ? 'ltr' : 'rtl';

    document.getElementById('manual').className = direction;
}

function saveTheFile(file) {
    let reader = new FileReader();
    reader.onloadend = function(event) {
        if (event.target.readyState == FileReader.DONE) {            
            let content = injectToHtml(event.target.result).string;
            
            if(content == '' || content == null){
                alert('An error happened');
                return;
            }

            let theName = file.name.slice(0, -3), // fileName.slice(0, -3) removes last 3 chars ('.md')
                str     = '<!DOCTYPE html>\
                            <html>\
                                <head>\
                                    <meta charset="UTF-8">\
                                    <title>' + theName + '</title>\
                                    <link rel="stylesheet" href="./style/style.css">\
                                    <link rel="stylesheet" href="./style/kimbie.dark.css">\
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
                                    <style>' +
                                        inlineStyle +
                                    '</style>\
                                </head>\
                                <body>' +
                                    content + 
                                '</body>\
                            </html>',
                blob    = new Blob([str], {type: "text/plain;charset=utf-8"});

            saveAs(blob, theName+".html");
        }
    };
  
    reader.readAsText(file);
}


function saveAsHTML() {

    if(files == null || files.length == null || files.length < 1){
        alert('You have not selevted any file.');
        return;
    }

    for (let file of files) {
        saveTheFile(file);
    }
    
}


// To make the result html file needless of external css stylesheet files.
var inlineStyle = "*,body{margin:0;padding:0}#manual,*{font-family:Vazir}*{box-sizing:border-box}html{font-size:14px}#manual p,.rtl ol li,.rtl ul li{font-size:1.1rem}body{direction:rtl;color:#24292e}.ltr{direction:ltr!important}.rtl{direction:rtl!important}@media screen and (max-width:600px){body{padding:10px}}@media screen and (min-width:601px){body{padding:50px}}@font-face{font-family:Vazir;src:url(fonts/Vazir.woff)}@font-face{font-family:DejaVuSansMono;src:url(fonts/DejaVuSansMono.ttf)}#manual{width:100%;outline-offset:-22px;padding:10px 15px 65px;line-height:3rem}code,code span,pre code span,ul li pre code{font-family:DejaVuSansMono,Menlo,'Liberation Mono',Consolas,'DejaVu Sans Mono','Ubuntu Mono','Courier New','andale mono','lucida console',monospace!important}#manual p{text-align:justify;padding:.5rem}#manual img{margin:0 auto;display:block;max-width:90%}.rtl ul li{margin-right:3rem!important}.rtl ol li{margin-right:3rem}.ltr ol li,.ltr ul li{font-size:1.1rem;margin-left:3rem}#manual h1,#manual h2,#manual h3{padding:12px;text-shadow:none}#manual h1{padding-top:60px;color:rgba(22,19,19,.8);font-weight:900;font-size:2.1rem}#manual h2{font-weight:500;color:rgba(22,19,19,.6);font-size:1.8rem}#manual h3{font-weight:300;color:rgba(22,19,19,.4);font-size:1.5rem}#manual h4,#manual h5{font-weight:200;color:rgba(22,19,19,.4)}#manual h4{font-size:1.3rem}#manual h5{font-size:1.2rem}@media screen and (min-width:48rem){#list{width:20%}#content{width:100%}}@media screen and (min-width:80rem){#list.none{display:inline-block}#content{width:80%}}@media print{#list{display:none}#content{display:block;width:100%;margin:0 auto}#content li,#content p{font-size:1rem}}.manual-anchor{top:45px}#manualContent{max-width:1448px;margin:0 auto}.manual-link-icon{color:#8f8f8f}.manual-link-icon:hover{color:#000}code,ul li pre code{white-space:pre;word-wrap:normal;padding:3px 7px;color:#24292e;background-color:rgba(27,31,35,.05);border-radius:3px;font-size:1rem}#manual ul li pre,.manual ul li pre,pre{margin:0;direction:ltr!important}#manual ul li pre code,.manual ul li pre code,pre code{direction:ltr!important;line-height:1.45;padding:1em 0 .5em 3em;position:relative;display:block;overflow-x:auto;overflow-y:auto}a{text-decoration:none}.title{float:left;color:#ccc}#manualContent{padding-top:60px}.elements{padding:12px;position:fixed;top:0;right:0;left:0;background-color:#444;height:50px;z-index:1}.input{color:#fff}#savebutton,input{font-size:15px}#savebutton{padding:0 7px!important}#ltr-checkbox-description{margin:3px 15px!important;color:#fff}.button{background-color:#fff;color:#444;font-size:1.6rem;display:inline-block;text-align:center;line-height:2.1rem;border-radius:2px}.button:hover{cursor:pointer;background-color:#eee}#refresh-button{width:2.2rem;vertical-align:middle}@media print{.no-print,.no-print *{display:none!important}}.hljs-comment,.hljs-quote{color:#99ac5b}.hljs-meta,.hljs-name,.hljs-regexp,.hljs-selector-class,.hljs-selector-id,.hljs-tag,.hljs-template-variable,.hljs-variable{color:#dc3958}.hljs-built_in,.hljs-builtin-name,.hljs-deletion,.hljs-link,.hljs-literal,.hljs-number,.hljs-params,.hljs-type{color:#f79a32}.hljs-attribute,.hljs-section,.hljs-title{color:#f06431}.hljs-addition,.hljs-bullet,.hljs-string,.hljs-symbol{color:#9c9}.hljs-function,.hljs-keyword,.hljs-selector-tag{color:#98676a}.hljs{display:block;overflow-x:auto;background:#221a0f;color:#d3af86}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}";