import Navbar from "./component/Navbar";
import HomePage  from "./pages/Home";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
    <Navbar/>
    <HomePage/>
    </div>
  );
}
