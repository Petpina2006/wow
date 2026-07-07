
import { motion } from "framer-motion";
import {
  Car,
  Radio,
  Video,
  GitBranch,
  ArrowRight,
  Cpu,
  Wifi,
  Zap,
  BookOpen,
  Users,
  Star,
} from "lucide-react";
import { Link } from "wouter";

const projects = [
  {
    path: "/normal-car",
    icon: Car,
    title: "Normal RC Car",
    titleEn: "Normal RC Car",
    desc: "ស្វែងយល់ពីរថយន្ត RC ជាមួយ Arduino UNO និង Bluetooth HC-05 ។",
    tag: "MODULE-01",
    image: "./public/Img/normal_car.png",
  },
  {
    path: "/ultrasonic-car",
    icon: Radio,
    title: "RC + Ultrasonic",
    titleEn: "Ultrasonic Car",
    desc: "រថយន្ត RC ជាមួយ Sensor HC-SR04 សម្រាប់ការជៀសវាងឧបសគ្គ ។",
    tag: "MODULE-02",
    image: "./public/Img/ultrasonic.png",
  },
  {
    path: "/streaming-car",
    icon: Video,
    title: "RC Streaming",
    titleEn: "ESP32-CAM Car",
    desc: "ការបញ្ជាតាមរយៈ WiFi ជាមួយ ESP32-CAM សម្រាប់ការផ្សាយបន្តផ្ទាល់ ។",
    tag: "MODULE-03",
    image: "./public/Img/streaming.png",
  },
  {
    path: "/line-follower",
    icon: GitBranch,
    title: "Line Follower",
    titleEn: "Line Follower Robot",
    desc: "រ៉ូបូតដើរតាមបន្ទាត់ជាមួយ IR Sensor ៥ ដោយប្រើ PID Control ។",
    tag: "MODULE-04",
    image: "./public/Img/line_follower.png",
  },
];

const stats = [
  { value: "4", label: "គម្រោង", icon: Cpu },
  { value: "20+", label: "សមាសភាគ", icon: Zap },
  { value: "6", label: "Pages", icon: Star },
  { value: "3", label: "សមាជិកក្រុម", icon: Users },
];

const features = [
  {
    icon: BookOpen,
    title: "ការបង្រៀនជាភាសាខ្មែរ",
    desc: "មាតិកាទាំងអស់ត្រូវបានបង្ហាញជាភាសាខ្មែរ ដើម្បីឱ្យងាយស្រួលយល់។",
  },
  {
    icon: Cpu,
    title: "Testing RC car in Browser",
    desc: "សាកល្បងការបញ្ជារថយន្ត RC ដោយផ្ទាល់នៅក្នុង Browser ។",
  },
  {
    icon: Wifi,
    title: "កូដ Arduino ",
    desc: "ទទួលបានកូដ Arduino  ដែលអាចប្រើបាននៅក្នុងគម្រោងពិត។",
  },
  {
    icon: Zap,
    title: "ការបង្ហាញ PID Control",
    desc: "ស្វែងយល់ពី PID Algorithm ជាមួយការធ្វើការសាកល្បង Line Follower Robot។",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/manus-storage/hero-banner_c7594441.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

        {/* Circuit grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(oklch(0.62 0.22 255) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.62 0.22 255) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 container py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-['Inter'] font-medium">
                Royal University of Phnom Penh — Robotics Lab
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold font-['Battambang'] text-foreground leading-tight mb-4"
            >
              <span className="text-primary">RC_CAR</span>
              <br />
              <span className="text-3xl md:text-4xl">Project</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-foreground/80 font-['Hanuman'] leading-relaxed mb-8 max-w-xl"
            >
              ស្វែងយល់ពីប្រព័ន្ធរថយន្ត RC ឆ្លាតវៃ ដោយប្រើ Arduino និង ESP32 ។
              រៀនពីការភ្ជាប់សមាសភាគ ការសរសេរកូដ និងការអនុវត្ត ។
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/normal-car">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium font-['Battambang'] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  ចាប់ផ្តើមរៀន
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/group">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 glass-card border-white/20 text-foreground rounded-xl font-medium font-['Battambang'] hover:bg-white/10 transition-colors"
                >
                  <Users size={16} />
                  មើលក្រុម
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating car illustration */}
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/public/Img/car.png"
            alt="RC Car"
            className="w-72 h-72 object-contain opacity-80"
          />
        </motion.div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-10 border-y border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-30" />
        <div className="container relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="lab-module">SYS-STATUS</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="glass-card p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground font-['JetBrains_Mono',monospace]">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-['Battambang']">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className="py-14">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="lab-module">LAB-MODULES</span>
                <div className="flex-1 h-px bg-linear-to-r from-primary/30 to-transparent" />
              </div>
              <h2 className="text-3xl font-bold font-['Battambang'] text-foreground">
                គម្រោងតាំងអស់
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-['Hanuman'] hidden md:block">
              ជ្រើររើសគម្រោង
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, i) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.path}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={project.path}>
                    <div className="glass-card glow-card p-5 cursor-pointer group relative overflow-hidden">
                      {/* Circuit grid bg */}
                      <div className="absolute inset-0 circuit-bg opacity-40" />
                      {/* Top row: tag + icon */}
                      <div className="relative flex items-center justify-between mb-4">
                        <span className="data-badge">{project.tag}</span>
                        <div className="p-2.5 rounded-lg bg-primary/15 text-primary">
                          <Icon size={20} />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="relative flex items-end gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold font-['Battambang'] text-foreground mb-1">
                            {project.title}
                          </h3>
                          <p className="text-[10px] text-primary font-['JetBrains Mono'] mb-2 tracking-wider uppercase">
                            {project.titleEn}
                          </p>
                          <p className="text-sm text-foreground/70 font-['Hanuman'] leading-relaxed">
                            {project.desc}
                          </p>
                        </div>
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.titleEn}
                            className="w-16 h-16 object-contain opacity-60 group-hover:opacity-90 transition-opacity flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="relative flex items-center gap-1 mt-4 pt-3 border-t border-white/6 text-xs font-['Inter'] text-muted-foreground group-hover:text-primary transition-colors">
                        <span>ស្វែងយល់បន្ថែម</span>
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-14 border-t border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 circuit-bg opacity-20" />
        <div className="container relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="lab-module">CAPABILITIES</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <h2 className="text-3xl font-bold font-['Battambang'] text-foreground mb-8">
            លក្ខណៈពិសេស
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="glass-card p-5 group hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold font-['Battambang'] text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-['Hanuman'] leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-['Hanuman']">
            © 2026 Royal University of Phnom Penh — Robotics Lab
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-['Inter']">
            RC_CAR Project · Arduino · ESP32 · Robotics Education
          </p>
        </div>
      </footer>
    </div>
  );
}
