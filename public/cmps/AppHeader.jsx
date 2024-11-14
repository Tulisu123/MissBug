const { NavLink } = ReactRouterDOM
const { useEffect, useState } = React

import { User } from './User.jsx'
import { UserMsg } from './UserMsg.jsx'
import { userService } from '../services/user.service.js'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedInUser())

    async function toggleIsLoggedIn(ev, user, signup) {
        ev.preventDefault()
        if (signup) {
            await userService.signup(user)
        }
        else {
            await userService.login(user)
        }
        setUser(userService.getLoggedInUser())
    }

    async function logout(){
        await userService.logout()
        setUser(userService.getLoggedInUser())
    }

    useEffect(() => {
        console.log('user in app header front', user)
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className='container'>
            <User user={user} logout={logout} toggleIsLoggedIn={toggleIsLoggedIn} />
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            <h1>Bugs are Forever</h1>
        </header>
    )
}
