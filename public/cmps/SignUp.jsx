import { userService } from "../services/user.service.jsx"

const {useState} = React


export function SignUp({ toggleIsLoggedIn }) {

    const [caredentials,setCaredentials] = useState(userService.getEmptyCaredentials())
    
    function onInputChange(ev){
        const {name, value} = ev.target
        setCaredentials(prevCardentials => ({
            ...prevCardentials,
            [name]: value
        }))
    }

    return (
        <form>
            SignUp
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

            <label htmlFor="fullname">Full name:</label>
            <input type="text"
                name="fullname"
                id="fullname"
                onInput={onInputChange}
                value={caredentials.fullname}
            />
            <button onClick={(ev) => toggleIsLoggedIn(ev, caredentials, true)}>Signup</button>
        </form>
    )
}