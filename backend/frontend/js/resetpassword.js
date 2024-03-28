

window.addEventListener('DOMContentLoaded', async () => {

    let url = window.location.href
    let arr = url.split("?reset=")
    const resetId = arr[1]

    console.log(resetId)
    if (resetId == null || resetId.length == 0) {
        alert("wrong link")
        location.href = 'forgot-password.html'
    }
    const res = await axios.get(`http://54.159.189.58:3005/check-password-link/${resetId}`)
    if (!res.data.isActive) {
        alert("link expired get a new one")
        location.href = 'forgot-password.html'
    }
    console.log(res)

})



async function handleSubmit(event) {
    try {

        event.preventDefault()
        const newPassword = event.target['new-password'].value
        const confirmPassword = event.target['confirm-password'].value
        let url = window.location.href
        let arr = url.split("?reset=")
        const resetId = arr[1]

        //  console.log(newPassword)

        if (newPassword !== confirmPassword)
            alert('new and confirm password are different')
        else {

            const res = await axios.post(`http://54.159.189.58:3005/resetpassword/${resetId}`, { newPassword, confirmPassword })
            // console.log(res)

            alert('password changed successfully!')
            console.log('posted data')
            window.location.href = 'login.html'

        }

    }
    catch (e) {
        console.log(e)
        throw e
    }

}
