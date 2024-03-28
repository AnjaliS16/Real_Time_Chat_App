async function handle(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;

  const obj = {

    email: email,
    password: password
  };

  try {
    const result = await axios.post("http://54.159.189.58:3005/login", obj)


    //console.log(result)

    console.log('posted data')
    if (result.data.token) {
      localStorage.setItem('token', result.data.token);
      console.log('Token stored in localStorage');
    }

    // showUserOnScreen(response.data.newuser)
    //console.log(result.data)



    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    alert('login successfull!!')

    window.location.href = 'script.html'


  }
  catch (err) {

    //document.body.innerHTML = document.body.innerHTML + "<h4>Oops!wrong crediantials..</h4>"
    console.log(err)
    alert('user not found')



  }



}
