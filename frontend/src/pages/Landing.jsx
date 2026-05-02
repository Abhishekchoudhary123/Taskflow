import { useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdGroup, MdBarChart, MdFlashOn, MdArrowForward, MdStar } from 'react-icons/md';

const features = [
  { icon: MdCheckCircle, title: 'Task Management',     desc: 'Create, assign, and track tasks with priorities and due dates.' },
  { icon: MdGroup,       title: 'Team Collaboration',  desc: 'Add members to projects and assign tasks to the right people.' },
  { icon: MdBarChart,    title: 'Progress Tracking',   desc: 'Visualize progress with a live dashboard and status filters.' },
  { icon: MdFlashOn,     title: 'Role-Based Access',   desc: 'Admins manage everything; members see only their work.' },
];

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              ✅
            </div>
            <span className="text-2xl">TaskFlow</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => nav('/login')} className="btn-secondary text-sm px-6">
              Login
            </button>
            <button onClick={() => nav('/register')} className="btn-primary text-sm px-6">
              Get Started <MdArrowForward />
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="text-center px-6 pt-24 pb-20 max-w-5xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-5 py-2 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
            <MdStar className="text-yellow-400" /> 
            <span>Role-based Team Task Manager</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight mb-8">
            Manage Projects.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
              Ship Faster.
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A full-stack task management platform for teams — create projects, assign tasks,
            track progress, and hit every deadline with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => nav('/register')} className="btn-primary text-lg px-10 py-4 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60">
              Start Free <MdArrowForward className="text-xl" />
            </button>
            <button onClick={() => nav('/login')} className="btn-secondary text-lg px-10 py-4">
              Login
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-slate-400">Projects Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-sm text-slate-400">Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-32 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <div key={title} className="card-hover text-center group" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                <Icon className="text-3xl text-white" />
              </div>
              <h3 className="font-bold text-white mb-3 text-lg">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="card-hover text-center py-16 px-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-300 mb-8 text-lg">Join thousands of teams already using TaskFlow</p>
            <button onClick={() => nav('/register')} className="btn-primary text-lg px-10 py-4 mx-auto">
              Create Free Account <MdArrowForward className="text-xl" />
            </button>
          </div>
        </section>

        <footer className="text-center text-slate-500 text-sm pb-10 border-t border-slate-800 pt-10">
          <p>© 2026 TaskFlow. Built with ❤️ for productive teams.</p>
        </footer>
      </div>
    </div>
  );
}
