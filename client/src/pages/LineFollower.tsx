import { motion } from "framer-motion";
import {
  Cpu,
  Cable,
  BookOpen,
  Code2,
  Play,
  HelpCircle,
  Sliders,
  Sparkles,
  Gauge,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import ComponentCard from "../components/ComponentCard";
import FAQAccordion from "../components/FAQAccordion";
import SectionHeader from "../components/SectionHeader";

const components = [
  {
    name: "Arduino UNO",
    nameKh: "អាដូអ៊ីណូ UNO",
    description: "ក្ដារបញ្ជាមេ ។",
    emoji: "🔲",
  },
  {
    name: "IR Sensor x5",
    nameKh: "IR Sensor ៥",
    description: "Sensor ៥ ដើម្បីរកបន្ទាត់ ។",
    emoji: "👁️",
  },
  {
    name: "L298N Motor Driver",
    nameKh: "Motor Driver",
    description: "ដំណើរការម៉ូទ័រ ។",
    emoji: "⚡",
  },
  {
    name: "DC Motors x2",
    nameKh: "ម៉ូទ័រ DC ២",
    description: "ម៉ូទ័រ DC ២ ។",
    emoji: "🔄",
  },
  {
    name: "Battery",
    nameKh: "ថ្ម",
    description: "ផ្គត់ផ្គង់ថាមពល ។",
    emoji: "🔋",
  },
];

const arduinoCode = `
int ENA=3; 
int in3=4 ;
int in4=5;  
int in1=8;  
int in2=10;
int ENB=11;

float lasterror;
long point[]={10,100,200,300,390};
long Setpoint=200;
long val[5];

int pin[]={A0,A1,A2,A3,A4};
int speedavg=200;
int maxspeed=75;
float kp=4;
float kd=95;
float last=0;
float lasterr=0;
void setup() {
    pinMode(3,OUTPUT);
    pinMode(4,OUTPUT);
    pinMode(5,OUTPUT);
    pinMode(8,OUTPUT);
    pinMode(10,OUTPUT);
    pinMode(11,OUTPUT);
    digitalWrite(3,1);
    digitalWrite(11,1);
}
void value()
{
    for(int i=0;i<5;i++)
    {
        val[i]=analogRead(pin[i]);
    }
}
double geterror()
{
    double a,b;
    value();
    if(val[0]<450&&val[1]<450&&val[2]<450&&val[3]<450&&val[4]<450)
    {
         if(last>Setpoint)
          return 390;
         else
          return 10;
    }
    else 
    {
      a=val[0]*point[0]+val[1]*point[1]+val[2]*point[2]+
      val[3]*point[3]+val[4]*point[4];
      b=val[0]+val[1]+val[2]+val[3]+val[4];
      last=a/b;
      return a/b;
    }
}
void loop() {
          float o=0.0;
          float error=0.0;
          float right,left;
          error=geterror()-Setpoint;
          //Serial.println(lasterr);
          o=kp*error+kd*(error-lasterr);
          lasterr=error;
    
          right=speedavg-o;
          left=speedavg+o;
          if(right>speedavg)
            right=speedavg;
          if(left>speedavg)
            left=speedavg;  
          if(right>0 && left>0)
          {
            analogWrite(in1,right);
            analogWrite(in2,0);
            analogWrite(in3,left);
            analogWrite(in4,0);
          }
          if(right<0 && left>0)
          {
             right=(right/6)*(-1);
             analogWrite(in1,0);
             analogWrite(in2,right);
             analogWrite(in3,left);
             analogWrite(in4,0);;
             error=0;
          } 
          if(error=0)
          {
            analogWrite(in1,maxspeed);
            analogWrite(in2,0);
            analogWrite(in3,maxspeed);
            analogWrite(in4,0);
          }   
          if(right>0 && left<0)
          {
            left=(left/6)*(-1);
            analogWrite(in1,right);
            analogWrite(in2,0);
            analogWrite(in3,0);
            analogWrite(in4,left);
            error=0;
          }
     if(val[0]>450&&val[1]>450&&val[2]>450&&val[3]>450&&val[4]>450)
     {
        analogWrite(in1,0);
        analogWrite(in2,0);
        analogWrite(in3,0);
        analogWrite(in4,0);
     }
}
`;

const faqItems = [
  {
    question: "ហេតុអ្វីបានជា PID មិនដំណើរការ?",
    answer:
      "ចាប់ផ្តើមដោយ Kp តូច ។ ប្រសិនបើ Oscillation ច្រើន បន្ថែម Kd ។ ត្រូតពិនិត្យ Sensor Threshold ។",
  },
  {
    question: "ហេតុអ្វីបានជារ៉ូបូតចេញពីបន្ទាត់?",
    answer:
      "ពិនិត្យ Sensor Calibration ។ ត្រូប្រាកដថា IR Sensor ស្ថិតនៅខ្ពស់ 1-2cm ពីដី ។ ពិនិត្យ baseSpeed ។",
  },
  {
    question: "ហេតុអ្វីបានជារ៉ូបូតបង្វិលច្រើន?",
    answer: "Kp ខ្ពស់ពេក ។ ថយ Kp ។ ប្រសិនបើ Oscillation នៅតែមាន បន្ថែម Kd ។",
  },
];

// ── PID Line Follower Simulation ──
function LineFollowerSimulation({ kp, kd }: { kp: number; kd: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [sensorStates, setSensorStates] = useState([
    false,
    false,
    true,
    false,
    false,
  ]);
  const [errorVal, setErrorVal] = useState(0);
  const [pidOutput, setPidOutput] = useState(0);
  const animRef = useRef<number>(0);
  const stateRef = useRef({
    x: 200,
    y: 280,
    angle: -90,
    speed: 1.5,
    lastError: 0,
    wobble: 0,
  });
  const kpRef = useRef(kp);
  const kdRef = useRef(kd);

  useEffect(() => {
    kpRef.current = kp;
  }, [kp]);
  useEffect(() => {
    kdRef.current = kd;
  }, [kd]);

  // Generate figure-8 path points
  const pathPoints: { x: number; y: number }[] = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.05) {
    pathPoints.push({
      x: 200 + 120 * Math.sin(t),
      y: 150 + (80 * Math.sin(2 * t)) / 2,
    });
  }

  function getLineDistance(x: number, y: number): number {
    let minDist = Infinity;
    for (const pt of pathPoints) {
      const d = Math.sqrt((x - pt.x) ** 2 + (y - pt.y) ** 2);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  function getSensorReadings(x: number, y: number, angle: number): boolean[] {
    const sensorOffsets = [-20, -10, 0, 10, 20];
    const perpAngle = angle + 90;
    const perpRad = (perpAngle * Math.PI) / 180;
    return sensorOffsets.map(offset => {
      const sx = x + Math.cos(perpRad) * offset;
      const sy = y + Math.sin(perpRad) * offset;
      return getLineDistance(sx, sy) < 8;
    });
  }

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function draw() {
      if (!canvas) return;
      const W = canvas.width,
        H = canvas.height;
      const s = stateRef.current;

      // Sensor readings
      const sensors = getSensorReadings(s.x, s.y, s.angle);
      setSensorStates(sensors);

      // PID
      const weights = [-2, -1, 0, 1, 2];
      let position = 0;
      let total = 0;
      sensors.forEach((on, i) => {
        if (on) {
          position += weights[i];
          total++;
        }
      });
      const error = total > 0 ? position / total : s.lastError;
      const correction =
        kpRef.current * error + kdRef.current * (error - s.lastError);
      s.lastError = error;

      setErrorVal(Math.round(error * 10) / 10);
      setPidOutput(Math.round(correction * 10) / 10);

      // Steer with smoother response
      s.wobble += (correction * 0.15 - s.wobble) * 0.08;
      s.angle += correction * 1.2 + s.wobble * 0.08;
      const rad = (s.angle * Math.PI) / 180;
      s.x += Math.cos(rad) * (s.speed + Math.abs(correction) * 0.01);
      s.y += Math.sin(rad) * (s.speed + Math.abs(correction) * 0.01);

      // Wrap
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      // Draw background
      ctx.fillStyle = "oklch(0.08 0.01 260)";
      ctx.fillRect(0, 0, W, H);

      // Draw path (white line on black)
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      pathPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Glow trail
      ctx.strokeStyle = "oklch(0.75 0.18 195 / 0.25)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(rad) * 14, s.y - Math.sin(rad) * 14);
      ctx.stroke();

      // Draw car
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(rad);

      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.95)";
      ctx.shadowColor = "oklch(0.62 0.22 255)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(-12, -8, 24, 16, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "oklch(0.12 0.015 260)";
      ctx.fillRect(-10, -6, 5, 3);
      ctx.fillRect(5, -6, 5, 3);
      ctx.fillRect(-10, 3, 5, 3);
      ctx.fillRect(5, 3, 5, 3);

      // Sensors
      const sensorOffsets = [-20, -10, 0, 10, 20];
      const perpRad = Math.PI / 2;
      sensorOffsets.forEach((offset, i) => {
        const sx = Math.cos(perpRad) * offset + 8;
        const sy = Math.sin(perpRad) * offset;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = sensors[i]
          ? "oklch(0.75 0.18 195)"
          : "oklch(0.40 0.01 260)";
        ctx.fill();
      });

      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [running]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-primary" />
          <span className="text-sm font-medium font-['Battambang']">
            Line Follower Testing
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!running) {
              stateRef.current = {
                x: 200,
                y: 280,
                angle: -90,
                speed: 1.5,
                lastError: 0,
                wobble: 0,
              };
            }
            setRunning(r => !r);
          }}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium font-['Battambang'] transition-colors ${
            running
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-primary/20 text-primary border border-primary/30"
          }`}
        >
          {running ? "⏹ ឈប់" : "▶ ចាប់ផ្តើម"}
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-['Inter']">
              Sensors:
            </span>
            <div className="flex gap-1">
              {sensorStates.map((on, i) => (
                <span
                  key={i}
                  className={`w-4 h-4 rounded-sm text-[9px] flex items-center justify-center font-mono ${
                    on
                      ? "bg-cyan-400 text-black"
                      : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {on ? "1" : "0"}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <Gauge size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground font-['Inter']">
              Error:
            </span>
            <span
              className={`text-sm font-mono font-bold ${errorVal > 0 ? "text-yellow-400" : errorVal < 0 ? "text-blue-400" : "text-green-400"}`}
            >
              {errorVal}
            </span>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs text-muted-foreground font-['Inter']">
              PID:
            </span>
            <span className="text-sm font-mono font-bold text-primary">
              {pidOutput}
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="rounded-lg border border-white/10 w-full max-w-md"
        />
        <p className="text-xs text-muted-foreground mt-2 font-['Hanuman']">
          ចុច "ចាប់ផ្តើម" ។ Sensor ពណ៌ cyan = ស្ថិតនៅលើបន្ទាត់ ។ លៃតម្រូវ Kp/Kd
          ខាងលើ ដើម្បីឱ្យរថយន្តដើរល្អជាង។
        </p>
      </div>
    </div>
  );
}

