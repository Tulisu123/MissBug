const { useState } = React
import { userService } from '../services/user.service.js'

export function Login({ toggleIsLoggedIn }) {
    const [caredentials,setCaredentials] = useState(userService.getEmptyCaredentials())

    function onInputChange(ev){
        const {name,value} = ev.target
        setCaredentials(prevCaredentials => ({
            ...prevCaredentials,
            [name]: value
        }))
    }

    return (
        <form>
            Login
            <br />
            <label htmlFor="username">Username:</label>
            <input type="text"
                name="username"
                id="username"
                onInput={onInputChange}
                value={caredentials.username}
            />
            <label htmlFor="username">Password:</label>
            <input type="password"
                name="password"
                id="password"
                onInput={onInputChange}
                value={caredentials.password}
            />
            <button onClick={(ev) => toggleIsLoggedIn(ev, caredentials)}>Log in</button>
        </form>
    )
}