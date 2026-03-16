import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Keyboard } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Keyboard className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to TypeArena</p>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button className="w-full" size="lg">Sign in</Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
