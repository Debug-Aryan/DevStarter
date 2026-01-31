export default function SignIn() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form method="post" action="/api/auth/callback/credentials">
                <label>Email <input name="email" type="email" defaultValue="user@example.com" /></label>
                <br />
                <label>Password <input name="password" type="password" defaultValue="password" /></label>
                <br />
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}
