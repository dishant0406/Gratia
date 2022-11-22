const BlogCard = ({imgUrl, content, title}) => {
  return (
    <div className="lg:flex">
  <div
    className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
    style={{ backgroundImage: `url(${imgUrl})`, backgroundPosition:'center' }}
    title="Mountain"
  ></div>
  <div className="border-r w-[50vw] border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div className="mb-8">
      
      <div className="text-gray-900 font-bold text-xl mb-2">
        {title}
      </div>
      <p className="text-gray-700 text-base">
       {content}
      </p>
    </div>
    {/* <div className="flex items-center">
      <img
        className="w-10 h-10 rounded-full mr-4"
        src="/ben.png"
        alt="Avatar of Writer"
      />
      <div className="text-sm">
        <p className="text-gray-900 leading-none">John Smith</p>
        <p className="text-gray-600">Aug 18</p>
      </div>
    </div> */}
  </div>
</div>

  )
}

export default BlogCard