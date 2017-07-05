"use strict";         

let PrivateKey;

let hideAll = () => {
    $("#home").hide();
    $("#encrypt").hide();
    $("#decrypt").hide();
};

let showHome = () => {
    hideAll();
    $("#home").show();
};

let showEncrypt = () => {
    hideAll();
    $("#encrypt").show();
};

let showDecrypt = () => {
    hideAll();
    if (!PrivateKey) {
        generateKey()
    }   
    $("#decrypt").show();    
};

$( document ).ready(function() {   

    switch (window.location.hash) {
        case "#home": 
            showHome();
            break;
        case "#encrypt": 
            showEncrypt();
            break;
        case "#decrypt": 
            showDecrypt();
            break;
        default: 
            showHome();
    }       

    $("header a").click(() => {
        showHome();
    });
    $("#home .encrypt").click(() => {
        showEncrypt();
    });
    $("#home .decrypt").click(() => {
        showDecrypt();
    });
});

let generateKey = () => {             
    let PassPhrase = generatePassPhrase();
    let Bits = 1024;  
    let RSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
    PrivateKey = RSAkey;
    let PublicKeyString = cryptico.publicKeyString(RSAkey); 
    $("#PublicKey").val(PublicKeyString);                            
};

let encryptClear = () => {
    $("#EPublicKey").val("");
    $("#Text").val("");
    $("#EncryptedText").val(""); 
    $(".encrypted-text").hide();
};

let encryptText = () => {
    let PublicKeyString = $("#EPublicKey").val();
    let PlainText = $("#Text").val();
    let b64PlainText = window.btoa(unescape(encodeURIComponent(PlainText)))

    let EncryptionResult = cryptico.encrypt(b64PlainText, PublicKeyString);
    let CipherText = EncryptionResult.cipher;
    $("#EncryptedText").val(CipherText); 
    $(".encrypted-text").show();
};

let decryptClear = () => {
    $("#EText").val("");
    $("#DecryptedText").val(""); 
    $(".decrypting").hide(); 
    $(".decrypted-text").hide();
};

let decryptText = () => {
    let CipherText = $("#EText").val();    
    let DecryptionResult = cryptico.decrypt(CipherText, PrivateKey);

    try {
        let PlainText = decodeURIComponent(escape(window.atob(DecryptionResult.plaintext)));
        $("#DecryptedText").val(PlainText); 
        $(".decrypted-text").show();
    } catch (error) {
        $('#myModal').modal();
    }    
    
};

let showDecrypting = () => {
    $(".decrypting").show();
};

let generatePassPhrase = () => {
    let length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

let copyToClipboard = (elem) => {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
          succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }

    return succeed;
};