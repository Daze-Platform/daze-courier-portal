import React, { useState } from 'react';
import { Search, Phone, MessageCircle, Mail, ChevronRight, Clock, Shield, DollarSign, MapPin, Smartphone, Users, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import UnifiedHeader from '@/components/UnifiedHeader';
import DesktopSidebar from '@/components/DesktopSidebar';
import { useIsPWA } from '@/hooks/use-is-pwa';

const Help = () => {
  const isPWA = useIsPWA();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: Smartphone,
      title: 'App & Technology',
      description: 'App issues, GPS problems, and technical support',
      articles: 12,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Payments & Earnings',
      description: 'Payment issues, earnings questions, and tax information',
      articles: 8,
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Room Service & Orders',
      description: 'Service guidance, order issues, and guest interactions',
      articles: 15,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      description: 'Safety guidelines, account security, and incident reporting',
      articles: 6,
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Users,
      title: 'Account & Profile',
      description: 'Profile settings, document updates, and account management',
      articles: 10,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: FileText,
      title: 'Policies & Guidelines',
      description: 'Terms of service, community guidelines, and platform policies',
      articles: 7,
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call Support',
      description: 'Talk to our support team',
      action: 'Call Now',
      available: '24/7 Available',
      color: 'bg-green-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with a support agent',
      action: 'Start Chat',
      available: 'Online Now',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: 'Send Email',
      available: 'Response in 2-4 hours',
      color: 'bg-purple-500'
    }
  ];

  const faqItems = [
    {
      question: 'How do I get paid and when?',
      answer: 'You get paid weekly via direct deposit to your bank account. Payments are processed every Tuesday for the previous week (Monday to Sunday). You can also cash out instantly for a small fee through the app.'
    },
    {
      question: 'What should I do if I can\'t find the customer?',
      answer: 'Try calling or texting the customer first. If you still can\'t reach them, wait at the delivery location for 5 minutes, then contact support through the app. Follow the app\'s instructions for undeliverable orders.'
    },
    {
      question: 'How do I report an issue with an order?',
      answer: 'In the app, go to your delivery history, select the problematic order, and tap "Report Issue". Choose the appropriate reason and provide details. Our support team will review and respond quickly.'
    },
    {
      question: 'Can I choose which orders to accept?',
      answer: 'Yes, you have full control over which orders you accept. You can see the pickup and delivery locations, estimated earnings, and distance before accepting any order.'
    },
    {
      question: 'What if I\'m unable to complete a service during my shift?',
      answer: 'Contact support immediately through the app\'s emergency contact feature. If you have an active order, we\'ll reassign it to another food runner and ensure the guest is notified.'
    },
    {
      question: 'How do I update my tax information?',
      answer: 'Go to Account Settings > Tax Information in the app. You can update your SSN, tax ID, and download your 1099 forms. Changes may take 1-2 business days to process.'
    }
  ];

  const quickLinks = [
    { title: 'Food Runner Requirements', icon: FileText },
    { title: 'Resort Service Guidelines', icon: MapPin },
    { title: 'Safety Training', icon: Shield },
    { title: 'Community Guidelines', icon: Users },
    { title: 'Earnings Calculator', icon: DollarSign },
    { title: 'Tax Resources', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background pt-[100px] lg:pt-[56px]">
      <UnifiedHeader />
      <DesktopSidebar />
      
      <main className="lg:ml-64">
        <div className={`container mx-auto px-4 max-w-6xl lg:px-3 ${isPWA ? 'py-4 lg:pt-4 lg:pb-4' : 'py-2 lg:pt-2 lg:pb-4'}`}>
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">How can we help you?</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find answers to common questions or get in touch with our support team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or topics..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Emergency Contact Banner */}
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      Emergency? Need immediate help during a delivery?
                    </p>
                    <p className="text-sm text-red-700">
                      Call our 24/7 emergency line: (555) 911-HELP
                    </p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactOptions.map((option) => (
                <Card key={option.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${option.color} p-3 rounded-lg`}>
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {option.available}
                        </Badge>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      {option.action}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpCategories.map((category) => (
                <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${category.color} p-3 rounded-lg`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 ml-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqItems.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.title}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-auto py-3"
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="text-sm">{link.title}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Phone Support</span>
                    <Badge className="bg-green-100 text-green-800">24/7</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Live Chat</span>
                    <Badge className="bg-blue-100 text-blue-800">6AM - 12AM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Support</span>
                    <Badge className="bg-purple-100 text-purple-800">24/7</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;