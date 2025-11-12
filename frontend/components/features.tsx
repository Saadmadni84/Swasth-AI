import { HeartPulse, Languages, MapPin, Stethoscope } from "lucide-react";

const features = [
  {
    name: "AI-Powered 3D Explanation",
    description:
      "Our AI analyzes the disease and creates a 3D explanation video to it.",
    icon: HeartPulse,
  },
  {
    name: "Multilingual Support",
    description:
      "Break language barriers with real-time translation, ensuring everyone can access medical help in their preferred language.",
    icon: Languages,
  },
  {
    name: "Real Time Alert",
    description:
      "Our AI helps to create a real time alert warning to consult doctor if it identifies serious symptoms.",
    icon: MapPin,
  },
  {
    name: "Swasth Bank",
    description:
      "Keep a record for your family insights at one place.",
    icon: Stethoscope,
  },
];

export default function Features() {
  return (
    <section className="container px-4 space-y-12 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-2xl leading-[1.2] sm:text-3xl md:text-5xl text-gray-900">
          Revolutionizing Rural Healthcare
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-700">
          Empowering rural communities with AI-driven medical alerts, multilingual support, and instant 3D Explanation and awareness.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900" />
              <h3 className="font-bold text-lg sm:text-xl text-gray-900">{feature.name}</h3>
            </div>
            <p className="mt-2 text-sm sm:text-base text-gray-700">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

