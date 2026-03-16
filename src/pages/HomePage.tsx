import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Keyboard, Trophy, Zap, BarChart3, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockContests, mockLeaderboard } from '@/lib/mock-data';
import ContestCard from '@/components/ContestCard';
import LeaderboardTable from '@/components/LeaderboardTable';

const features = [
  { icon: Keyboard, title: 'Practice Mode', desc: 'Sharpen your skills with custom difficulty and time limits.' },
  { icon: Trophy, title: 'Live Contests', desc: 'Compete in real-time typing battles with multiple attempts.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track WPM, accuracy, and rank progression over time.' },
  { icon: Users, title: 'Global Rankings', desc: 'Climb the leaderboard and earn achievements.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="page-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Live contests happening now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Competitive Typing
              <br />
              <span className="gradient-text">Redefined</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Practice, compete, and dominate. Join thousands of typists in real-time contests with multiple attempts and dynamic passages.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/practice">
                  <Keyboard className="w-4 h-4" />
                  Start Typing
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/contest">
                  View Contests
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Typing demo */}
            <div className="mt-12 glass-card p-6 max-w-lg mx-auto text-left">
              <div className="font-mono text-sm text-muted-foreground mb-2">Try it:</div>
              <div className="font-mono text-lg overflow-hidden">
                <span className="text-primary">The quick brown fox</span>
                <span className="typing-caret" />
                <span className="text-muted-foreground/30"> jumps over the lazy dog</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live contests */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Live & Upcoming Contests</h2>
          <Link to="/contest" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {mockContests.filter(c => c.status !== 'ended').slice(0, 4).map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </section>

      {/* Leaderboard preview */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
          <Link to="/leaderboard" className="text-sm text-primary hover:underline flex items-center gap-1">
            Full rankings <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <LeaderboardTable entries={mockLeaderboard.slice(0, 5)} />
      </section>

      {/* Features */}
      <section className="page-container">
        <h2 className="text-2xl font-bold text-center mb-10">Why TypeArena?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container text-center py-16">
        <div className="glass-card glow-border p-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to compete?</h2>
          <p className="text-muted-foreground mb-6">
            Join TypeArena and start climbing the rankings today.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Keyboard className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TypeArena</span>
          </div>
          <div>© 2026 TypeArena. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
