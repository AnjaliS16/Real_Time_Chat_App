const socket= io();
const messages = document.querySelector('.messages')
let rendered = false
const groups = document.querySelector('.show-groups')
window.addEventListener('load', renderElemets)

var curr_group = null
var remove = null;
const users = document.querySelector('.show-users')
const displayUsers = document.querySelector('.display-users')
var otherUsers = null
async function renderElemets() {
    try {

        const urlParams = new URLSearchParams(window.location.search);

        const id = urlParams.get('id');
        if (id) {
            console.log("id present")
            const group = await axios.get(`http://localhost:3006/group/join-group/${id}`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            })
            const mess = 'hello from whatsapp'
            showGroups(group.data.group)

        }
        const res = await axios.get('http://localhost:3006/group/get-groups', {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        console.log(res)
        res.data.forEach(group => {

            if (group.id != id)
                showGroups(group)


        })


    } catch (e) {
        console.log(e)

    }
}

function scrollToBottom() {
    const element = document.querySelector('.messages')
    element.scrollTop = element.scrollHeight
}

async function showGroups(group) {
    const div = document.createElement('div')

    div.textContent = group.name
    div.className = 'group-items'
    div.id = group.id

    const span = document.createElement('span')
    span.textContent = '+'
    span.className = 'plus';
    div.appendChild(span)

    span.onclick = (e) => {

        e.stopPropagation()
        const link = `http://127.0.0.1:5500/?id=${group.id}`

        navigator.clipboard.writeText(link)
        console.log('clicked')
    }

    div.onclick = async () => {
        curr_group = group
        if (curr_group.member.admin) {
            document.getElementById('add-user-toggle-btn').classList.remove('hide')
        } else {
            document.getElementById('add-user-toggle-btn').classList.add('hide')
        }
        document.querySelector('.header').classList.remove('hide')
        document.querySelector('.messages').classList.remove('hide')
        document.querySelector('.send-messages').classList.remove('hide')
        document.querySelector('.show-users').classList.add('hide')

       
        await showGroupMessages()
        

        //setInterval(showMessages, 1000);

        

        
       
       

    }

    groups.appendChild(div)
    return group;
}




function showMessage(data, users) {
    const id = curr_group.member.id
    const div = document.createElement('div')
    console.log(typeof users)
    if (id == data.memberId) {
        div.className = 'u-message'
        div.textContent = "You: " + data.message

    }

    else {
        const user = users.find(user => data.memberId == user.member.id)
        console.log(user)
        if (user) {
            div.className = 'o-message'
            div.textContent = user.name + ": " + data.message
            console.log(data.message);

        }
        else {

            return;
        }


    }
    div.style.marginBottom = '1em';

    messages.appendChild(div);

}


socket.on("message", (data)=>{
    let message = data.message;
    let users = data.users;
    console.log(message,users)
    console.log(message.type)
    if(message.type == 'text'){

    showMessage(message,users)
    }

    else{
        showFiles(message,users)
    }
}
);


async function handle(event) {
    
    event.preventDefault();
    const groupId = curr_group.id;
  
    try {
        const data = {
            message: event.target.message.value,
            groupId,

        };
        let final_users = JSON.parse(localStorage.getItem(`user-${curr_group.id}`)) || []
        let final_messages = JSON.parse(localStorage.getItem(`message-${curr_group.id}`)) || []
      
      

        const res = await axios.post('http://localhost:3006/message/add-message', data, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        });

           console.log(res.data.type,'from messages function')
       

        var message=res.data;

        
            socket.emit('user-message', { message: message, users: final_users });
          
    
        console.log(res);
        var div = document.createElement('div');
        div.className = 'u-message';
        div.textContent = "You: " + data.message;
        messages.appendChild(div);
        event.target.message.value = ''
        scrollToBottom();


    } catch (e) {
        console.log(e);
    }
}


document.getElementById('create-new-group').addEventListener('submit', createNewGroup)

