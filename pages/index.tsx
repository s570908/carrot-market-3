import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col space-y-2 p-5">
      <p className="first-letter:text-7xl first-line:hover:text-purple-400 ">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat
        voluptatum quam quos aspernatur magni nobis quis velit eius nulla,
        architecto beatae perspiciatis, deleniti obcaecati, ipsa ducimus
        necessitatibus doloremque dolores debitis!
      </p>
    </div>
  );
};

export default Home;