export default function LineFollower() {
  const [kp, setKp] = useState(1.5);
  const [kd, setKd] = useState(0.8);

  return (
    <div className="min-h-screen">
      <div className="relative py-12 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-green-600/10 to-transparent" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="pin-badge">Page 4</span>
            <span className="pin-badge">PID Tracking</span>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold font-['Battambang'] text-foreground mb-2">
                Line Follower Robot
              </h1>
              <p className="text-muted-foreground font-['Hanuman'] max-w-2xl">
                Line Follower with PID Control — 5x IR Sensors and smooth
                steering feedback
              </p>
            </div>
            <div className="glass-card px-4 py-3 flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-400">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Stable tracking
                </p>
                <p className="text-xs text-muted-foreground">
                  Adjust KP and KD for better motion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 space-y-14">
        <section>
          <SectionHeader icon={Cpu} title="សមាសភាគ" subtitle="Components" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {components.map((c, i) => (
              <ComponentCard key={c.name} {...c} delay={i * 0.06} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            icon={Cable}
            title="ការភ្ជាប់ Pin"
            subtitle="Wiring"
            accent="cyan"
          />
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">
                    ប្រភព
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">
                    គោលដៅ
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Arduino A0", "IR Sensor 1 (Far Left)"],
                  ["Arduino A1", "IR Sensor 2 (Left)"],
                  ["Arduino A2", "IR Sensor 3 (Center)"],
                  ["Arduino A3", "IR Sensor 4 (Right)"],
                  ["Arduino A4", "IR Sensor 5 (Far Right)"],
                  ["Arduino Pin 2-5", "L298N IN1-IN4"],
                  ["Arduino Pin 9,10", "L298N ENA, ENB"],
                ].map(([from, to], i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3"
                  >
                    <td className="px-4 py-2.5">
                      <span className="pin-badge">{from}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="pin-badge">{to}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeader
            icon={BookOpen}
            title="ការពន្យល់ PID"
            subtitle="PID Control explained in Khmer"
          />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "P (Proportional)",
                content:
                  "Kp គ្រប់គ្រងការបង្វិលដោយផ្ទាល់ ។ Error ខ្ពស់ = បង្វិលច្រើន ។ Kp ខ្ពស់ = ឆ្លើយតបលឿន ប៉ុន្តែ Oscillation ។",
              },
              {
                title: "D (Derivative)",
                content:
                  "Kd ស្ទាក់ Oscillation ។ វាប្រៀបធៀប Error បច្ចុប្បន្ន ជាមួយ Error ចុងក្រោយ ។ Kd ខ្ពស់ = ស្ថិរភាព ។",
              },
              {
                title: "ការលៃតម្រូវ",
                content:
                  "ចាប់ផ្តើម Kp = 1.0, Kd = 0 ។ បន្ថែម Kp រហូតដល់ Oscillation ។ ហើយបន្ថែម Kd ដើម្បីស្ទាក់ ។",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card glow-card p-5"
              >
                <h3 className="text-sm font-bold font-['Battambang'] text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-['Hanuman'] leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PID Controls */}
        <section>
          <SectionHeader
            icon={Sliders}
            title="PID Controls"
            subtitle="Adjust Kp and Kd values"
            accent="cyan"
          />
          <div className="glass-card p-6">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-['Battambang'] text-foreground">
                    Kp (Proportional)
                  </label>
                  <span className="text-sm font-mono text-primary font-bold">
                    {kp.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={kp}
                  onChange={e => setKp(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 font-['Inter']">
                  <span>0 (ខ្សោយ)</span>
                  <span>5 (ខ្លាំង)</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-['Battambang'] text-foreground">
                    Kd (Derivative)
                  </label>
                  <span className="text-sm font-mono text-cyan-400 font-bold">
                    {kd.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={kd}
                  onChange={e => setKd(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 font-['Inter']">
                  <span>0 (គ្មាន)</span>
                  <span>3 (ស្ទាក់)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            icon={Code2}
            title="កូដ Arduino"
            subtitle="Editable source code"
            accent="cyan"
          />
          <CodeEditor
            initialCode={arduinoCode}
            title="Line Follower — PID Control"
          />
        </section>

        <section>
          <SectionHeader
            icon={Play}
            title="Testing"
            subtitle="Canvas simulation with PID"
          />
          <LineFollowerSimulation kp={kp} kd={kd} />
        </section>

        <section>
          <SectionHeader
            icon={HelpCircle}
            title="សំណួរ & ចម្លើយ"
            subtitle="FAQ"
            accent="gold"
          />
          <FAQAccordion items={faqItems} />
        </section>
      </div>
    </div>
  );
}
