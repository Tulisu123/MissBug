import { userService } from '../services/user.service.js'
import { UserDetails } from '../cmps/UserDetails.jsx'

const { useState, useEffect } = React

export function EditUserPage() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const usersData = await userService.getUsersWithoutPasswords()
            setUsers(usersData);
        }
        fetchUsers()
    }, [])

    async function removeUser(userId){
        console.log('removing user with id', userId)
        const removedUser = await userService.remove(userId)
        console.log('user removed: ' + JSON.stringify(removedUser))
        setUsers(prevUsers => {
            prevUsers.filter(user => user._id !== removeUser.id)
        })
    }

    if (!users) {
        return <p>No users to disply</p>
    }

    return (
        <section>
            <h1>Edit User page</h1>
            <UserDetails users={users} removeUser={removeUser} />
        </section>
    )
}