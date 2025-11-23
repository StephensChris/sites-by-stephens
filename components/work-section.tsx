"use client"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Sweets by Sami",
    image: "/sweetsbysami-preview.jpg",
    url: "https://sweetsbysami.sitesbystephens.com",
  },
  {
    id: 2,
    title: "Plumbing Service",
    image: "/professional-plumber-website.jpg",
    url: "https://demo-plumber.sitesbystephens.com",
  },
  {
    id: 3,
    title: "Barber Shop",
    image: "/modern-barber-shop-website.jpg",
    url: "https://demo-barber.sitesbystephens.com",
  },
  {
    id: 4,
    title: "Fitness Gym",
    image: "/fitness-gym-website.png",
    url: "https://demo-gym.sitesbystephens.com",
  },
  {
    id: 5,
    title: "Cleaning Service",
    image: "/professional-cleaning-service-website.jpg",
    url: "https://demo-cleaning.sitesbystephens.com",
  },
  {
    id: 6,
    title: "Law Office",
    image: "/professional-law-office-website.jpg",
    url: "https://demo-law.sitesbystephens.com",
  },
]

export function WorkSection() {
  return (
    <section id="work" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Recent Projects</h2>
          <p className="text-xl text-muted-foreground">Real websites for real businesses</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 !p-0 !gap-0">
                  <div className="relative overflow-hidden aspect-[3/2] w-full">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-2xl font-bold">{project.title}</p>
                      <ExternalLink className="text-white w-6 h-6 mt-2" />
                    </div>
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
