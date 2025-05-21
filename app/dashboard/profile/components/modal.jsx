
// this will allow things to be open sepratly on the same page
export default function ModalComponent({ isOpen, onClose, children }) {
    // checks if it is open!
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black to-blue-500 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  