function handle(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    const obj = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };


    axios.post("http://localhost:3006/add-details", obj)
        .then((response) => {
            // console.log(response.data)
           // if (response.data.Error) {
             //   console.log('already have bro>>>>>>')
             //   alert('User already exists,Please Login!!');
           // }
            //else {
                console.log('posted data')

                // showUserOnScreen(response.data.newuser)
                console.log(response.data, '>>>>>>>>>>>>')
                alert('successfuly Signed up!')


                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('password').value = '';

                window.location.href = "login.html"
            //}

        })
        .catch((err) => {

            document.body.innerHTML = document.body.innerHTML + "<h4>Oops! something went wrong</h4>"
            console.log(err)


        })






}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("http://localhost:3006/get-details")
        console.log('got our data')


        console.log(response)


    }
    catch (err) {
        console.log(err)
    }
})
