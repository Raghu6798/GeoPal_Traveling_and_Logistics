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
} from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { FAQSection } from "@/components/pricing/faq-section"
import { ContainerTextFlip } from "@/components/ui/container-text-flip"
import { FlipWords } from "@/components/ui/flip-words"

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
      icon: Route,
      title: "AI-Powered Route Optimization",
      description:
        "Advanced algorithms analyze millions of data points to find the most efficient routes, saving you time and fuel costs.",
      color: "from-green-400 to-emerald-600",
      stats: "32% faster routes",
    },
    {
      icon: MapPin,
      title: "Intelligent POI Discovery",
      description:
        "Discover hidden gems and popular destinations with our AI that understands your preferences and travel style.",
      color: "from-emerald-400 to-teal-600",
      stats: "10M+ locations",
    },
    {
      icon: Clock,
      title: "Real-Time Optimization",
      description:
        "Dynamic route adjustments based on live traffic, weather, and events to ensure you always take the best path.",
      color: "from-teal-400 to-cyan-600",
      stats: "99.9% accuracy",
    },
    {
      icon: Target,
      title: "Multi-Modal Planning",
      description:
        "Seamlessly combine walking, cycling, driving, and public transport for the most efficient journey possible.",
      color: "from-cyan-400 to-blue-600",
      stats: "5+ transport modes",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption and privacy protection ensure your travel data remains secure and confidential.",
      color: "from-blue-400 to-indigo-600",
      stats: "SOC 2 compliant",
    },
    {
      icon: Sparkles,
      title: "Predictive Analytics",
      description:
        "Machine learning models predict optimal travel times and suggest the best departure windows for your trips.",
      color: "from-indigo-400 to-purple-600",
      stats: "85% prediction accuracy",
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
      name: "Sarah Chen",
      role: "Logistics Manager",
      company: "Global Shipping Co.",
      image: "https://img.freepik.com/premium-photo/getting-some-fresh-air-shot-young-woman-standing-park_590464-5150.jpg?semt=ais_hybrid&w=740",
      content:
        "GeoPal reduced our delivery route planning time by 75% and cut fuel costs by 30%. The ROI was immediate and substantial.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Travel Blogger",
      company: "Wanderlust Adventures",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwdHWCR9ZmtD0jmomnSGRSmnv0D_GL6kDeNA&s",
      content:
        "As someone who travels 200+ days a year, GeoPal has become indispensable. It finds routes and places I never would have discovered.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Director",
      company: "Urban Planning Institute",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "The isochrone analysis and reachability features have revolutionized how we approach urban mobility research. Incredibly powerful.",
      rating: 5,
    },
    {
      name: "James Park",
      role: "Fleet Operations",
      company: "EcoDelivery",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "Our fleet efficiency improved by 40% after implementing GeoPal. The vehicle routing optimization is simply outstanding.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      company: "TechStartup Inc.",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "The API integration was seamless, and the results exceeded our expectations. Our users love the intelligent route suggestions.",
      rating: 5,
    },
    {
      name: "David Kumar",
      role: "Operations Director",
      company: "City Transport",
      image: "/placeholder.svg?height=60&width=60",
      content:
        "GeoPal's multi-modal planning has transformed our public transport recommendations. Passenger satisfaction is at an all-time high.",
      rating: 5,
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Tracing Beam Effect */}
      <motion.div
        className="fixed top-0 left-0 w-[2px] h-[100px] bg-gradient-to-b from-emerald-900/0 via-emerald-900/80 to-emerald-900/0 blur-[1px] z-50"
        style={{ 
          y: beamY,
          opacity: beamOpacity,
          transform: `translateY(${beamY})`,
        }}
      />

      {/* Aurora Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-emerald-50/20 to-transparent"
          style={{ y }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-100/30 via-green-50/10 to-transparent"
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
        />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/10 to-emerald-200/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  GeoPal
                </h1>
                <p className="text-sm text-gray-600">Intelligent Travel Platform</p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {["Features", "About", "Pricing"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
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
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Transform Your Travel Experience with{" "}
                </span>
                <FlipWords
                  words={heroWords}
                  duration={2000}
                  className="text-emerald-900 font-bold"
                />
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg w-full sm:w-auto"
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
                    className="border-2 border-green-200 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold rounded-xl w-full"
                    onClick={() => scrollToSection('features')}
                  >
                    Explore Features
                    <Globe className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Trust Indicators */}
            
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Built for the Future
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge algorithms with intuitive design to deliver unparalleled
              travel intelligence and optimization capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
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
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6">Our Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">10M+</div>
                    <div className="text-green-100">Routes Optimized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">500K+</div>
                    <div className="text-green-100">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">30%</div>
                    <div className="text-green-100">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">40%</div>
                    <div className="text-green-100">Cost Reduction</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how GeoPal is transforming the way people and businesses approach travel planning and optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <Quote className="h-8 w-8 text-green-600 mb-4 opacity-50" />

                    <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.content}"</p>

                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-sm text-green-600 font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Pricing Plans
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Select the perfect plan for your travel needs. All plans include our core AI-powered features.
            </p>
          </motion.div>

          <PricingPlans />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-green-100 text-green-700 border-green-200 px-4 py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Got Questions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our AI travel platform and services.
            </p>
          </motion.div>

          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-5xl mx-auto bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <CardContent className="p-16 relative">
                <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Transform Your Travel?</h2>
                <p className="text-xl mb-10 text-green-100 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of travelers and businesses who have revolutionized their journey planning with
                  GeoPal. Start your free trial today and experience the future of travel intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/dashboard">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-white text-green-600 hover:bg-gray-50 px-10 py-6 text-lg font-semibold rounded-xl shadow-lg"
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
                      className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl"
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
