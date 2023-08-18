import { IconType } from "react-icons";
import Logo from "./Logo";
import {AiOutlineInstagram, AiFillGithub, AiFillLinkedin} from "react-icons/ai";

const links = [AiOutlineInstagram, AiFillGithub, AiFillLinkedin];

const IconContainer = (props:{icon:IconType}) => {
    return <props.icon size={25} className="cursor-pointer"/>
}

const Footer = () => {
  return <section className="bg-gray-100 w-full h-full">
    <hr className="p-3"/>
    <div className="flex flex-col p-20 xs:gap-8 md:gap-6">
      <div className="flex md:flex-row xs:flex-col md:justify-between xs:justify-start items-center">
        <div>
          <Logo/>
        </div>
        <div className="flex p-2 gap-6">
          {links.map((item)=> (
            <IconContainer icon={item} key={item.toString()}/>
          ) )}
        </div>
      </div>

    </div>
  </section>;
};

export default Footer;