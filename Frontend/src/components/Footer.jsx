import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0B2545] text-white pt-16 pb-8 border-t-2 border-[#134074]">
      {/* Footer Directory Columns */}
      <div className="mx-auto max-w-7xl px-6 grid gap-10 md:grid-cols-4 text-xs">
        
        {/* Column 1: About Portal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 rounded-full bg-white flex flex-col overflow-hidden shrink-0">
              <div className="bg-[#FF9933] h-[33%] w-full"></div>
              <div className="bg-white h-[34%] w-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full border border-[#000080] flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#000080]"></div>
                </div>
              </div>
              <div className="bg-[#138808] h-[33%] w-full"></div>
            </div>
            <span className="font-black text-sm tracking-tight text-white uppercase">
              Aid<span className="text-[#FF9933]">Nexus</span> PORTAL
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            AidNexus is a high-trust digital platform matching geolocated citizen-reported civic challenges with the problem-solving capabilities of student teams from across academic institutions in India, backed by industry and NGO sponsorships.
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Smart India Hackathon Initiative
          </p>
        </div>

        {/* Column 2: Portal Sitemap */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold uppercase tracking-wider border-b border-slate-700 pb-2 text-xs">
            Portal Navigation
          </h4>
          <ul className="space-y-2 text-slate-300 font-semibold">
            <li>
              <Link to="/" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Home Dashboard
              </Link>
            </li>
            <li>
              <Link to="/citizen" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Citizen Grievances
              </Link>
            </li>
            <li>
              <Link to="/student" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Student Workspace
              </Link>
            </li>
            <li>
              <Link to="/industry" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Industry & NGO Panel
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Administrative Console
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Gov Initiatives */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold uppercase tracking-wider border-b border-slate-700 pb-2 text-xs">
            National Portals
          </h4>
          <ul className="space-y-2 text-slate-300 font-semibold">
            <li>
              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> National Portal of India
              </a>
            </li>
            <li>
              <a href="https://mygov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> MyGov Collaboration
              </a>
            </li>
            <li>
              <a href="https://www.sih.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Smart India Hackathon
              </a>
            </li>
            <li>
              <a href="https://www.education.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> Ministry of Education
              </a>
            </li>
            <li>
              <a href="https://www.aicte-india.org/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                <span>➔</span> AICTE India
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div className="space-y-3">
          <h4 className="text-slate-200 font-bold uppercase tracking-wider border-b border-slate-700 pb-2 text-xs">
            Help & Support
          </h4>
          <p className="text-slate-300 leading-relaxed font-semibold">
            For portal queries, technical grievances, or sponsorship assistance, reach out to the help desk.
          </p>
          <div className="space-y-1.5 text-slate-300 font-medium">
            <p>📧 <span className="text-[#FF9933] font-bold">support.aidnexus@gov.in</span></p>
            <p>📞 +91-11-23382604 (10:00 AM - 5:30 PM)</p>
            <p className="text-[10px] text-slate-400 mt-2">Shastri Bhawan, Rajpath, New Delhi, 110001</p>
          </div>
        </div>
      </div>

      {/* Tricolor Accent divider in Footer */}
      <div className="max-w-7xl mx-auto px-6 my-10">
        <div className="h-[2px] w-full flex">
          <div className="h-full bg-[#FF9933] flex-1"></div>
          <div className="h-full bg-white flex-[0.05] relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#000080] absolute"></div>
          </div>
          <div className="h-full bg-[#138808] flex-1"></div>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="mx-auto max-w-7xl px-6 flex flex-col justify-between gap-6 md:flex-row text-[10px] font-bold text-slate-400">
        <div className="space-y-1">
          <p>© 2026 Smart India Hackathon / Government of India Initiative. All Rights Reserved.</p>
          <p className="text-[9px] text-slate-500 font-normal">
            Website developed for educational and hackathon verification purposes. Powered by National Informatics Centre (NIC) / Student Team Project.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-wide">
          <Link to="/" className="hover:text-white transition-colors">Website Policies</Link>
          <span>|</span>
          <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>|</span>
          <Link to="/" className="hover:text-white transition-colors">Disclaimer</Link>
          <span>|</span>
          <Link to="/" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}