export default function Avatar({ candidate, size = 48 }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `linear-gradient(135deg, hsl(${candidate.hue} 85% 78%), hsl(${(candidate.hue + 40) % 360} 80% 62%))`,
      }}
    >
      {candidate.emoji}
    </div>
  )
}
