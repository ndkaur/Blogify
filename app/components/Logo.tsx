import Link from "next/link";

// self making the logo 
const Logo = () => {
  return (<Link href={"/"} 
    className="text-gray-900 text-lg font-extrabold tracking-wider">
    <span className="text-red-600 font-bold text-2xl">B</span>
    {"LOGIFY"}
  </Link>
  );
};

export default Logo;