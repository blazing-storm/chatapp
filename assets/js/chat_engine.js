class ChatEngine {
    constructor(chatBoxId, userEmail, userName, userAvatar) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;
        this.userAvatar = userAvatar;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function() {
            console.log('connection established using sockets...');
        });

        self.socket.emit('join_room',  {
            user_email: self.userEmail,
            chatroom: 'common-room'
        });

        self.socket.on('user_joined', function(data) {
            console.log('a user joined', data);
        });
        
        $('#send-message').click(function() {
            let msg = $('#chat-message-input').val();

            if(msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    user_avatar: self.userAvatar,
                    chatroom: 'common-room'
                });
                $('#chat-message-input').val('');
            }
        });

        self.socket.on('receive_message', function(data) {
            console.log('message received', data);

            let newMessage = $('<div>');
            
            var messageType = 'self-message';

            let message = $('<div>');
            message.addClass('message');

            if(data.user_email != self.userEmail) {
                messageType = 'other-message';
                let img = $('<img>', {
                    'src': data.user_avatar,
                    'alt': data.user_name
                });
                img.addClass('circle avatar chat-avatar');

                newMessage.append(img);

                message.append($('<sub>', {
                    'html': data.user_name
                }));
            }

            message.append($('<span>', {
                'html': data.message
            }));

            newMessage.append(message);
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').scrollTop($('#chat-messages-list')[0].scrollHeight);
        });
    }
}