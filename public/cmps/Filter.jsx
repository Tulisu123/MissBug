export function FilterSection({ filterBy, onSetFilterBy }) {

    function onFilterBy(ev) {
        onSetFilterBy(ev.target.value);
    }

    return (
        <section className="filter-section">
                <input
                    type="text"
                    placeholder="Search for a bug"
                    name="filter"
                    value={filterBy || ''}
                    onInput={onFilterBy}
                />
        </section>
    )
}