document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');
    const token = localStorage.getItem('token');

    if (token) {
        window.location.href = '/';
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
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
            messageDiv.textContent = 'Error logging in. Please try again.';
            messageDiv.style.display = 'block';
        }
    });
});