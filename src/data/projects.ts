export type Project = {
  num: string;
  name: string;
  tech: string[];
  year: string;
  category: "Full Stack" | "FRONTEND" | "BACKEND";
  image: string;
};

export const projects: Project[] = [
  {
    num: "01",
    name: "E-Commerce Platform",
    tech: ["Spring Boot", "React", "PostgreSQL", "Redis"],
    year: "2024",
    category: "Full Stack",
    image: "https://picsum.photos/seed/ift-ecom/600/440",
  },
  {
    num: "02",
    name: "Hospital Management System",
    tech: ["Spring Boot", "Angular", "MySQL"],
    year: "2023",
    category: "Full Stack",
    image: "https://picsum.photos/seed/ift-hospital/600/440",
  },
  {
    num: "03",
    name: "Real-Time Chat App",
    tech: ["WebSocket", "React", "Spring Boot"],
    year: "2024",
    category: "Full Stack",
    image: "https://picsum.photos/seed/ift-chat/600/440",
  },
  {
    num: "04",
    name: "OpenAI API Integration",
    tech: ["Spring Boot", "React", "GPT-4"],
    year: "2025",
    category: "AI Projects",
    image: "https://picsum.photos/seed/ift-openai/600/440",
  },
  {
    num: "05",
    name: "Payment Gateway Service",
    tech: ["Spring Boot", "Stripe API", "React"],
    year: "2024",
    category: "API Integration",
    image: "https://picsum.photos/seed/ift-stripe/600/440",
  },
  {
    num: "06",
    name: "Custom CRM Dashboard",
    tech: ["React", "TypeScript", "Spring Boot"],
    year: "2025",
    category: "Full Stack",
    image: "https://picsum.photos/seed/ift-crm/600/440",
  },
];
