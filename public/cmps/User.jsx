import { Login } from "./Login.jsx"
import { SignUp } from "./SignUp.jsx"
import { Profile } from "./Profile.jsx"

const { useState } = React
const { useNavigate } = ReactRouterDOM

export function User({ user, logout, toggleIsLoggedIn }) {
    const [isSignUp, setIsSignUp] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const navigate = useNavigate()

    function signup() {
        setIsSignUp(true)
    }

    function onLogOut() {
        navigate('/bug')
        setIsSignUp(false)
        logout()
    }

    function onHideClick() {
        setIsProfileOpen(false)
    }

    function moveToEditUsersPage() {
        navigate('/users')
    }

    return (
        <section>
            {isSignUp && !user ? (
                <SignUp toggleIsLoggedIn={toggleIsLoggedIn} />
            ) : (
                user ? (
                    <React.Fragment>
                        <h1>Welcome, {user.fullname}!</h1>
                        <button onClick={onLogOut}>Logout</button>
                        {!isProfileOpen && <button onClick={() => setIsProfileOpen(true)}>Profile</button>}
                        {isProfileOpen && <Profile user={user} onHideClick={onHideClick}></Profile>}
                        {user.isAdmin &&
                            <React.Fragment>
                                <p>You are an admin!</p>
                                <button onClick={moveToEditUsersPage}>Edit users</button>
                            </React.Fragment>
                        }
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Login toggleIsLoggedIn={toggleIsLoggedIn} />
                        <button onClick={signup}>Signup</button>
                    </React.Fragment>
                )
            )}
        </section>
    )
}    