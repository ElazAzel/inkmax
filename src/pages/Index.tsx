import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Link2, Zap, Shield, Smartphone, Share2, ArrowRight } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/pwa-maskable-512x512.png" alt="LinkMAX" className="h-8 w-8" />
            <span className="text-2xl font-semibold tracking-tight text-foreground">LinkMAX</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="transition-smooth hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-24 relative">
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="text-center max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-4 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Link Management</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-none animate-fade-in-up">
            One Link,
            <br />
            <span className="text-gradient">Infinite Possibilities</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Create a stunning bio page that brings together all your content, 
            social media, and products in one beautiful place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')} 
              className="text-lg px-10 py-6 rounded-2xl transition-smooth hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-6 rounded-2xl glass transition-smooth hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              View Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            No credit card required • 7-day premium trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Everything you need
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Powerful features designed for modern creators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Sparkles,
              title: 'AI Content Generation',
              description: 'Generate catchy titles and sales copy for your links and products with AI'
            },
            {
              icon: Link2,
              title: 'Magic Links',
              description: 'Your entire page compressed into a single shareable URL'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Optimized performance with instant loading times'
            },
            {
              icon: Smartphone,
              title: 'Mobile First',
              description: 'Beautiful on every device, optimized for mobile viewing'
            },
            {
              icon: Share2,
              title: 'Easy Sharing',
              description: 'QR codes, direct links, and social sharing built-in'
            },
            {
              icon: Shield,
              title: 'Privacy First',
              description: 'Your data stays secure with enterprise-grade protection'
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className="glass border-border/50 hover:border-primary/50 transition-smooth hover:scale-105 hover:shadow-xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-8 pb-8 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="glass border-border/50 max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-16 text-center space-y-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Ready to Build Your Link?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of creators, influencers, and entrepreneurs who trust LinkMAX
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')} 
                className="text-lg px-10 py-6 rounded-2xl transition-smooth hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Creating Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t glass mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/pwa-maskable-512x512.png" alt="LinkMAX" className="h-8 w-8" />
              <span className="text-2xl font-semibold tracking-tight">LinkMAX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 LinkMAX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
