
// will handle the search functionality of the users courses
export default function SearchComponent({setSearchQuery}) {

const handleChange = (e) => {
setSearchQuery(e.target.value)
}

    return (
        <form className="flex flex-col justify-center items-center">
        <input onChange={handleChange} placeholder="Search a course..." type="text" className="bg-white mb-8 mt-3 p-2 rounded-sm shadow-md focus:ring-2 w-100 max-md:w-50 hover:min-md:w-175"/>
        </form>
    )
}