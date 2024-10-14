const BlogCard = (
  filteredBlogs,
  users,
  userData,
  getStateFromLocation,
  handleEdit
) => {
  return (
    <div>
      {filteredBlogs.length > 0 ? (
        filteredBlogs
          .map((blog, index) => {
            const author = users.find((user) => user._id === blog.author._id);
            const isAuthor = userData === blog.author._id;
            return (
              <article
                key={blog._id || index}
                className="py-12 border-b border-gray-200 last:border-b-0 transition-transform duration-300 ease-in-out transform  hover:scale-105"
              >
                <header className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 hover:text-gray-600 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-500 mr-2">
                        {author ? author.name : "Unknown Author"}
                      </span>
                      {blog.location && (
                        <span className="before:content-['•'] before:mx-2">
                          {getStateFromLocation(blog.location)}
                        </span>
                      )}
                    </div>
                    {isAuthor && (
                      <button
                        onClick={() => handleEdit(blog._id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        Edit Post
                      </button>
                    )}
                  </div>
                </header>

                <div className="prose prose-lg max-w-none">
                  {blog.content.map((block) => {
                    switch (block.type) {
                      case "paragraph":
                        return (
                          <p
                            key={block.id}
                            className="mb-4 text-gray-700 leading-relaxed"
                          >
                            {block.data.text}
                          </p>
                        );
                      case "image":
                        return (
                          <figure key={block.id} className="my-8">
                            <img
                              src={block.data.file.url}
                              alt={block.data.caption || "Blog Image"}
                              className="w-full h-auto rounded-lg shadow-md"
                            />
                            {block.data.caption && (
                              <figcaption className="mt-2 text-center text-sm text-gray-500">
                                {block.data.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      case "header":
                        return (
                          <h3
                            key={block.id}
                            className="text-2xl font-semibold text-gray-900 mt-8 mb-4"
                          >
                            {block.data.text}
                          </h3>
                        );
                      case "list":
                        return (
                          <ul
                            key={block.id}
                            className="list-disc pl-5 space-y-2 mb-4"
                          >
                            {block.data.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-700">
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>

                {blog.video && (
                  <div className="my-8">
                    <video
                      src={blog.video}
                      controls
                      className="w-full h-auto rounded-lg shadow-md"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </article>
            );
          })
          .reverse()
      ) : (
        <p className="text-center text-gray-500 py-12">No blogs found.</p>
      )}
    </div>
  );
};

export default BlogCard;
