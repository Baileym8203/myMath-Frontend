import api from "@/app/utilitys/axiosconfig";

// will handle the uploading of the users profile images!
export default function ImageUploaderComponent() {

const handleImageUpload = async (e) => {
  // will prevent a page refresh when submiting!
  e.preventDefault();
  // creates a form data object to simulate file upload
  const formData = new FormData();
  // adds the user selected file with the image key
  formData.append('image', e.target.image.files[0]);
try {
  // will await a post to the backend with the image from the user
  await api.post('/api/user/profile-image', formData, {
    // this is a multipart form upload! it will let the backend know!
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  alert('Successfully added your profile image')
} catch (err) {
console.error('Something went wrong uploading your image!', err)
}
};

return (
  <form onSubmit={handleImageUpload} className='flex flex-col'>
  <input type="file" name="image" className="mb-5"/>
  <button className='bg-blue-400 rounded-sm p-1 hover:bg-blue-300 text-black' type="submit">Upload</button>
</form>

  );
}