import HomeIcon from "../icons/Home";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center">
      <div className="h-14 flex items-center">
        <HomeIcon className="w-6 h-6 invert" />
      </div>
      <HeaderNav />
    </header>
  );
}
