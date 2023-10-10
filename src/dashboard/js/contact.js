

/*
whurl variable should be equal to your webhooks link!


On discord you create a webhook by going to 
the server settings and from there to the 
integrations tab, then click on webhooks and 
press new webhook. Then copy the link and paste it 
in the whurl variable.

Make sure to hide this link using https://javascriptobfuscator.com/Javascript-Obfuscator.aspx
if someone takes this link they can send messages to you with this webhook so make sure to
hide this link!
*/
whurl = "https://discord.com/api/webhooks/1161218138214502461/GJacSY8_EeJyqvX7P4dJZ4LbXa_59wMnvf5yRjS46vxDBVtqZx5hndBExosWo8uHnc89"
var str= "";
var name= "";
function f1(){
    name = document.getElementById("NameInput").value;
    str = document.getElementById("InputField").value;
    console.log(document.getElementById("InputField").value)
}
function send(){
    f1();
    const currentTime = new Date().toISOString();
    const embed = {
        "embeds": [{
            "title": "Someone  contact you",
            "description": str, // The content of your message
            "color": 16711680, // The color of the embed (in decimal format)
            "author": {
                "name": name, // The name of the author
            },
            "timestamp": currentTime
        }]
    };

    console.log(embed);

    const msg = {
        "content": '<@1153881675659477052>'
    };
    console.log(msg)
    if(str == ""){
        document.getElementById("Message1").style.opacity = 1; 
        setTimeout(function(){
            document.getElementById("Message1").style.opacity = 0;
        }, 4000)
        console.log("ERROR")
        return;
    }
    try{

        fetch(whurl + "?wait=true", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify(embed)
        });

        fetch(whurl + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(msg)});
        document.getElementById("InputField").value = "";
        document.getElementById("MessageSent").style.opacity = 1;
        setTimeout(function(){
            document.getElementById("MessageSent").style.opacity = 0;
        }, 4000)

    } catch(e){
        document.getElementById("MessageFailed").style.opacity = 1;  
        
        setTimeout(function(){
            document.getElementById("MessageFailed").style.opacity = 0;
        }, 4000)
    }

} 