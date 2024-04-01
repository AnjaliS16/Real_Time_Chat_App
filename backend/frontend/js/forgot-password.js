async function handle(event) {
  event.preventDefault();
  const email = event.target.email.value;


  const obj = {

    email: email,

  };

  try {
    const result = await axios.post("http://localhost:3006/password/forgotpassword", obj)
    if (result.status === 200) {
      document.body.innerHTML += '<div style="color:green;">Mail Successfuly sent <div>'
    } else {
      throw new Error('Something went wrong!!!')
    }

    // console.log(result)

    console.log('posted data')


    // showUserOnScreen(response.data.newuser)
    console.log(result.data)



    document.getElementById('email').value = '';






  }
  catch (err) {

    document.body.innerHTML += `<div style="color:red;">${err} <div>`;

    console.log(err, 'error from forgot-password')




  }
}
