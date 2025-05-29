import {useState, useEffect} from 'react';
import api from '@/app/utilitys/axiosconfig';
import { MathJax } from 'better-react-mathjax';

// the main courselearner component!
export default function CourseLearnerComponent() {
const [message, setMessage] = useState("");
const [aiResponse, setAIResponse] = useState([]);
const [userCourses, setUserCourses] = useState([]);
const [allCourses, setAllCourses] = useState([]);
const [selectedCourse, setSelectedCourse] = useState("");
const [userHitSubmit, setUserHitSubmit] = useState(false);
const [userChat, setUserChat] = useState([]);
const [users, setUsers] = useState([]);
const [chatExists, setChatExists] = useState(false);
const [closeChat, setCloseChat] = useState(false);


// will fetch for the users signed up courses and all the courses 
useEffect(() => {
    const handleUserCourses = async () => {
try {
const res1 = await api.get('/api/user/courses');
setUserCourses(res1.data);
const res2 = await api.get('/api/courses');
setAllCourses(res2.data);

} catch (err) {
    console.error('Error getting the users courses', err);
    }
};
handleUserCourses();
}, [])

// will fetch for the users saved chat!
useEffect(() => {
    const handleChats = async () => {
try {
const res = await api.get('/api/user/chats');
setUserChat(res.data);
} catch (err) {
    console.error('Error getting the courses', err);
    }
};
handleChats();
}, [])

// will fetch for the users data!
useEffect(() => {
    const handleUser = async () => {
try {
const res = await api.get('/api/user');
setUsers(res.data);
} catch (err) {
    console.error('Error getting the courses', err);
    }
};
handleUser();
}, [])

// handles the user getting the ai messsage as well as sending the users message and the ai message to be saved in the SQL database!
const handleUserMessages = async (e) => {
    e.preventDefault();
    setUserHitSubmit(true);
    try {
      const res = await api.post(
        '/api/course-learner/ai-chat',
        { message, selectedCourse });

      // grabs the data from the post 
      const reply = res.data.reply
      setChatExists(true);
      // sets the data to the ai response
      setAIResponse([...aiResponse, reply]);
      // creates a copy of the array to push the repy data to!
      // posts the user message and the ai response to the SQL database server
      setCloseChat(false);
      await api.post('/api/user/chat', {message, aiResponse: reply});
      console.log('chat saved!');
      setMessage("");
    } catch (err) {
      console.error("Error posting to chat API", err);
      setUserHitSubmit(false);
      setChatExists(false);
      // if all goes well will take the loading screen away!
    } finally {
    setUserHitSubmit(false);
    }
  };

  // will delete the user chat to create a new chat!
  const handleChatReset = async () => {
  // will refresh the page after the user starts a new chat!
  location.reload();
  try {
   await api.delete('/api/user/newchat');
  } catch (err) {
  console.error('Error creating new chat!')
  }
  }

  // will handle the chat popup to close and Open 
 const handleResponseCloseAndOpen = () => {
 if (!closeChat) {
 setCloseChat(true);
 } else {
 setCloseChat(false);
 }
 }

// will filter all courses then compare the userCourses id to the allcourses id for a match!
const courses = allCourses.filter(ac => userCourses.some(uc => uc.id === ac.id))
const userMessage = userChat.filter(uc => uc.role === 'user');
const aiMessage = userChat.filter(uc => uc.role === 'ai');
const user = users.filter(user => user.name);

// NEED TO ALSO FIX ACHIEVEMENTS IT IS NOT WORKING AT ALL!! NO DATA HAS BEEN SENT TO THE DATABASE OR THE FRONT END ETC...
// FIX THE SETTINGS LAYOUT AS WELL MAKE IT 6 BY 6 and then 12 under!
// MAKE MESSAGES SHOW 1 BY 1 BY 1 AFTER EACH REPLY IS SHOWN AS WELL AS THE USERS MESSAGE!

return (
<main className="mt-20 h-screen overflow-hidden bg-gray-100 flex flex-col items-center px-4">
  {/* Sticky Form Header */}
  <div className="fixed top-20 left-0 w-full z-50 bg-white px-6 py-4 border-b border-gray-200 shadow-lg">
    <form onSubmit={handleUserMessages} className="flex flex-col md:flex-row items-center justify-center gap-3">
      <select
        className="p-2 border rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setSelectedCourse(e.target.value)}
        required
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Ask MyMath something..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="flex-1 p-2 border rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md shadow"
      >
        Send
      </button>
      {closeChat ? 
      <button className='bg-green-500 hover:bg-green-400 p-2 rounded-md text-white' type='button' onClick={handleResponseCloseAndOpen}>ReOpen Chat</button>
      : null}
    </form>
  </div>

  {/* Title */}
  <div className="mt-32 w-full max-w-3xl text-center">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Previous Messages</h1>
  </div>

  {/* Chat Log */}
  <div className="flex-1 w-full max-w-3xl overflow-y-auto space-y-6 pb-32">
    {userMessage.map((chat, index) => (
      <div
        key={`pair-${chat.id}-${aiMessage[index]?.id || index}`}
        className="bg-white shadow-md rounded-lg p-4"
      >
        <p className="font-semibold text-gray-900">
          {users[0]?.name}: <span className="font-normal text-gray-700">{chat.message}</span>
        </p>
        {aiMessage[index] && (
          <p className="mt-2 text-gray-800">
            <span className="font-semibold text-blue-600">MyMath:</span> {aiMessage[index].message}
          </p>
        )}
        
      </div>
    ))}
     <div className="flex justify-center mt-4">
          <button
            onClick={handleChatReset}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded shadow"
          >
            Erase Chat History
          </button>
        </div>
  </div>

  {/* AI Response or Loading */}
  {userHitSubmit ? (
    <div className="fixed bottom-0 left-0 w-full bg-yellow-100 text-yellow-800 text-center p-4 shadow-inner font-semibold z-40">
      Response Loading...
    </div>
  ) : (
    chatExists && !closeChat && (
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md p-6 z-40 h-96 overflow-y-auto">
         <div className='flex justify-end'>
        <button onClick={handleResponseCloseAndOpen} className='hover:bg-gray-100 text-black'>X</button>
        </div>
        <h2 className="text-xl font-bold text-center text-blue-600 mb-2">Chat</h2>
        {user.map((user, index) => (
          <p key={index} className="text-gray-800 mb-2 text-center">{user.name}: {message}</p>
        ))}
        {aiResponse.map((response, index) => (
        <div className="text-center text-gray-900 mt-5" key={index}>
          <h1 className='font-bold'>MyMath</h1>
          <MathJax>{`MyMath - ${response}`}</MathJax>
        </div>
        ))}
      </div>
    )
  )}
</main>

)
}