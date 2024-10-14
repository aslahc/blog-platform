/* eslint-disable react/prop-types */
// CreateBlogButton.js

const CreateBlogButton = ({ onClick }) => {
  return (
    <button
      className="bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md w-full sm:w-auto"
      onClick={onClick}
    >
      Create a Blog
    </button>
  );
};

export default CreateBlogButton;
