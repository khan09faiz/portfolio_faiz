/**
 * ContactSection Component
 * Contact form with EmailJS integration
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SITE_CONFIG } from '@/lib/constants'

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      // EmailJS configuration from environment variables
      // You need to:
      // 1. Sign up at https://www.emailjs.com/
      // 2. Create an email service
      // 3. Create an email template
      // 4. Add keys to .env.local file
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

      // Check if EmailJS is configured
      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        // Demo mode - show success toast without actually sending
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast.success(
          'Demo mode: EmailJS not configured. In production, your message would be sent!',
          { duration: 5000 }
        )
        reset()
        return
      }

      // Send email via EmailJS
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          to_name: SITE_CONFIG.name,
        },
        PUBLIC_KEY
      )

      toast.success('Message sent successfully! I\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      toast.error('Failed to send message. Please try again or contact me directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            color: '#fff',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />

      <section id="contact" className="section-padding">
        <div className="container max-w-5xl">
          {/* Header */}
          <SectionHeader
            terminalPath="~/contact"
            title="Get In Touch"
            description="Have a project in mind or want to collaborate? Let's connect!"
          />

          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="elevated">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border-2 border-primary/20 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border-2 border-primary/20 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </motion.div>

                {/* Subject */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border-2 border-primary/20 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/50"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                  )}
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-card/50 border-2 border-primary/20 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 resize-none text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  icon={<Send className="h-4 w-4" />}
                  className="w-full shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
                  size="lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                </motion.div>
              </form>
            </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <Card variant="elevated">
                <h3 className="text-xl font-bold mb-4 text-foreground">Contact Information</h3>
                <div className="space-y-4">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${SITE_CONFIG.contact.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>{SITE_CONFIG.contact.email}</span>
                  </a>

                  {SITE_CONFIG.links.github && (
                    <a
                      href={SITE_CONFIG.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Github className="h-5 w-5" />
                      </div>
                      <span>GitHub Profile</span>
                    </a>
                  )}

                  {SITE_CONFIG.links.linkedin && (
                    <a
                      href={SITE_CONFIG.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </Card>
              </motion.div>

              {/* Quick Message Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <Card variant="outlined">
                <h3 className="text-lg font-bold mb-2 text-foreground">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  I typically respond within 24-48 hours. For urgent matters, feel free to reach out directly via email or LinkedIn.
                </p>
              </Card>
              </motion.div>

              {/* Availability Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <Card variant="outlined">
                <h3 className="text-lg font-bold mb-2 text-foreground">Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Open to freelance projects, collaborations, and full-time opportunities. Let's discuss how we can work together!
                </p>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