async function createNewGroup(e) {
    try {
        e.preventDefault()
        console.log(e.target.name.value)
        const selectedUsers = []
        otherUsers.forEach(user => {
            if (document.getElementById(user.id).checked) {
                console.log(user.name)
                selectedUsers.push(user.id)
            }
        })
        const group = await axios.post('http://localhost:3006/group/create', { "name": e.target.name.value, selectedUsers }, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })

        console.log(selectedUsers)

        console.log(group)
        e.target.name.value = ''
        showGroups(group.data.group)

        document.querySelector('.new-group').classList.add('hide')

        document.querySelector('#create-grp').textContent = 'Create Group'
        const addUsers = document.querySelector('.show-add-users')
        document.querySelector('.show-groups').classList.remove('hide')
        addUsers.classList.add('hide')
    } catch (e) {
        console.log(e)
    }
}

document.getElementById('create-grp').addEventListener('click', async () => {
    if (document.querySelector('.new-group').classList.contains('hide')) {
        document.querySelector('.new-group').classList.remove('hide')
        const res = await axios.get('http://localhost:3006/group/other-users', {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        console.log(res)
        const addUsers = document.querySelector('.show-add-users')
        document.querySelector('.show-groups').classList.add('hide')
        addUsers.classList.remove('hide')
        addUsers.innerHTML = ``
        otherUsers = res.data
        res.data.forEach(user => {
            console.log(user)
            const div = document.createElement('div')

            const label = document.createElement('label')
            label.for = user.id
            label.textContent = user.name

            const input = document.createElement('input')
            input.id = user.id
            input.name = user.id
            input.type = 'checkbox'

            div.appendChild(input)
            div.appendChild(label)

            addUsers.appendChild(div)
        })
        document.querySelector('#create-grp').textContent = 'Back'
    } else {
        document.querySelector('#create-grp').textContent = 'Create Group'
        document.querySelector('.new-group').classList.add('hide')
        const addUsers = document.querySelector('.show-add-users')
        document.querySelector('.show-groups').classList.remove('hide')
        addUsers.classList.add('hide')
    }
})

async function showGroupMessages() {

    try {

        console.log(curr_group)
        const group = curr_group

        let final_messages = JSON.parse(localStorage.getItem(`message-${group.id}`)) || []
        let final_users = JSON.parse(localStorage.getItem(`user-${group.id}`)) || []
        console.log(final_users,'>>>>>><<<<<<')
        let mId = 0
        let uId = 0
        if (final_messages.length > 0)
            mId = final_messages[final_messages.length - 1].id
        if (final_users.length > 0)
            uId = final_users[final_users.length - 1].id
        const res = await axios.get(`http://localhost:3006/message/get-messages/${group.id}/?messageId=${mId}`, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        const res2 = await axios.get(`http://localhost:3006/group/all-users/${group.id}/?id=${uId}`, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        console.log(res)
        console.log(res2)
        messages.innerHTML = ``
        final_messages = [...final_messages, ...res.data.messages]
        document.querySelector('.group-message h2').textContent = group.name
        final_users = [...final_users, ...res2.data]
        console.log(final_users)
        console.log(final_messages)
        final_messages.slice(-10).forEach(message => {
            if (message.type == 'text') {
                console.log(message, '>><<<<<')
                showMessage(message, final_users)
               // socket.emit('user-message', { message: message, final_users: final_users });
               

            }

            else {
                showFiles(message, final_users)
            }
        })

        scrollToBottom()
        users.innerHTML = ``


        const groupToCheck = curr_group;
        console.log(groupToCheck)

        console.log(final_users.length, 'this is final user length')


        
       


         final_users
         .filter((user, index, self) => index === self.findIndex(u => u.id === user.id))
         .forEach(user => {
             console.log(user.member.groupId, '>>><<<<<<');
             showUser(user);
             //console.log(user,'from show')
         });

       


        final_messages = final_messages.slice(-10);


        localStorage.setItem(`message-${group.id}`, JSON.stringify(final_messages));

        localStorage.setItem(`user-${group.id}`, JSON.stringify(final_users))

        const res3 = await axios.post(`http://localhost:3006/admin/show-users/${group.id}`, null, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        console.log(res3)
        displayUsers.innerHTML = ``



        
       res3.data.forEach(user => {
       
        console.log(res3.data.length,'from response length')
           
             addUser(user)
        
        })

     

    } catch (e) {
        console.log(e)
    }

}


function showFiles(data, users) {
    const id = curr_group.member.id

    const div = document.createElement('div')
    console.log(typeof users)
    if (id == data.memberId) {
        div.className = 'u-message u-multi'
        div.textContent = "You "
    } else {
        const user = users.find(user => data.memberId == user.member.id)
        console.log(user)
        if (user) {
            div.className = 'o-message o-multi'
            div.textContent = user.name

        } else {
            return;
        }


    }
    if (data.type.startsWith('image')) {
        const img = document.createElement('img')
        img.src = data.message
        div.appendChild(img)
    } else if (data.type.startsWith('video')) {
        const video = document.createElement('video')
        const source = document.createElement('source')
        source.src = data.message
        video.appendChild(source)
        video.controls = true
        div.appendChild(video)
    }
    div.style.marginBottom = '1em';

    messages.appendChild(div)
}


function showUser(user) {
    const member = curr_group.member
    console.log(member)
    console.log(user)
    const div = document.createElement('div')

    div.textContent = user.name

    div.className = 'curr_user'

    

    if (user.member.admin) {
        const span = document.createElement('span');
        div.className = 'curr_user admin'
        span.textContent = 'admin'
        div.appendChild(span)
    }
    if (user.member.id != member.id && member.admin) {
        const btns = document.createElement('div')
        console.log(user.member.id + " : " + member.id)
        const makeAdmin = document.createElement('button')
        makeAdmin.textContent = 'Make Admin'

        const removeAdmin = document.createElement('button')
        removeAdmin.textContent = 'Remove Admin'
        if (user.member.admin)
            makeAdmin.classList.add('hide')
        else
            removeAdmin.classList.add('hide')
        let final_users = JSON.parse(localStorage.getItem(`user-${curr_group.id}`)) || []
        makeAdmin.onclick = async () => {
             


      
            try {
                const res = await axios.post(`http://localhost:3006/admin/make-admin/${curr_group.id}`, { "userId": user.id }, {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                })
               
                final_users = final_users.map(elem => {
                    console.log(elem)

                    if (elem.member.userId == user.id) {
                        elem.member.admin = true
                    }
                    return elem
                })
                localStorage.setItem(`user-${curr_group.id}`, JSON.stringify(final_users))
                console.log(res)
                window.location.reload();
                
            } catch (e) {
                console.log(e)
            }

        }


        removeAdmin.onclick = async () => {
            try {
                const res = await axios.post(`http://localhost:3006/admin/remove-admin/${curr_group.id}`, { "userId": user.id }, {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                })
                console.log(res)
                final_users = final_users.map(elem => {
                    console.log(elem)

                    if (elem.member.userId == user.id) {
                        elem.member.admin = false
                    }
                    return elem
                })
                localStorage.setItem(`user-${curr_group.id}`, JSON.stringify(final_users))
                window.location.reload();
            } catch (e) {
                console.log(e)
            }
        }
        btns.appendChild(removeAdmin)

        const removeUser = document.createElement('button')
        removeUser.textContent = 'Remove User'

        removeUser.onclick = async () => {
            try {
                const res = await axios.post(`http://localhost:3006/admin/remove-member/${curr_group.id}`, { "userId": user.id }, {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                })
                final_users = final_users.filter(elem => {
                    console.log(elem)

                    if (elem.member.userId != user.id)
                        return elem
                })
                localStorage.setItem(`user-${curr_group.id}`, JSON.stringify(final_users))
                addUser(user)
                console.log(user);
                users.removeChild(div)
            } catch (e) {
                console.log(e)
            }
        }

        btns.appendChild(makeAdmin)
        btns.appendChild(removeUser)
        div.classList.add('user')
        div.classList.add('curr_user')

        div.appendChild(btns)
    }
    users.appendChild(div)
}

document.querySelector('.header').addEventListener('click', () => {
    const message = document.querySelector('.messages')
    const sendMessages = document.querySelector('.send-messages')
    const users = document.querySelector('.show-users')
    const divUsers = document.querySelector('.users')
    const addUser = document.querySelector('.add-users')

    addUser.classList.add('hide')
    if (users.classList.contains('hide')) {
        message.classList.add('hide')
        sendMessages.classList.add('hide')
        users.classList.remove('hide')
        divUsers.classList.remove('hide')
    } else {
        divUsers.classList.add('hide')
        users.classList.add('hide')
        message.classList.remove('hide')
        sendMessages.classList.remove('hide')
    }

})

document.getElementById('add-user-toggle-btn').addEventListener('click', () => {
    const users = document.querySelector('.show-users')
    const addUsers = document.querySelector('.add-users')
    const displayUsers = document.querySelector('.display-users')

    if (users.classList.contains('hide')) {
        users.classList.remove('hide')
        addUsers.classList.add('hide')
        document.getElementById('add-user-toggle-btn').textContent = 'Add Users'
    } else {
        users.classList.add('hide')
        addUsers.classList.remove('hide')
        document.getElementById('add-user-toggle-btn').textContent = 'Show Users'
    }
})








function addUser(user) {
    console.log(user)
    const div = document.createElement('div')
    div.className = 'add-user group-items'
    div.textContent = `Name : ${user.name} Email : ${user.email}`


    const btn = document.createElement('button')
    btn.textContent = 'Add User'

    btn.onclick = async () => {
        try {
            console.log(curr_group)

            const res = await axios.post(`http://localhost:3006/admin/add-user/${curr_group.id}`, {
                id: user.id
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            })
            console.log(res)
                
           
            displayUsers.removeChild(div)
            showUser(user)

             

        } catch (e) {
            console.log(e)
        }
    }



    div.appendChild(btn)

    displayUsers.appendChild(div);
}


document.getElementById('search').addEventListener('keyup', (e) => {
    const text = e.target.value
    Array.from(displayUsers.children).forEach(user => {
        if (user.textContent.indexOf(text) == -1)
            user.classList.add('hide')
        else
            user.classList.remove('hide')
    })
})



document.getElementById('toggleInput').addEventListener('click', (event) => {
    console.log(event.target.checked)
    if (event.target.checked) {
        document.getElementById('messages').classList.add('hide')
        document.getElementById('files').classList.remove('hide')

    } else {
        document.getElementById('files').classList.add('hide')
        document.getElementById('messages').classList.remove('hide')

    }
})

document.getElementById('files').addEventListener('submit', async (e) => {
    try {
        const group = curr_group
        e.preventDefault()
        console.log('clicked')

        const formData = new FormData(document.getElementById('files'))

        const res = await axios.post(`http://localhost:3006/message/upload-file/${group.id}`, formData, {
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
        console.log(res.data,'from show files')

        let final_users = JSON.parse(localStorage.getItem(`user-${curr_group.id}`)) || []
      
       

        var message=res.data;

        
            socket.emit('user-message', { message: message, users: final_users });
          

        const div = document.createElement('div')
        div.className = 'u-message u-multi'
        div.textContent = "You: "
        const data = res.data
        if (data.type.startsWith('image')) {
            const img = document.createElement('img')
            img.src = data.message
            div.style.marginBottom = '1em';
            div.appendChild(img)
        } else if (data.type.startsWith('video')) {
            const video = document.createElement('video')
            const source = document.createElement('source')
            source.src = data.message
            video.appendChild(source)
            video.controls = true
            div.style.marginBottom = '1em';
            div.appendChild(video)
        }



        div.style.marginBottom = '1em';

        messages.appendChild(div)



        document.getElementById('file').value = ''
    } catch (e) {
        console.log(e)
    }
})


const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

const create = document.getElementById('create-new-group');
const show = document.getElementById('show-users')

function setBackground(isDarkMode) {
    if (isDarkMode) {
        body.style.backgroundColor = '#333';
        create.style.color = "white";
        show.style.color = "white";
        body.style.filter = 'grayscale(70%)'

    } else {
        body.style.backgroundColor = '';
        body.style.filter = '';
        create.style.color = "black";
        show.style.color = "black";
        body.style.backgroundImage = "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')"; // Set background image URL
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundPosition = 'right';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = '1010px';
    }
}


const isDarkMode = localStorage.getItem('darkMode') === 'true';


if (isDarkMode) {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    setBackground(true);
}


darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    setBackground(darkModeToggle.checked);

    localStorage.setItem('darkMode', darkModeToggle.checked);
});