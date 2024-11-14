export function UserDetails({ users, removeUser }) {
    return (
        <ul>
            {users.map(user => {
                return <li key={user._id} style={{ listStyleType: 'none' }}>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>ID:</strong> {user._id}</p>
                    <p><strong>Full Name:</strong> {user.fullname}</p>
                    <button onClick={() => removeUser(user._id)}>Remove</button>
                    <hr></hr>
                </li>
            })}
        </ul>
    )
}