const About = () => (
  <div className="max-w-md animate-fade-in space-y-6 text-center">
    <h1 className="font-mono text-3xl font-bold text-foreground">Hifocus</h1>
    <p className="leading-relaxed text-muted-foreground">
      A minimalist flip clock designed to help you focus, track time, and minimize distractions.
      Beautiful retro-inspired animations meet modern web design.
    </p>
    <div className="space-y-3 text-sm text-muted-foreground/80">
      <p>🕐 Real-time flip clock with smooth 3D animations</p>
      <p>⏱ Countdown timer for focus sessions</p>
      <p>🎨 Customizable themes and display options</p>
      <p>📱 Responsive — works on any device</p>
      <p>🔒 No tracking, no accounts, just time</p>
    </div>
    <div className="pt-4">
      <p className="text-xs text-muted-foreground/40">
        Built with React & Tailwind CSS
      </p>
    </div>
  </div>
);

export default About;
