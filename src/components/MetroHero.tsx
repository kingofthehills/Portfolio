const VIDEO_SRC = "https://raw.githubusercontent.com/gughigug/metro-hero-assets/main/Subway_doors_open_to_city_202608242331.mp4"

export interface MetroHeroProps {
  title?: string
}

export function MetroHero({ title = "THE CITY OPENS" }: MetroHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#05060a",
      }}
    >
      <video
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,3,10,0.35) 0%, rgba(0,3,10,0.1) 40%, rgba(0,3,10,0.6) 100%)",
        }}
      />
      <h1
        style={{
          position: "relative",
          zIndex: 1,
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(32px, 6vw, 72px)",
          color: "#fff",
          textAlign: "center",
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
        }}
      >
        {title}
      </h1>
    </section>
  )
}
