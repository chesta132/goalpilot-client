import GoalPilot from "@/assets/images/goalpilot-icon.png";
import clsx from "clsx";
import { useLocation } from "react-router";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const path = location.pathname;
  const noFooterEndWith = ["/create", "/edit", "/change-profile"];
  if (noFooterEndWith.some((startWith) => path.endsWith(startWith))) return;
  const halfFooterPaths = ["/", "/settings", "/search"];
  const halfFooterStartWith = ["/goal", "/task", "/profile"];
  const halfFooter = halfFooterPaths.includes(path) || halfFooterStartWith.some((startWith) => path.startsWith(startWith));

  return (
    <footer className={clsx("bg-slate-800 text-slate-300 border-t border-slate-700", halfFooter && "lg:ml-[22%]")}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r rounded-lg flex items-center justify-center">
                <img src={GoalPilot} alt="GoalPilot" />
              </div>
              GoalPilot
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A personal goal management app that helps you plan, track, and achieve your dreams with better focus and organization.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <nav className="space-x-2 flex">
              <a href="/about" className="block text-sm text-slate-400 hover:text-[#66b2ff] transition-colors hover:underline duration-200">
                About Us
              </a>
              <a href="/privacy" className="block text-sm text-slate-400 hover:text-[#66b2ff] transition-colors hover:underline duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="block text-sm text-slate-400 hover:text-[#66b2ff] transition-colors hover:underline duration-200">
                Terms of Service
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Support</h4>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Need help? Contact us:</p>
              <a
                href="mailto:goalpilot.official@gmail.com"
                className="inline-flex items-center hover:underline text-sm text-[#9fcfff] hover:text-[#66b2ff] transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                goalpilot.official@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© {currentYear} GoalPilot. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Made with ❤️ for goal achievers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
