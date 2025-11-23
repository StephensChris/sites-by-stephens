interface AboutData {
  title: string
  paragraphs: string[]
  features: Array<{
    icon: string
    title: string
    description: string
  }>
}

interface AboutProps {
  data: AboutData
}

export function ClientAbout({ data }: AboutProps) {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-card min-h-[60vh] flex flex-col justify-center">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 sm:mb-8 text-balance px-4 opacity-0 animate-[fadeInUp_0.7s_ease-out_0.1s_forwards]">
            {data.title}
          </h2>
          {data.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-base sm:text-lg md:text-xl text-muted-foreground text-center leading-relaxed px-4 ${
                index < data.paragraphs.length - 1 ? "mb-4 sm:mb-6" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-5xl mx-auto px-4">
          {data.features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card hover:bg-accent/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg opacity-0"
              style={{ animation: `fadeInUp 0.7s ease-out ${index * 0.1 + 0.3}s forwards` }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

