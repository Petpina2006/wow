import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  Cable,
  BookOpen,
  Code2,
  Play,
  HelpCircle,
} from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import CodeEditor from "../components/CodeEditor";
import ComponentCard from "../components/ComponentCard";
import Controller from "../components/Controller";
import FAQAccordion from "../components/FAQAccordion";
import SectionHeader from "../components/SectionHeader";

const components = [
  {
    name: "Arduino UNO",
    nameKh: "អាដូអ៊ីណូ UNO",
    description: "ក្ដារបញ្ជាមេ ដែលគ្រប់គ្រងការដំណើរការទាំងអស់នៃរថយន្ត RC ។",
    emoji: "🔲",
  },
  {
    name: "L298N Motor Driver",
    nameKh: "ម៉ូទ័រ Driver L298N",
    description: "ដំណើរការម៉ូទ័រ DC ២ ដោយទទួលសញ្ញាពី Arduino ។",
    emoji: "⚡",
  },
  {
    name: "DC Motor",
    nameKh: "ម៉ូទ័រ DC",
    description: "ម៉ូទ័រ DC ២ ដែលបង្វិលកង់ខាងឆ្វេង និងខាងស្តាំ ។",
    emoji: "🔄",
  },
  {
    name: "Battery 9V",
    nameKh: "ថ្ម 9V",
    description: "ផ្គត់ផ្គង់ថាមពលដល់ Arduino និង Motor Driver ។",
    emoji: "🔋",
  },
  {
    name: "Bluetooth HC-05",
    nameKh: "Bluetooth HC-05",
    description: "ទទួលសញ្ញា Bluetooth ពី Smartphone ដើម្បីបញ្ជារថយន្ត ។",
    emoji: "📡",
  },
  {
    name: "Servo Motor",
    nameKh: "ម៉ូទ័រ Servo",
    description: "ប្រើសម្រាប់ការបង្វិលទិសដៅ ឬការបើក/បិទ ។",
    emoji: "🔧",
  },
  {
    name: "Wheels",
    nameKh: "កង់",
    description: "កង់ ៤ ដែលភ្ជាប់ជាមួយ DC Motor ។",
    emoji: "⭕",
  },
  {
    name: "Chassis",
    nameKh: "ស៊ីស",
    description: "ស្ទ្រង់ (Chassis) ដែលទ្រទ្រង់សមាសភាគទាំងអស់ ។",
    emoji: "🏗️",
  },
];

