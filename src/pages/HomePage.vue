<template>
  <div class="homepage min-h-screen bg-slate-900 relative overflow-x-hidden">
    <!-- Animated Background -->
 <div class="fixed inset-0 -z-10">
  <!-- Gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"></div>

  <!-- Pattern overlay -->
  <div
    class="absolute inset-0 opacity-20"
    style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
  </div>
</div>

    <!-- Animated Gradient Orbs -->
    <div class="fixed top-20 -left-48 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
    <div class="fixed bottom-20 -right-48 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Navigation -->
      <nav class="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16 md:h-20">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <div class="absolute inset-0 bg-amber-500 rounded-xl blur-lg opacity-50"></div>
                <div class="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
              <div>
                <div class="text-xs font-semibold text-amber-500 tracking-wider">Hawassa University</div>
                <div class="text-lg font-bold text-white tracking-tight">HU-DLRBS</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                @click="router.push('/login')"
                class="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                <span>Sign In</span>
              </button>
              <button 
                @click="goToPrimary"
                class="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{{ isAuthenticated ? 'Dashboard' : 'Get Started' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div class="text-center">
            <div class="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span class="text-amber-400 text-sm font-semibold">Digital Transformation at Hawassa University</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              Modernizing
              <span class="bg-gradient-to-r from-amber-400 via-amber-500 to-red-500 bg-clip-text text-transparent">
                Library Operations
              </span>
              <br />
              for the Digital Age
            </h1>
            
            <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-slide-up-delayed">
              HU-DLRBS revolutionizes how students and staff access, reserve, and borrow library materials
              across all Hawassa University campuses.
            </p>
            
            <div class="flex flex-wrap justify-center gap-4 mb-16 animate-slide-up-more">
              <div class="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full backdrop-blur">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                <span class="text-white font-semibold">5+ Campuses</span>
              </div>
              <div class="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full backdrop-blur">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span class="text-white font-semibold">50K+ Materials</span>
              </div>
              <div class="flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-full backdrop-blur">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-white font-semibold">24/7 Digital Access</span>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up-last">
              <button 
                @click="goToPrimary"
                class="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <span>Start Your Journey</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
              <button 
                @click="goToSecondary"
                class="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span>Explore Catalog</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 3D Wave -->
        <div class="relative h-32 mt-20">
          <svg class="absolute bottom-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="rgba(15,23,42,1)"></path>
          </svg>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-amber-500 text-sm font-semibold uppercase tracking-wider">Features</span>
            <h2 class="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Everything You Need in One Platform
            </h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto">
              From discovery to checkout, fines to returns — HU-DLRBS streamlines every step
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="(feature, i) in features" :key="i" 
                 class="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative">
                <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
                <p class="text-slate-300 leading-relaxed">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-20 bg-gradient-to-b from-slate-900 to-indigo-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-amber-500 text-sm font-semibold uppercase tracking-wider">Simple Process</span>
            <h2 class="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              How HU-DLRBS Works
            </h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto">
              Four simple steps to access your library materials
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(step, i) in steps" :key="i" class="text-center group">
              <div class="relative mb-6">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl flex items-center justify-center relative z-10 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span class="text-2xl font-bold text-white">{{ i + 1 }}</span>
                </div>
                <div v-if="i < steps.length - 1" class="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
              </div>
              <div class="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">{{ step.title }}</h3>
              <p class="text-slate-300">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Role Cards -->
      <section class="py-20 bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="text-amber-500 text-sm font-semibold uppercase tracking-wider">For Everyone</span>
            <h2 class="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Designed for Every Role
            </h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto">
              Tailored experiences for all library stakeholders
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(role, i) in roles" :key="i" 
                 class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2">
              <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="role.icon"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-white mb-3">{{ role.title }}</h3>
              <p class="text-slate-300 text-sm mb-4">{{ role.description }}</p>
              <ul class="space-y-2">
                <li v-for="feature in role.features" :key="feature" class="flex items-center space-x-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-20 bg-gradient-to-r from-amber-500/5 to-red-500/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            <div v-for="(stat, i) in stats" :key="i" class="text-center">
              <div class="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500 mb-2">
                {{ stat.value }}
              </div>
              <div class="text-slate-300 font-semibold">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-500/10 blur-3xl"></div>
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Library Experience?
          </h2>
          <p class="text-xl text-slate-300 mb-8">
            Join thousands of students and staff who already enjoy seamless library access
          </p>
          <button 
            @click="goToPrimary"
            class="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-3"
          >
            <span>Get Started Today</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-slate-950 border-t border-white/10 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-amber-500 font-semibold">Hawassa University</div>
                  <div class="text-white font-bold">HU-DLRBS</div>
                </div>
              </div>
              <p class="text-slate-400 text-sm">
                Digital Library Reservation and Book Borrowing System
              </p>
            </div>
            
            <div>
              <h4 class="text-white font-semibold mb-4">Quick Links</h4>
              <ul class="space-y-2">
                <li><a href="#" @click.prevent="goToPrimary" class="text-slate-400 hover:text-amber-500 transition">Dashboard</a></li>
                <li><a href="#" @click.prevent="goToSecondary" class="text-slate-400 hover:text-amber-500 transition">Catalog</a></li>
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">Support</a></li>
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-white font-semibold mb-4">Resources</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">Help Center</a></li>
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">Library Rules</a></li>
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">Borrowing Policy</a></li>
                <li><a href="#" class="text-slate-400 hover:text-amber-500 transition">F.A.Q</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-white font-semibold mb-4">Contact</h4>
              <p class="text-slate-400 text-sm">Hawassa University<br/>Main Campus, Ethiopia</p>
              <p class="text-slate-400 text-sm mt-2">Email: library@hu.edu.et</p>
            </div>
          </div>
          
          <div class="border-t border-white/10 mt-12 pt-8 text-center">
            <p class="text-slate-400 text-sm">&copy; 2024 Hawassa University - HU-DLRBS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const auth = useAuth();

