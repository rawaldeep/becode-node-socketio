$(function(){
    let socket = io.connect();
    let messageForm = $('#messageForm');
    let userForm = $('#userForm')
    let message = $('#message');
    let chat = $('#chat');
    let messageArea = $('#messageArea');
    let userFormArea = $('#userFormArea');
    let users = $('#users');
    let username = $('#username');
    let type = $('#typing');


    $(message).keyup(function (e) {
        if (e.which === 13 ) {
            if (!event.shiftKey) {
                $(messageForm).submit();
                return false; }
        }
      });
      $(username).keyup(function (e) {
        if (e.which === 13 ) {
            if (!event.shiftKey) {
                $(userForm).submit();
                return false; }
        }
      });
    messageForm.submit( function(event){
        event.preventDefault();
        socket.emit('send message', message.val());
        message.val('');
    });
    
    socket.on('new message', (data)=>{
        chat.append(`<div class="well"><strong>${data.user}</strong> ${data.msg}</div>`)
            $(chat).animate({scrollTop: $(chat).prop("scrollHeight")}, 500);
    });
    userForm.submit( function(event){
        event.preventDefault();
        if(username.val()){
        socket.emit('new user', username.val(), (data)=>{
            if(data){
            userFormArea.hide();
            messageArea.show();
            messageArea.css("display","flex");
            }
        });
        username.val('');
    } else{
        let randomName = '_' + Math.random().toString(36).substr(2, 9);
        alert('you are now '+randomName);
        username.val(randomName);
        socket.emit('new user', username.val(), (data)=>{
            if(data){
            userFormArea.hide();
            messageArea.show();
            messageArea.css("display","flex");
            }
        });
        username.val('');
    }
    });

    socket.on('get users',(data)=>{
        let html = '';
        for(let i = 0; i < data.length; i++){
            html += `<li class="list-group-item">${data[i]}</li>`;
        }
        users.html(html);
    });
    let typing = false;
    let timeout = undefined;
    function timeoutFunction(){
        typing = false;
        type.html(``)
      }
        
      $(message).keyup(function (e) {
            socket.on('typing', (data)=>{
            if (e.which === 13 ) {
                if (!event.shiftKey) {
                type.html( ``);
                clearTimeout(timeout);
                timeout = setTimeout(timeoutFunction, 3000);
                }}else{
                    typing = true;
                    timeout = setTimeout(timeoutFunction, 3000);
                    if(data.user === undefined){
                        type.html(`random user is typing`)
                    }else{
                    type.html(`${data.user} is typing`)
                    }
                }
            
            })
        });
    
})