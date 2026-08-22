import Navbar from "../components/Navbar";
import OfficialBanner from "../components/OfficialBanner";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import DomainExplorer from "../components/DomainExplorer";
import PriorityRegistry from "../components/PriorityRegistry";
import ResolutionProtocol from "../components/ResolutionProtocol";
import Footer from "../components/Footer";

export default function Home() {

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-800 selection:text-white">

            <Navbar />

            <OfficialBanner />

            <Hero />

            <Stats />

            <DomainExplorer />

            <PriorityRegistry />

            <ResolutionProtocol />

            <Footer />

        </div>
    );
}