const isAuthenticated = computed(() => Boolean(auth?.auth?.accessToken));

const features = [
  {
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    title: 'Smart Search & Discovery',
    description: 'Find physical and digital materials instantly with powerful search filters and real-time availability status.'
  },
  {
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    title: 'Easy Reservations',
    description: 'Reserve unavailable books and get notified when they become available for borrowing.'
  },
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Streamlined Borrowing',
    description: 'Borrow and return items with QR code scanning, automatic due date tracking, and email reminders.'
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Fine Management',
    description: 'View and pay overdue fines online through integrated payment gateway.'
  },
  {
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Analytics Dashboard',
    description: 'Real-time insights into library usage, popular materials, and circulation trends.'
  },
  {
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'Responsive Design',
    description: 'Access the system from any device - desktop, tablet, or mobile.'
  }
];

const steps = [
  {
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    title: 'Search',
    description: 'Browse or search for materials across all campuses'
  },
  {
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    title: 'Reserve',
    description: 'Reserve available items or join waitlists'
  },
  {
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    title: 'Borrow',
    description: 'Check out items at your campus library'
  },
  {
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    title: 'Return or Renew',
    description: 'Return on time or renew online'
  }
];

const roles = [
  {
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    title: 'Students & Faculty',
    description: 'Access library resources anytime, anywhere',
    features: ['Search catalog', 'Reserve books', 'Borrow materials', 'Pay fines online']
  },
  {
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
    title: 'Stack Staff',
    description: 'Manage circulation efficiently',
    features: ['Process checkouts', 'Handle returns', 'Manage reservations', 'Track inventory']
  },
  {
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    title: 'Technical Staff',
    description: 'Maintain system integrity',
    features: ['Catalog management', 'Digital resources', 'System monitoring', 'User support']
  },
  {
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Administrators',
    description: 'Oversee entire operation',
    features: ['User management', 'Reports & analytics', 'Policy configuration', 'Multi-campus sync']
  }
];

const stats = [
  { value: '50,000+', label: 'Library Materials' },
  { value: '10,000+', label: 'Active Users' },
  { value: '5', label: 'Campuses' },
  { value: '24/7', label: 'Digital Access' }
];

function goToPrimary() {
  router.push(isAuthenticated.value ? '/app/dashboard' : '/login');
}

function goToSecondary() {
  router.push('/app/materials');
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 30px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 8s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-slide-up-delayed {
  animation: slide-up 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-slide-up-more {
  animation: slide-up 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-slide-up-last {
  animation: slide-up 0.8s ease-out 0.6s forwards;
  opacity: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}
</style>