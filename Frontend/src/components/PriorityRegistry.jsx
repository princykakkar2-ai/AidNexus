import { Link } from "react-router-dom";
import RegistryCard from "./RegistryCard";

import solar from "../assets/solar.png";
import leakage from "../assets/water-leakage.png";

export default function PriorityRegistry() {

    return (
        <section className="mx-auto max-w-7xl px-6 py-8">

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Priority Grievance Registry
                    </h2>

                    <p className="text-xs text-slate-500">
                        Highest citizen endorsement requires technical review
                    </p>
                </div>

                <Link
                    to="/problems"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 underline"
                >
                    Full Index →
                </Link>

            </div>

            <div className="grid gap-6 md:grid-cols-3">

                <RegistryCard
                    image="https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=600&auto=format&fit=crop&q=80"
                    title="Pothole Detection & Rapid Patch System"
                    category="Infrastructure"
                    votes={342}
                    location="Ward 12, New Delhi"
                    status="Under Evaluation"
                />

                <RegistryCard
                    image={solar}
                    title="Solar Micro-Grid for Rural Schools"
                    category="Clean Energy"
                    votes={289}
                    location="Pune District"
                    status="Pilot Phase"
                />

                <RegistryCard
                    image={leakage}
                    title="AI Water Leak Detection Network"
                    category="Environment"
                    votes={210}
                    location="Bengaluru South"
                    status="Open for Bids"
                />

            </div>

        </section>
    );
}