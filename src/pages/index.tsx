
import Event from "@/components/Event";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="mx-auto">
    <Hero/>
    <Navbar/>
    <Event/>
    <Footer/>
    </div>
  );
}
