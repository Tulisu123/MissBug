import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { FilterSection } from '../cmps/Filter.jsx'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useCallback } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [pageIdx, setPageIdx] = useState(0)
    const [filterBy, setFilterBy] = useState('')
    const debouncedLoadBugs = useCallback( //usecallback dependencies, we will include in the depencecied array the variables we want to render to the new instance of the function again when they are changing
        utilService.debounce(loadBugs, 500),
        [filterBy,pageIdx]
    )

    useEffect(() => { //using debounce here, ensures that we use the latest debouncedLoadBugs function instance. its not automatically 
        debouncedLoadBugs()
    }, [debouncedLoadBugs])

    function loadBugs() {
        console.log('pageIdx in index', pageIdx)
        bugService.query(filterBy,pageIdx).then(setBugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
            setBugs(bugsToUpdate)
            showSuccessMsg('Bug removed')
        }
        catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    function onSetFilterBy(filterBy) {
        console.log('filter by in onset on index:', filterBy)
        setPageIdx(0)
        setFilterBy(filterBy)
    }

    function onAddBug() {
        const loggedInUser = userService.getLoggedInUser()
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Description?'),
            creator:{
                _id:loggedInUser._id,
                fullname:loggedInUser.fullname
            }
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    async function onEditBug(bug) {
        try {
            const severity = +prompt('New severity?')
            const bugToSave = { ...bug, severity }
            const savedBug = await bugService.save(bugToSave)
            const bugsToUpdate = bugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            )
            setBugs(bugsToUpdate)
            showSuccessMsg('Bug updated')
        }
        catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    function onChangePage(pageOffset){
        if(pageIdx === undefined) return
        setPageIdx(prevPageIdx => {
            const nextPageIdx = prevPageIdx + pageOffset
            return nextPageIdx < 0 ? 0 : nextPageIdx
        })
    }

    return (
        <main>
            <section>
                <button onClick={() => onChangePage(-1)}>-</button>
                <span>{pageIdx}</span>
                <button onClick={() => onChangePage(1)}>+</button>
            </section>
            <FilterSection filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug</button>
            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
