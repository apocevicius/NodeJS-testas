const form = document.getElementById('register')
form.addEventListener('register', registerUser)

async function registerUser(event) {
    event.preventDefault()
    const fullName = document.getElementById('fullName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const result = await fetch('/users/register', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullName,
            email,
            password
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // Everything Went Fine
        alert('Success')
        } else {
        alert(result.error)
    }
}