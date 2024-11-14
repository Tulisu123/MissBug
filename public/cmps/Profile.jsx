export function Profile({user, onHideClick}){

    return (
        <section>
            <p>Hello: {user.fullname}</p>
            <p>Username: Username: {user.usernmame}</p>
            <p>This is your id:{user._id}</p>
            <button onClick={onHideClick}>Hide</button>
        </section>
    )
}