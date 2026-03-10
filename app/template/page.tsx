export default function TemplatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-900">

      {/* ── HERO / HEADER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200">
        {/* subtle background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#1428ae]/5 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#1428ae]">Universal Pattern Library</p>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Every UI Element,{" "}
              <span className="text-[#1428ae]">One Page.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              A premium reference for typography, cards, navigation, forms, tables, media, and utilities — built for consistent, beautiful product design.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
                <button className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold shadow-lg shadow-[#1428ae]/40 hover:bg-[#1020a0] hover:shadow-xl hover:shadow-[#1428ae]/50 transition-all duration-200">
              Primary Action
            </button>
            <button className="px-7 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold shadow-md shadow-slate-300/60 hover:bg-slate-50 hover:shadow-lg hover:border-[#1428ae]/30 transition-all duration-200">
              Secondary
            </button>
            <button className="px-7 py-3 rounded-xl text-slate-400 font-semibold hover:text-[#1428ae] transition-all duration-200">
              Tertiary Link →
            </button>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-[#1428ae]/8 text-[#1428ae] text-xs font-semibold">Verified Design</span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">Premium</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">v2.0</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* ── TYPOGRAPHY ─────────────────────────────────────────────────── */}
        <section className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">01 — Type</p>
              <h2 className="text-3xl font-semibold text-slate-900">Typography Scale</h2>
            </div>
            <div className="space-y-3 p-8 rounded-xl bg-white border border-slate-200 shadow-md shadow-slate-300/50">
              <p className="text-5xl font-bold tracking-tight text-slate-900 leading-none">Display 1</p>
              <p className="text-4xl font-bold text-slate-800 leading-tight">Heading Two</p>
              <p className="text-3xl font-semibold text-slate-700">Heading Three</p>
              <p className="text-xl text-slate-600 leading-relaxed">Article intro copy feels warm and approachable.</p>
              <p className="text-base text-slate-500 leading-relaxed">
                Body with{" "}
                <a className="text-[#1428ae] underline underline-offset-2 hover:text-[#1020a0]" href="#">
                  inline link
                </a>
                , <strong className="text-slate-800">bold</strong>, <em>italic</em>, and{" "}
                <span className="line-through">strikethrough</span>.
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Fine print detail</p>
            </div>
          </div>

          {/* ── BADGES & STATUS ─────────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">02 — Feedback</p>
              <h2 className="text-3xl font-semibold text-slate-900">Badges & Status</h2>
            </div>
            <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-md shadow-slate-300/50 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">Success</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">Warning</span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">Error</span>
                <span className="px-3 py-1 rounded-full bg-[#1428ae]/8 text-[#1428ae] text-xs font-medium">Info</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Status in progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1428ae] rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>System health</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Bandwidth</span>
                    <span>38%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: "38%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CARDS ────────────────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">03 — Layout</p>
            <h2 className="text-3xl font-semibold text-slate-900">Cards & Panels</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stat card */}
            <article className="group relative bg-white border border-slate-200 rounded-xl p-7 space-y-5 shadow-md shadow-slate-300/40 hover:shadow-xl hover:shadow-[#1428ae]/20 hover:border-[#1428ae]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Revenue</p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">+12%</span>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 tracking-tight">₱68.4M</p>
                <p className="text-sm text-slate-400 mt-1">vs last quarter</p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1428ae] rounded-full" style={{ width: "68%" }} />
              </div>
            </article>

            {/* Media card */}
            <article className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-md shadow-slate-300/40 hover:shadow-xl hover:shadow-[#1428ae]/20 hover:border-[#1428ae]/30 transition-all duration-200">
              <div className="h-44 bg-gradient-to-br from-[#1428ae]/10 via-blue-50 to-amber-50 flex items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center">
                  <div className="w-8 h-8 rounded-xl bg-[#1428ae]" />
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Media Panel</h3>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Uploaded 2 days ago</span>
                  <span>2.3 MB</span>
                </div>
              </div>
            </article>

            {/* List card */}
            <article className="group bg-white border border-slate-200 rounded-xl p-7 space-y-5 shadow-md shadow-slate-300/40 hover:shadow-xl hover:shadow-[#1428ae]/20 hover:border-[#1428ae]/30 transition-all duration-200">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Activity</p>
              <h3 className="text-lg font-semibold text-slate-900">List Card</h3>
              <ul className="space-y-3">
                {[
                  { label: "Item Alpha", status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { label: "Item Bravo", status: "Pending", color: "text-amber-600 bg-amber-50 border-amber-200" },
                  { label: "Item Charlie", status: "Paused", color: "text-rose-600 bg-rose-50 border-rose-200" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.color}`}>{item.status}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Feature / highlight card */}
          <div className="relative overflow-hidden bg-[#1428ae] rounded-xl p-10 shadow-2xl shadow-[#1428ae]/50">
            <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-48 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold">Featured</span>
                <h3 className="text-3xl font-bold text-white leading-tight">Highlight Banner Card</h3>
                <p className="text-blue-200 leading-relaxed">Premium hero cards for marketing sections, feature announcements, and call-to-action banners.</p>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 rounded-xl bg-[#f59e0b] text-slate-900 font-semibold text-sm shadow hover:bg-amber-400 transition-all duration-200">Get Started</button>
                  <button className="px-6 py-2.5 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200">Learn More</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["₱1.2B", "Portfolio Value"], ["340+", "Active Listings"], ["12yr", "Experience"], ["98%", "Satisfaction"]].map(([num, label]) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4 backdrop-blur">
                    <p className="text-2xl font-bold text-white">{num}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FORMS & INPUTS ───────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">04 — Input</p>
            <h2 className="text-3xl font-semibold text-slate-900">Forms & Inputs</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-md shadow-slate-300/50">
            <form className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Full Name</span>
                  <input
                    className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200"
                    placeholder="Juan dela Cruz"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email Address</span>
                  <input
                    type="email"
                    className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200"
                    placeholder="juan@example.com"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Description</span>
                <textarea
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-[140px] focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200 resize-none"
                  placeholder="Describe your project or idea in detail..."
                />
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Category</span>
                  <select className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200 appearance-none cursor-pointer">
                    <option>Choose category</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Date</span>
                  <input type="date" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Time</span>
                  <input type="time" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#1428ae] focus:ring-2 focus:ring-[#1428ae]/20 outline-none transition-all duration-200" />
                </label>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#1428ae] focus:ring-[#1428ae]/30 cursor-pointer" />
                  <span className="text-sm text-slate-600">Remember my preferences</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="plan" className="w-5 h-5 border-slate-300 text-[#1428ae] focus:ring-[#1428ae]/30 cursor-pointer" />
                  <span className="text-sm text-slate-600">Standard Plan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="plan" className="w-5 h-5 border-slate-300 text-[#1428ae] focus:ring-[#1428ae]/30 cursor-pointer" />
                  <span className="text-sm text-slate-600">Premium Plan</span>
                </label>
              </div>
              <div className="pt-2 flex flex-wrap gap-4">
                <button type="button" className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold shadow-lg shadow-[#1428ae]/40 hover:bg-[#1020a0] hover:shadow-xl hover:shadow-[#1428ae]/50 transition-all duration-200">
                  Submit Form
                </button>
                <button type="button" className="px-7 py-3 rounded-xl bg-[#f59e0b] text-slate-900 font-semibold shadow-lg shadow-amber-400/50 hover:bg-amber-400 hover:shadow-xl transition-all duration-200">
                  Save Draft
                </button>
                <button type="reset" className="px-7 py-3 rounded-xl border border-slate-300 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-all duration-200">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── TABLES ───────────────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">05 — Data</p>
            <h2 className="text-3xl font-semibold text-slate-900">Tables & Lists</h2>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md shadow-slate-300/50">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Team Members</h3>
              <button className="px-4 py-2 rounded-lg bg-[#1428ae] text-white text-xs font-semibold hover:bg-[#1020a0] transition-all duration-200">
                + Add Member
              </button>
            </div>
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Name", "Role", "Status", "Joined", "Actions"].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-slate-400 ${i === 4 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Ana Reyes", role: "Designer", status: "Active", joined: "Jan 2025", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { name: "Marco Santos", role: "Developer", status: "Pending", joined: "Mar 2025", statusColor: "bg-amber-50 text-amber-700 border-amber-200" },
                  { name: "Lea Cruz", role: "Manager", status: "Inactive", joined: "Nov 2024", statusColor: "bg-rose-50 text-rose-700 border-rose-200" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1428ae]/10 flex items-center justify-center text-xs font-bold text-[#1428ae]">
                          {row.name[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${row.statusColor}`}>{row.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{row.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-[#1428ae] hover:text-[#1020a0] transition-colors duration-150">Manage →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* list items */}
          <ul className="space-y-3">
            <li className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-md shadow-slate-300/40 hover:border-[#1428ae]/30 hover:shadow-lg hover:shadow-[#1428ae]/15 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-700">Standard list item with status indicator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1428ae]/8 text-[#1428ae] text-xs font-medium">New</span>
            </li>
            <li className="flex justify-between items-center bg-white border border-dashed border-slate-300 rounded-xl px-5 py-4 hover:border-[#1428ae]/40 hover:shadow-md hover:shadow-[#1428ae]/10 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-slate-700">Dashed border list item style</span>
              </div>
              <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-150">View Details →</button>
            </li>
          </ul>
        </section>

        {/* ── MEDIA & OVERLAYS ──────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">06 — Media</p>
            <h2 className="text-3xl font-semibold text-slate-900">Media & Overlays</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* notification / toast */}
            <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-md shadow-slate-300/50 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Notification Toast</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Success</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Your changes have been saved successfully.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Warning</p>
                    <p className="text-xs text-amber-600 mt-0.5">Please review before proceeding.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="w-5 h-5 rounded-full bg-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rose-800">Error</p>
                    <p className="text-xs text-rose-600 mt-0.5">Something went wrong. Please try again.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* overlay / modal preview */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1428ae]/6 to-blue-50 border border-[#1428ae]/20 rounded-xl p-7 shadow-lg shadow-[#1428ae]/15 space-y-5">
              <div className="pointer-events-none absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-amber-400/20 blur-2xl" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Overlay / Modal</p>
              <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-lg shadow-slate-300/60 space-y-4">
                <h3 className="text-base font-semibold text-slate-900">Confirm Action</h3>
                <p className="text-sm text-slate-500">Are you sure you want to archive this listing? This action can be undone later.</p>
                <div className="flex gap-3 pt-1">
                  <button className="px-5 py-2 rounded-lg bg-[#1428ae] text-white text-sm font-semibold shadow-lg shadow-[#1428ae]/40 hover:bg-[#1020a0] hover:shadow-xl hover:shadow-[#1428ae]/45 transition-all duration-200">
                    Confirm
                  </button>
                  <button className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-[#1428ae]/30 transition-all duration-200">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── UTILITY ELEMENTS ─────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">07 — Utility</p>
            <h2 className="text-3xl font-semibold text-slate-900">Utility Elements</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">

            {/* breadcrumb */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md shadow-slate-300/50 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Breadcrumb</p>
              <nav className="flex items-center gap-2 text-sm">
                <a className="text-slate-400 hover:text-[#1428ae] font-medium transition-colors duration-150" href="#">Home</a>
                <span className="text-slate-300">/</span>
                <a className="text-slate-400 hover:text-[#1428ae] font-medium transition-colors duration-150" href="#">Catalog</a>
                <span className="text-slate-300">/</span>
                <span className="text-[#1428ae] font-semibold">Property Details</span>
              </nav>
            </div>

            {/* pagination */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md shadow-slate-300/50 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pagination</p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">← Prev</button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${n === 1 ? "bg-[#1428ae] text-white shadow-lg shadow-[#1428ae]/45" : "border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-[#1428ae]/30"}`}
                  >
                    {n}
                  </button>
                ))}
                <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">Next →</button>
              </div>
            </div>

            {/* chips / tags */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md shadow-slate-300/50 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Tags & Chips</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs font-medium hover:border-[#1428ae]/40 hover:text-[#1428ae] cursor-pointer transition-all duration-150">Real Estate</span>
                <span className="px-3 py-1.5 rounded-full bg-[#1428ae] text-white text-xs font-semibold cursor-pointer">Residential</span>
                <span className="px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-xs font-medium cursor-pointer">Featured</span>
                <span className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs font-medium cursor-pointer hover:border-[#1428ae]/40 transition-all duration-150">Condo</span>
                <span className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs font-medium cursor-pointer hover:border-[#1428ae]/40 transition-all duration-150">House & Lot</span>
              </div>
            </div>

            {/* alerts */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md shadow-slate-300/50 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Alerts</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-emerald-800 font-medium">Changes saved successfully.</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <p className="text-sm text-amber-800 font-medium">Approval pending from admin.</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-[#1428ae]/20 bg-[#1428ae]/5 px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-[#1428ae] flex-shrink-0" />
                  <p className="text-sm text-[#1428ae] font-medium">New update available for your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BUTTON SHOWCASE ──────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">08 — Actions</p>
            <h2 className="text-3xl font-semibold text-slate-900">Button System</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-md shadow-slate-300/50 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Variants</p>
              <div className="flex flex-wrap gap-4">
                <button className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold shadow-lg shadow-[#1428ae]/40 hover:bg-[#1020a0] hover:shadow-xl hover:shadow-[#1428ae]/50 transition-all duration-200">Primary</button>
                <button className="px-7 py-3 rounded-xl bg-[#f59e0b] text-slate-900 font-semibold shadow-lg shadow-amber-400/50 hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/60 transition-all duration-200">Accent</button>
                <button className="px-7 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold shadow-md shadow-slate-300/60 hover:bg-slate-50 hover:shadow-lg hover:border-[#1428ae]/30 transition-all duration-200">Secondary</button>
                <button className="px-7 py-3 rounded-xl border border-[#1428ae]/30 text-[#1428ae] font-semibold hover:bg-[#1428ae]/5 transition-all duration-200">Outline</button>
                <button className="px-7 py-3 rounded-xl text-slate-400 font-semibold hover:text-[#1428ae] transition-all duration-200">Ghost</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-3 py-1.5 rounded-lg bg-[#1428ae] text-white text-xs font-semibold">XS Button</button>
                <button className="px-5 py-2 rounded-lg bg-[#1428ae] text-white text-sm font-semibold">SM Button</button>
                <button className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold">MD Button</button>
                <button className="px-9 py-4 rounded-xl bg-[#1428ae] text-white text-lg font-semibold">LG Button</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">States</p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold opacity-30 cursor-not-allowed" disabled>Disabled</button>
                <button className="px-7 py-3 rounded-xl bg-[#1428ae] text-white font-semibold flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Loading
                </button>
                <button className="px-7 py-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  Success
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="border-t border-slate-200 pt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-base font-bold text-slate-800">HomesPH Design System</p>
              <p className="text-sm text-slate-400">Pattern library · v2.0 · March 2026</p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1428ae]/8 text-[#1428ae] text-xs font-semibold">Tailwind CSS</span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">Next.js</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">React</span>
            </div>
          </div>
        </footer>

      </div>
    </main>
  )
}
