import ModalComponent from "./modal";
import {useState} from 'react';
import ImageUploaderComponent from "./imageuploader";
// this will be for the actual swapping of user profile images
export default function ChangeProfileImageComponent() {
const [isModalOpen, setIsModalOpen] = useState(false);
return (
    <div className="p-10">
      <button
        className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-500 shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        Change Profile Picture
      </button>

      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-xl font-bold mb-4 text-black">Choose Your Image</h1>
        <ImageUploaderComponent />
      </ModalComponent>
    </div>
  );
}