const arduinoCode = `// RC Car with Bluetooth HC-05
// Arduino UNO + L298N Motor Driver
// Royal University of Phnom Penh

#include <SoftwareSerial.h>

// Bluetooth pins
SoftwareSerial BT(10, 11); // RX, TX

// Motor A (Left)
#define IN1 2
#define IN2 3
#define ENA 9

// Motor B (Right)
#define IN3 4
#define IN4 5
#define ENB 10

int motorSpeed = 200;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  
  BT.begin(9600);
  Serial.begin(9600);
  Serial.println("RC Car Ready!");
  stopCar();
}

void loop() {
  if (BT.available()) {
    char cmd = BT.read();
    Serial.print("Command: ");
    Serial.println(cmd);
    
    switch (cmd) {
      case 'F': moveForward(); break;
      case 'B': moveBackward(); break;
      case 'L': turnLeft(); break;
      case 'R': turnRight(); break;
      case 'S': stopCar(); break;
    }
  }
}

void moveForward() {
  analogWrite(ENA, motorSpeed);
  analogWrite(ENB, motorSpeed);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void moveBackward() {
  analogWrite(ENA, motorSpeed);
  analogWrite(ENB, motorSpeed);
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
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
    question: "ហេតុអ្វីបានជារថយន្តមិនដើរ?",
    answer:
      "ត្រូតពិនិត្យការភ្ជាប់ Motor Driver L298N ។ ត្រូវប្រាកដថា Pin IN1, IN2, IN3, IN4 ត្រូវបានភ្ជាប់ត្រឹមត្រូវ ។ ត្រូតពិនិត្យថ្ម ។",
  },
  {
    question: "ហេតុអ្វីបានជា Bluetooth មិនភ្ជាប់?",
    answer:
      "ត្រូតពិនិត្យ Baud Rate ថាជា 9600 ។ ត្រូប្រាកដថា HC-05 ត្រូវបាន Pair ជាមួយ Smartphone ។ ពិនិត្យ Pin RX/TX ។",
  },
  {
    question: "ហេតុអ្វីបានជាម៉ូទ័រខ្សោយ?",
    answer:
      "ថ្មមានថាមពលទាប ។ ត្រូតពិនិត្យ PWM Value ។ ប្រើថ្ម 9V ឬ 12V ។ ពិនិត្យ ENA, ENB Pin ។",
  },
];
type Direction = "forward" | "backward" | "left" | "right" | "stop";
function CarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCmd, setActiveCmd] = useState<Direction | null>(null);
  const carState = useRef({ x: 200, y: 150, angle: 0, speed: 0 });
  const animRef = useRef<number>(0);
  const cmdRef = useRef<Direction | null>(null);
  const handleCommand = useCallback((dir: Direction) => {
    setActiveCmd(dir);
    cmdRef.current = dir;
    if (dir === "stop") {
      carState.current.speed = 0;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function draw() {
      if (!canvas) return;
      const { x, y, angle, speed } = carState.current;
      const cmd = cmdRef.current;

      // Update physics
      if (cmd === "forward") {
        carState.current.speed = Math.min(speed + 0.3, 3);
        carState.current.x +=
          Math.cos((angle * Math.PI) / 180) * carState.current.speed;
        carState.current.y +=
          Math.sin((angle * Math.PI) / 180) * carState.current.speed;
      } else if (cmd === "backward") {
        carState.current.speed = Math.min(speed + 0.3, 2);
        carState.current.x -=
          Math.cos((angle * Math.PI) / 180) * carState.current.speed;
        carState.current.y -=
          Math.sin((angle * Math.PI) / 180) * carState.current.speed;
      } else if (cmd === "left") {
        carState.current.angle -= 2.5;
      } else if (cmd === "right") {
        carState.current.angle += 2.5;
      } else {
        carState.current.speed = Math.max(speed - 0.2, 0);
        if (carState.current.speed > 0) {
          carState.current.x +=
            Math.cos((angle * Math.PI) / 180) * carState.current.speed;
          carState.current.y +=
            Math.sin((angle * Math.PI) / 180) * carState.current.speed;
        }
      }
      const W = canvas.width,
        H = canvas.height;
      if (carState.current.x < -30) carState.current.x = W + 30;
      if (carState.current.x > W + 30) carState.current.x = -30;
      if (carState.current.y < -30) carState.current.y = H + 30;
      if (carState.current.y > H + 30) carState.current.y = -30;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "oklch(0.12 0.015 260)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "oklch(0.62 0.22 255 / 0.08)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }
      const cx = carState.current.x,
        cy = carState.current.y;
      const ang = (carState.current.angle * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.9)";
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 20, 4);
      ctx.fill();

      ctx.shadowColor = "oklch(0.62 0.22 255)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.3)";
      ctx.beginPath();
      ctx.roundRect(-18, -10, 36, 20, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "oklch(0.25 0.01 260)";
      [
        [-12, -13],
        [12, -13],
        [-12, 13],
        [12, 13],
      ].forEach(([wx, wy]) => {
        ctx.beginPath();
        ctx.roundRect(wx - 5, wy - 3, 10, 6, 2);
        ctx.fill();
      });

      // Front arrow
      ctx.fillStyle = "oklch(0.75 0.18 195)";
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(14, -4);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Speed indicator
      ctx.fillStyle = "oklch(0.62 0.22 255 / 0.8)";
      ctx.font = "11px 'JetBrains Mono'";
      ctx.fillText(
        `Speed: ${carState.current.speed.toFixed(1)} | Angle: ${Math.round(carState.current.angle)}°`,
        10,
        20
      );

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
        <Play size={16} className="text-primary" />
        <span className="text-sm font-medium font-['Battambang']">
          RC Car Testing
        </span>
      </div>
      <div className="p-4 flex flex-col lg:flex-row gap-6 items-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="rounded-lg border border-white/10 w-full max-w-md"
        />
        <Controller onCommand={handleCommand} activeCommand={activeCmd} />
      </div>
    </div>
  );
}

// ── Wiring Diagram ──
function WiringDiagram() {
  const connections = [
    { from: "Arduino Pin 2", to: "L298N IN1", color: "#60a5fa" },
    { from: "Arduino Pin 3", to: "L298N IN2", color: "#60a5fa" },
    { from: "Arduino Pin 4", to: "L298N IN3", color: "#34d399" },
    { from: "Arduino Pin 5", to: "L298N IN4", color: "#34d399" },
    { from: "Arduino Pin 9", to: "L298N ENA", color: "#f59e0b" },
    { from: "Arduino Pin 10", to: "L298N ENB", color: "#f59e0b" },
    { from: "Arduino Pin 10 (RX)", to: "HC-05 TX", color: "#a78bfa" },
    { from: "Arduino Pin 11 (TX)", to: "HC-05 RX", color: "#a78bfa" },
    { from: "Arduino 5V", to: "HC-05 VCC", color: "#f87171" },
    { from: "Arduino GND", to: "L298N GND / HC-05 GND", color: "#6b7280" },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-4 py-3 text-muted-foreground font-['Inter'] font-medium">
                ប្រភព (From)
              </th>
              <th className="text-left px-4 py-3 text-muted-foreground font-['Inter'] font-medium">
                គោលដៅ (To)
              </th>
              <th className="px-4 py-3 text-muted-foreground font-['Inter'] font-medium text-center">
                ពណ៌
              </th>
            </tr>
          </thead>
          <tbody>
            {connections.map((c, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <span className="pin-badge">{c.from}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="pin-badge">{c.to}</span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: c.color }}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function NormalCar() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative py-12 border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="pin-badge">Page 1</span>
          </div>
          <h1 className="text-4xl font-bold font-['Battambang'] text-foreground mb-2">
            រថយន្ត RC ធម្មតា
          </h1>
          <p className="text-muted-foreground font-['Hanuman']">
            Normal RC Car — Arduino UNO + Bluetooth HC-05
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-14">
        {/* Components */}
        <section>
          <SectionHeader
            icon={Cpu}
            title="សមាសភាគ"
            subtitle="Components used in this project"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {components.map((comp, i) => (
              <ComponentCard key={comp.name} {...comp} delay={i * 0.05} />
            ))}
          </div>
        </section>

        {/* Wiring */}
        <section>
          <SectionHeader
            icon={Cable}
            title="ការភ្ជាប់ Pin"
            subtitle="Wiring / Connection diagram"
            accent="cyan"
          />
          <WiringDiagram />
        </section>

        {/* Explanation */}
        <section>
          <SectionHeader
            icon={BookOpen}
            title="ការពន្យល់"
            subtitle="How it works"
          />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "របៀបដំណើរការ",
                content:
                  "រថយន្ត RC ដំណើរការដោយ Arduino UNO ទទួលសញ្ញា Bluetooth ពី Smartphone ។ Arduino ផ្ញើសញ្ញាទៅ L298N Motor Driver ដើម្បីបញ្ជាម៉ូទ័រ DC ។",
              },
              {
                title: "ការបញ្ជា Bluetooth",
                content:
                  "HC-05 ទទួលតួអក្សរ F (ទៅមុខ), B (ថយក្រោយ), L (ឆ្វេង), R (ស្តាំ), S (ឈប់) ។ Arduino ប្រើ SoftwareSerial ដើម្បីអានទិន្នន័យ ។",
              },
              {
                title: "ការបញ្ជាម៉ូទ័រ",
                content:
                  "L298N ទទួលសញ្ញា PWM ពី Arduino ។ IN1/IN2 គ្រប់គ្រងម៉ូទ័រ A ។ IN3/IN4 គ្រប់គ្រងម៉ូទ័រ B ។ ENA/ENB គ្រប់គ្រងល្បឿន ។",
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

        {/* Code Editor */}
        <section>
          <SectionHeader
            icon={Code2}
            title="កូដ Arduino"
            subtitle="Editable source code"
            accent="cyan"
          />
          <CodeEditor
            initialCode={arduinoCode}
            title="RC Car — Bluetooth Control"
          />
        </section>

        {/* Simulation */}
        <section>
          <SectionHeader
            icon={Play}
            title="Testing"
            subtitle="Interactive simulation"
          />
          <CarSimulation />
        </section>

        {/* Q&A */}
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
