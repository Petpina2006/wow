/**
 * Ultrasonic Car page — RC Car with HC-SR04 obstacle avoidance
 * Sections: Components, Wiring, Explanation, Code, Simulation, Q&A
 */
import { motion } from "framer-motion";
import { Cpu, Cable, BookOpen, Code2, Play, HelpCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import ComponentCard from "../components/ComponentCard";
import FAQAccordion from "../components/FAQAccordion";
import SectionHeader from "../components/SectionHeader";

const components = [
  { name: "Arduino UNO", nameKh: "អាដូអ៊ីណូ UNO", description: "ក្ដារបញ្ជាមេ ។", emoji: "🔲" },
  { name: "HC-SR04 Ultrasonic", nameKh: "Ultrasonic HC-SR04", description: "វាស់ចម្ងាយដោយប្រើ Sound Wave ។", emoji: "📡" },
  { name: "L298N Motor Driver", nameKh: "Motor Driver", description: "ដំណើរការម៉ូទ័រ DC ។", emoji: "⚡" },
  { name: "Servo Motor", nameKh: "ម៉ូទ័រ Servo", description: "បង្វិល Sensor ដើម្បីស្កែន ។", emoji: "🔧" },
  { name: "Battery", nameKh: "ថ្ម", description: "ផ្គត់ផ្គង់ថាមពល ។", emoji: "🔋" },
];

const arduinoCode = `// RC Car with Ultrasonic Obstacle Avoidance
// Arduino UNO + HC-SR04 + Servo + L298N
// Royal University of Phnom Penh

#include <Servo.h>

// Ultrasonic pins
#define TRIG_PIN 7
#define ECHO_PIN 8

// Servo
Servo scanServo;
#define SERVO_PIN 6

// Motor pins
#define IN1 2
#define IN2 3
#define IN3 4
#define IN4 5
#define ENA 9
#define ENB 10

int motorSpeed = 180;
int safeDistance = 20; // cm

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  scanServo.attach(SERVO_PIN);
  scanServo.write(90); // Center
  
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  
  Serial.begin(9600);
  delay(500);
}

long measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2; // cm
}

void loop() {
  long dist = measureDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  
  if (dist > safeDistance) {
    moveForward();
  } else {
    stopCar();
    delay(300);
    
    // Scan left
    scanServo.write(160);
    delay(500);
    long leftDist = measureDistance();
    
    // Scan right
    scanServo.write(20);
    delay(500);
    long rightDist = measureDistance();
    
    // Return center
    scanServo.write(90);
    delay(300);
    
    if (leftDist > rightDist) {
      turnLeft();
      delay(400);
    } else {
      turnRight();
      delay(400);
    }
  }
}

void moveForward() {
  analogWrite(ENA, motorSpeed);
  analogWrite(ENB, motorSpeed);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void turnLeft() {
  analogWrite(ENA, motorSpeed);
  analogWrite(ENB, motorSpeed);
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void turnRight() {
  analogWrite(ENA, motorSpeed);
  analogWrite(ENB, motorSpeed);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void stopCar() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}`;

const faqItems = [
  {
    question: "ហេតុអ្វីបានជា Sensor មិនរកឃើញឧបសគ្គ?",
    answer: "ត្រូតពិនិត្យ TRIG_PIN និង ECHO_PIN ។ ត្រូប្រាកដថា Sensor ត្រូវបានភ្ជាប់ 5V ។ ពិនិត្យ safeDistance Value ។",
  },
  {
    question: "ហេតុអ្វីបានជារថយន្តបង្វិលខុស?",
    answer: "ពិនិត្យ leftDist និង rightDist ។ ត្រូប្រាកដថា Servo បង្វិលត្រឹមត្រូវ ។ ពិនិត្យ delay() ។",
  },
  {
    question: "ហេតុអ្វីបានជា Servo មិនដំណើរការ?",
    answer: "ត្រូប្រាកដថា Servo ភ្ជាប់ Pin 6 ។ ពិនិត្យ 5V Power Supply ។ ប្រើ Library Servo.h ។",
  },
];

// ── Obstacle Avoidance Simulation ──
type CarStatus = "moving" | "scanning" | "turning";

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

function UltrasonicSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distance, setDistance] = useState(100);
  const [status, setStatus] = useState<CarStatus>("moving");
  const [running, setRunning] = useState(false);
  const animRef = useRef<number>(0);
  const stateRef = useRef({
    x: 200,
    y: 250,
    angle: -90, // pointing up
    status: "moving" as CarStatus,
    scanAngle: 0,
    scanDir: 1,
    turnTimer: 0,
  });

  const obstacles: Obstacle[] = [
    { x: 160, y: 80, w: 80, h: 20 },
    { x: 60, y: 160, w: 20, h: 80 },
    { x: 300, y: 120, w: 20, h: 80 },
    { x: 140, y: 200, w: 60, h: 20 },
  ];

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function measureDist() {
      const s = stateRef.current;
      const rad = (s.angle * Math.PI) / 180;
      for (let d = 0; d < 200; d += 2) {
        const px = s.x + Math.cos(rad) * d;
        const py = s.y + Math.sin(rad) * d;
        for (const obs of obstacles) {
          if (px >= obs.x && px <= obs.x + obs.w && py >= obs.y && py <= obs.y + obs.h) {
            return d;
          }
        }
      }
      return 200;
    }

    function draw() {
      if (!canvas) return;
      const W = canvas.width, H = canvas.height;
      const s = stateRef.current;

      // Physics
      const dist = measureDist();
      setDistance(Math.round(dist));

      if (s.status === "moving") {
        if (dist > 30) {
          const rad = (s.angle * Math.PI) / 180;
          s.x += Math.cos(rad) * 1.5;
          s.y += Math.sin(rad) * 1.5;
          // Clamp
          s.x = Math.max(20, Math.min(W - 20, s.x));
          s.y = Math.max(20, Math.min(H - 20, s.y));
        } else {
          s.status = "scanning";
          s.scanAngle = 0;
          s.scanDir = 1;
          setStatus("scanning");
        }
      } else if (s.status === "scanning") {
        s.scanAngle += s.scanDir * 2;
        if (s.scanAngle > 60) s.scanDir = -1;
        if (s.scanAngle < -60) {
          s.status = "turning";
          s.turnTimer = 40;
          s.angle += 90;
          setStatus("turning");
        }
      } else if (s.status === "turning") {
        s.turnTimer--;
        if (s.turnTimer <= 0) {
          s.status = "moving";
          setStatus("moving");
        }
      }

      // Draw
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "oklch(0.12 0.015 260)";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "oklch(0.62 0.22 255 / 0.06)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 30) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 30) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Obstacles
      obstacles.forEach((obs) => {
        ctx.fillStyle = "oklch(0.65 0.18 25 / 0.7)";
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 4);
        ctx.fill();
        ctx.strokeStyle = "oklch(0.65 0.18 25 / 0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Sensor cone
      const sensorAngle = s.angle + (s.status === "scanning" ? s.scanAngle : 0);
      const rad = (sensorAngle * Math.PI) / 180;
      const coneAngle = 0.25;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, Math.min(dist, 150), rad - coneAngle, rad + coneAngle);
      ctx.closePath();
      ctx.fillStyle = "oklch(0.75 0.18 195 / 0.15)";
      ctx.fill();
      ctx.strokeStyle = "oklch(0.75 0.18 195 / 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Distance line
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + Math.cos(rad) * Math.min(dist, 150), s.y + Math.sin(rad) * Math.min(dist, 150));
      ctx.strokeStyle = dist < 30 ? "oklch(0.65 0.18 25)" : "oklch(0.75 0.18 195)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Car
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.angle * Math.PI) / 180);

      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.9)";
      ctx.shadowColor = "oklch(0.62 0.22 255)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(-12, -8, 24, 16, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Wheels
      ctx.fillStyle = "oklch(0.25 0.01 260)";
      [[-8, -10], [8, -10], [-8, 10], [8, 10]].forEach(([wx, wy]) => {
        ctx.beginPath();
        ctx.roundRect(wx - 3, wy - 2, 6, 4, 1);
        ctx.fill();
      });

      // Sensor on front
      ctx.fillStyle = "oklch(0.75 0.18 195)";
      ctx.beginPath();
      ctx.arc(14, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // HUD
      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.8)";
      ctx.font = "11px 'JetBrains Mono'";
      ctx.fillText(`Distance: ${Math.round(dist)} cm`, 10, 20);
      ctx.fillText(`Status: ${s.status}`, 10, 36);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [running]);

  const handleToggle = () => {
    if (!running) {
      stateRef.current = { x: 200, y: 250, angle: -90, status: "moving", scanAngle: 0, scanDir: 1, turnTimer: 0 };
      setStatus("moving");
    }
    setRunning((r) => !r);
  };

  const statusColors: Record<CarStatus, string> = {
    moving: "text-green-400",
    scanning: "text-yellow-400",
    turning: "text-blue-400",
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-primary" />
          <span className="text-sm font-medium font-['Battambang']">ការក្លែងធ្វើ Obstacle Avoidance</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium font-['Battambang'] transition-colors ${
            running
              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
          }`}
        >
          {running ? "⏹ ឈប់" : "▶ ចាប់ផ្តើម"}
        </motion.button>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-['Inter']">ចម្ងាយ:</span>
            <span className="text-sm font-bold font-mono text-cyan-400">{distance} cm</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-['Inter']">ស្ថានភាព:</span>
            <span className={`text-sm font-bold font-['Battambang'] ${statusColors[status]}`}>
              {status === "moving" ? "ដើរ" : status === "scanning" ? "ស្កែន" : "បង្វិល"}
            </span>
          </div>
          {distance < 30 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card px-4 py-2 border border-red-500/30"
            >
              <span className="text-xs text-red-400 font-['Battambang']">⚠ ឧបសគ្គ!</span>
            </motion.div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="rounded-lg border border-white/10 w-full max-w-md"
        />
        <p className="text-xs text-muted-foreground mt-2 font-['Hanuman']">
          ចុច "ចាប់ផ្តើម" ដើម្បីមើលរថយន្តជៀសវាងឧបសគ្គ ។ ពណ៌ក្រហម = ឧបសគ្គ ។
        </p>
      </div>
    </div>
  );
}

export default function UltrasonicCar() {
  return (
    <div className="min-h-screen">
      <div className="relative py-12 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-transparent" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="pin-badge">Page 2</span>
          </div>
          <h1 className="text-4xl font-bold font-['Battambang'] text-foreground mb-2">
            RC Car + Ultrasonic
          </h1>
          <p className="text-muted-foreground font-['Hanuman']">
            RC Car with Ultrasonic Sensor — Obstacle Avoidance
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-14">
        <section>
          <SectionHeader icon={Cpu} title="សមាសភាគ" subtitle="Components" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {components.map((c, i) => <ComponentCard key={c.name} {...c} delay={i * 0.06} />)}
          </div>
        </section>

        <section>
          <SectionHeader icon={Cable} title="ការភ្ជាប់ Pin" subtitle="Wiring" accent="cyan" />
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">ប្រភព</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-['Inter']">គោលដៅ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Arduino Pin 7", "HC-SR04 TRIG"],
                  ["Arduino Pin 8", "HC-SR04 ECHO"],
                  ["Arduino Pin 6", "Servo Signal"],
                  ["Arduino Pin 2-5", "L298N IN1-IN4"],
                  ["Arduino Pin 9,10", "L298N ENA, ENB"],
                  ["Arduino 5V", "HC-SR04 VCC / Servo VCC"],
                  ["Arduino GND", "All GND"],
                ].map(([from, to], i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-4 py-2.5"><span className="pin-badge">{from}</span></td>
                    <td className="px-4 py-2.5"><span className="pin-badge">{to}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeader icon={BookOpen} title="ការពន្យល់" subtitle="Obstacle avoidance explained in Khmer" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "របៀបជៀសវាងឧបសគ្គ",
                content: "រថយន្តប្រើ HC-SR04 វាស់ចម្ងាយ ។ ប្រសិនបើចម្ងាយ < 20cm Arduino ឈប់ ហើយ Servo ស្កែនឆ្វេង-ស្តាំ ។ ទិសដៅដែលមានចម្ងាយច្រើនជាងនឹងត្រូវបានជ្រើស ។",
              },
              {
                title: "ការស្កែន Servo",
                content: "Servo បង្វិល 160° (ឆ្វេង) ហើយ 20° (ស្តាំ) ។ Arduino វាស់ចម្ងាយនៅម្ខាងៗ ។ ប្រៀបធៀបចម្ងាយ ហើយជ្រើសទិសដៅដែលស្ងួតជាង ។",
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
                <h3 className="text-sm font-bold font-['Battambang'] text-primary mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-['Hanuman'] leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader icon={Code2} title="កូដ Arduino" subtitle="Editable source code" accent="cyan" />
          <CodeEditor initialCode={arduinoCode} title="Ultrasonic Obstacle Avoidance" />
        </section>

        <section>
          <SectionHeader icon={Play} title="ការក្លែងធ្វើ" subtitle="Canvas simulation" />
          <UltrasonicSimulation />
        </section>

        <section>
          <SectionHeader icon={HelpCircle} title="សំណួរ & ចម្លើយ" subtitle="FAQ" accent="gold" />
          <FAQAccordion items={faqItems} />
        </section>
      </div>
    </div>
  );
}
