import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer className="border-t border-slate-200 bg-white">

            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-xs text-slate-500 md:flex-row">

                <p>
                    © 2026 CivicConnect Governance Portal.
                    Built for Smart India Hackathon.
                </p>

                <div className="flex gap-6">

                    <Link
                        to="/privacy"
                        className="hover:text-slate-800"
                    >
                        Privacy Policy
                    </Link>

                    <Link
                        to="/contact"
                        className="hover:text-slate-800"
                    >
                        Terms of Service
                    </Link>

                </div>

            </div>

        </footer>
    );
}