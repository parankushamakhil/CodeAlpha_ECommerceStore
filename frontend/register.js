document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message');
    const token = localStorage.getItem('token');

    if (token) {
        window.location.href = '/';
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match';
            messageDiv.style.display = 'block';
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                messageDiv.textContent = data.message;
                messageDiv.style.display = 'block';
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = '/';
        } catch (error) {
            messageDiv.textContent = 'Error creating account. Please try again.';
            messageDiv.style.display = 'block';
        }
    });
});