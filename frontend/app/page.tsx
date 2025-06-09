"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Navigation,
  MapPin,
  Route,
  Clock,
  ArrowRight,
  Zap,
  Globe,
  Target,
  ChevronDown,
  Star,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle,
  Quote,
  HelpCircle,
  Brain,
  Activity,
  Leaf,
  Building2,
} from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { FAQSection } from "@/components/pricing/faq-section"
import { ContainerTextFlip } from "@/components/ui/container-text-flip"
import { FlipWords } from "@/components/ui/flip-words"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { MCPFeaturesDropdown } from "@/components/ui/mcp-features-dropdown"

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero")
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  
  // Create a beam effect that follows scroll
  const beamY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const beamOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  const features = [
    {
      title: "AI-Powered Route Optimization",
      description: "Advanced algorithms analyze traffic patterns, weather conditions, and real-time data to find the most efficient routes.",
      icon: Brain,
      stats: "30% faster routes",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Real-Time Traffic Intelligence",
      description: "Get live updates on traffic conditions, accidents, and road closures to make informed travel decisions.",
      icon: Activity,
      stats: "99.9% accuracy",
      color: "from-blue-400 to-indigo-600",
    },
    {
      title: "Multi-Modal Transportation",
      description: "Seamlessly combine walking, cycling, public transit, and driving for optimal journey planning.",
      icon: Navigation,
      stats: "5+ transport modes",
      color: "from-indigo-400 to-purple-600",
    },
    {
      title: "Predictive Analytics",
      description: "Machine learning models predict travel times and suggest optimal departure times based on historical data.",
      icon: TrendingUp,
      stats: "85% accuracy",
      color: "from-purple-400 to-blue-600",
    },
    {
      title: "Points of Interest Discovery",
      description: "Find nearby hotels, restaurants, attractions, and essential services with intelligent POI search.",
      icon: Building2,
      stats: "500K+ POIs",
      color: "from-blue-400 to-teal-600",
    },
    {
      title: "Collaborative Planning",
      description: "Plan trips with friends and family, share routes, and coordinate travel schedules in real-time.",
      icon: Users,
      stats: "Unlimited sharing",
      color: "from-teal-400 to-blue-600",
    },
  ]

  const stats = [
    { value: "10M+", label: "Routes Optimized", icon: Route },
    { value: "500K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Uptime SLA", icon: TrendingUp },
    { value: "50ms", label: "Avg Response", icon: Zap },
  ]

  const testimonials = [
    {
      quote: "GeoPal reduced our delivery route planning time by 75% and cut fuel costs by 30%. The ROI was immediate and substantial.",
      name: "Sarah Chen",
      title: "Logistics Manager, Global Shipping Co.",
    },
    {
      quote: "As someone who travels 200+ days a year, GeoPal has become indispensable. It finds routes and places I never would have discovered.",
      name: "Marcus Rodriguez",
      title: "Travel Blogger, Wanderlust Adventures",
    },
    {
      quote: "The isochrone analysis and reachability features have revolutionized how we approach urban mobility research. Incredibly powerful.",
      name: "Dr. Emily Watson",
      title: "Research Director, Urban Planning Institute",
    },
    {
      quote: "Our fleet efficiency improved by 40% after implementing GeoPal. The vehicle routing optimization is simply outstanding.",
      name: "James Park",
      title: "Fleet Operations, EcoDelivery",
    },
    {
      quote: "The API integration was seamless, and the results exceeded our expectations. Our users love the intelligent route suggestions.",
      name: "Lisa Thompson",
      title: "Product Manager, TechStartup Inc.",
    },
    {
      quote: "GeoPal's multi-modal planning has transformed our public transport recommendations. Passenger satisfaction is at an all-time high.",
      name: "David Kumar",
      title: "Operations Director, City Transport",
    },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const heroWords = ["intelligent", "seamless", "personalized", "effortless"]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed top-0 left-0 w-[2px] h-[100px] bg-gradient-to-b from-blue-900/0 via-blue-900/80 to-blue-900/0 blur-[1px] z-50" />
      <div className="fixed top-0 right-0 w-[2px] h-[100px] bg-gradient-to-b from-blue-900/0 via-blue-900/80 to-blue-900/0 blur-[1px] z-50" />
      <div className="fixed bottom-0 left-0 w-[2px] h-[100px] bg-gradient-to-b from-blue-900/0 via-blue-900/80 to-blue-900/0 blur-[1px] z-50" />
      <div className="fixed bottom-0 right-0 w-[2px] h-[100px] bg-gradient-to-b from-blue-900/0 via-blue-900/80 to-blue-900/0 blur-[1px] z-50" />

      {/* Enhanced Aurora Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-indigo-50/20 to-transparent"
          style={{ y }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/30 via-blue-50/10 to-transparent"
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
        />
      </div>

      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/10 to-indigo-200/10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 100 + 50,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              filter: "blur(20px)",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Geometric Background Patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-300/15 to-cyan-300/15 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Subtle Noise Texture */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')] opacity-20" />

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ... existing header content ... */}
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 pt-32 pb-20 min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Text Content */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Transform Your Travel Experience with{" "}
                </span>
                <FlipWords
                  words={heroWords}
                  duration={2000}
                  className="text-indigo-900 font-bold"
                />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Journey Planning
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Experience the future of travel planning. Our AI-powered platform optimizes every aspect of your journey, from route planning to personalized recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                <Link href="/auth/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg w-full sm:w-auto"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl w-full"
                    onClick={() => scrollToSection('features')}
                  >
                    Explore Features
                    <Globe className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 border-2 border-white"
                      />
                    ))}
                  </div>
                  <span>Trusted by 500K+ travelers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>99.9% uptime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Background */}
      <section id="features" className="relative z-10 py-32 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Built for the Future
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge algorithms with intuitive design to deliver unparalleled
              travel intelligence and optimization capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* MCP Features Dropdown Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MCPFeaturesDropdown />
          </motion.div>
        </div>
      </section>

      {/* About Section with Enhanced Background */}
      <section id="about" className="relative z-10 py-32 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Revolutionizing Travel Intelligence
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At GeoPal, we believe that travel should be effortless, efficient, and inspiring. Our mission is to
                  harness the power of artificial intelligence to eliminate the friction from journey planning and
                  optimization.
                </p>
                <p>
                  Founded by a team of AI researchers, travel enthusiasts, and logistics experts, we've experienced
                  firsthand the frustrations of inefficient route planning, missed connections, and suboptimal travel
                  decisions.
                </p>
                <p>
                  That's why we built GeoPal – to democratize access to enterprise-grade travel optimization tools and
                  make intelligent travel planning available to everyone, from individual travelers to global logistics
                  companies.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  "AI-powered route optimization algorithms",
                  "Real-time data processing and analysis",
                  "Seamless multi-modal transport integration",
                  "Enterprise-grade security and reliability",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6">Our Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10M+</div>
                    <div className="text-blue-100">Routes Optimized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">500K+</div>
                    <div className="text-blue-100">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">30%</div>
                    <div className="text-blue-100">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">40%</div>
                    <div className="text-blue-100">Cost Reduction</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Enhanced Background */}
      <section id="testimonials" className="relative z-10 py-32 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how GeoPal is transforming the way people and businesses approach travel planning and optimization.
            </p>
          </motion.div>

          <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white/80 backdrop-blur-sm items-center justify-center relative overflow-hidden border border-blue-100">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section with Enhanced Background */}
      <section id="pricing" className="relative z-10 py-32 bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Pricing Plans
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the perfect plan for your travel needs. All plans include our core AI-powered features.
            </p>
          </motion.div>

          <PricingPlans />
        </div>
      </section>

      {/* FAQ Section with Enhanced Background */}
      <section id="faq" className="relative z-10 py-32 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Got Questions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our AI travel platform and services.
            </p>
          </motion.div>

          <FAQSection />
        </div>
      </section>

      {/* CTA Section with Enhanced Background */}
      <section className="relative z-10 py-32 bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <CardContent className="p-16 relative">
                <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Transform Your Travel?</h2>
                <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of travelers and businesses who have revolutionized their journey planning with
                  GeoPal. Start your free trial today and experience the future of travel intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/dashboard">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-lg"
                      >
                        Start Free Trial
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </motion.div>
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70 px-10 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
                    >
                      Contact Sales
                      <Users className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
