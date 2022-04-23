import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col space-y-2 p-5">
      <input
        type="file"
        className="file:hover: file:cursor-pointer file:rounded-xl file:border-0 file:bg-purple-400 file:px-5 file:text-white file:transition-colors file:hover:border file:hover:border-purple-400 file:hover:bg-white file:hover:text-purple-400"
      />
    </div>
  );
};

export default Home;
