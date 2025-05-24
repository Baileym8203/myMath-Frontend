
import { useState, useEffect } from "react";
import api from "@/app/utilitys/axiosconfig";
import SearchComponent from "./search";

// will be the main courses function for the dashboard
export default function CoursesDashboardComponent() {
const [courses, setCourses] = useState([]);
const [searchQuery, setSearchquery] = useState("");
const [enrolledCourses, setEnrolledCourses] = useState([]);


// will grab all of the courses avalible
useEffect(() => {
const fetchCourses = async () => {
try {
  // awaits grabbing the courses!
const res = await api.get('/api/courses');
// sets the courses to the data recieved!
setCourses(res.data);
// catches any errors along the way!!
} catch (err) {
console.error('Error getting courses', err);
}
};
// calls the actual function to use it!
fetchCourses();
}, []);

// will be responsible for getting the users courses they are enrolled into!
useEffect(() => {
const fetchUsersCourses = async () => {
try {
// will await the get request to the backend
const res = await api.get('/api/user/courses');
// sets the state of EnrollledCourses to the mapped data of all the resulting course stuff but only the id
setEnrolledCourses(res.data.map(course => course.id));
// catches any errors along the way!
} catch (err) {
console.error('Error getting the users courses', err);
}
}
fetchUsersCourses();
}, [])

// will handle the user being enrolled into the course itself
const handleEnroll = async (courseID) => {
try {
// awaits posting the users course id into the backend with the token credientials
await api.post('/api/user/course', {courseID});
// sends a alert on success!
alert('Enrolled Succesfully!');
// catches any errors along the way!
} catch (err) {
console.error('Enroll failed, err');
}
};
  // will filter the courses shown based on what the input is in the search function!
  const filteredCourses = 
  courses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // will check if the user is enrolled to a certain course
  const isEnrolled = (courseId) => {
  return enrolledCourses.includes(courseId);
  }

    return (
        <main className="">
          <div className=""></div>
          <div className="bg-indigo-500 in p-10 rounded-lg mt-5 shadow-inner/70 mb-3">
          <h1 className="text-5xl font-extrabold text-center mt-10 mb-8 text-white text-shadow-lg/20">Course Selection</h1>
          </div>
          {/* will pass the setSearchQuery setState as a prop to the search function to update the state there! */}
          <SearchComponent setSearchQuery={setSearchquery} />
      
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <p className="text-white text-center col-span-12 sm:col-span-6 lg:col-span-4">
                No Results...
              </p>
            ) : (
              filteredCourses.map((course) => {
                const isUserEnrolled = isEnrolled(course.id);
                return (
                  <div
                    key={course.id}
                    className="bg-white p-4 rounded-lg shadow-md shadow-black/30 flex flex-col items-center"
                  >
                    {isUserEnrolled ? (
                      <div>
                      <p className="text-green-500 font-semibold text-center">Enrolled</p>
                       <button
                        unselectable="true"
                        className="opacity-40"
                      >
                      <img
                      src={course.image_url}
                      alt={course.title}
                      className="h-40 object-cover rounded-md shadow-sm"
                    />
                      </button>
                       <h1 className="text-center font-bold">{course.title}</h1>
                      </div>
                    ) : (
                      <div>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className=""
                      >
                      <img
                      src={course.image_url}
                      alt={course.title}
                      className="h-40 object-cover rounded-md shadow-sm transition-[height] duration-750 delay-50 hover:h-60"
                    />
                    <h1 className="font-bold mt-3">{course.title}</h1>
                      </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      );
    }