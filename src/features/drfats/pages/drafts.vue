<!-- BorrowMaterialModal.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Borrow Library Material</h2>
            <p class="text-gray-600 mt-1">Fill in the details to borrow library material</p>
          </div>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="flex items-center flex-1"
          >
            <div class="flex flex-col items-center">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                :class="[
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-white' 
                    : currentStep === step.id 
                    ? 'border-primary bg-white text-primary' 
                    : 'border-gray-300 bg-white text-gray-400'
                ]"
              >
                <span v-if="currentStep > step.id">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else>{{ step.id }}</span>
              </div>
              <span 
                class="mt-2 text-sm font-medium"
                :class="currentStep >= step.id ? 'text-primary' : 'text-gray-500'"
              >
                {{ step.label }}
              </span>
            </div>
            <div 
              v-if="index < steps.length - 1"
              class="flex-1 h-0.5 mx-4"
              :class="currentStep > step.id ? 'bg-primary' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Step 1: Select Material -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Search Section -->
            <div class="lg:col-span-2 space-y-4">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  @input="searchMaterials"
                  type="text"
                  placeholder="Search by title, author, ISBN, or category..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <!-- Filter Chips -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in filterOptions"
                  :key="filter.id"
                  @click="toggleFilter(filter.id)"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="activeFilters.includes(filter.id) 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h4 class="font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Available:</span>
                  <span class="font-bold text-green-600">{{ availableCount }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Borrowed:</span>
                  <span class="font-bold text-blue-600">{{ borrowedCount }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Overdue:</span>
                  <span class="font-bold text-red-600">{{ overdueCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="material in filteredMaterials"
              :key="material.id"
              @click="selectMaterial(material)"
              class="border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
              :class="selectedMaterial?.id === material.id 
                ? 'border-primary border-2 bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div>
                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-1"
                      :class="getTypeColor(material.type)">
                      {{ material.type }}
                    </span>
                    <h4 class="font-bold text-gray-900 line-clamp-1">{{ material.title }}</h4>
                    <p class="text-sm text-gray-600">{{ material.author }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-medium px-2 py-1 rounded"
                    :class="getStatusColor(material.status)">
                    {{ material.status }}
                  </div>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Category:</span>
                  <span class="font-medium">{{ material.category }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">ISBN:</span>
                  <span class="font-medium">{{ material.isbn || 'N/A' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">Copies:</span>
                  <span class="font-medium">{{ material.availableCopies }}/{{ material.totalCopies }} available</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-600">Loan period: {{ material.loanPeriod || '14 days' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredMaterials.length === 0" class="text-center py-12">
            <div class="max-w-md mx-auto">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No materials found</h3>
              <p class="text-gray-500">
                {{ searchQuery ? 'No materials match your search criteria.' : 'No available materials at the moment.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Borrower Details -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Borrower Search/Selection -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="font-semibold text-lg text-gray-900 mb-4">Select Borrower</h3>
                
                <div class="space-y-4">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <input
                      v-model="borrowerSearch"
                      @input="searchBorrowers"
                      type="text"
                      placeholder="Search by name, ID, or email..."
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <!-- Borrower List -->
                  <div class="space-y-3 max-h-60 overflow-y-auto">
                    <div
                      v-for="borrower in filteredBorrowers"
                      :key="borrower.id"
                      @click="selectBorrower(borrower)"
                      class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm"
                      :class="selectedBorrower?.id === borrower.id 
                        ? 'border-primary border-2 bg-primary/5' 
                        : 'border-gray-200 hover:border-primary/30'"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-sm">
                              {{ getInitials(borrower.name) }}
                            </span>
                          </div>
                          <div>
                            <h4 class="font-semibold text-gray-900">{{ borrower.name }}</h4>
                            <p class="text-sm text-gray-600">{{ borrower.idNumber }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-xs font-medium px-2 py-1 rounded-full"
                            :class="borrower.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'">
                            {{ borrower.status }}
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span class="text-gray-600">{{ borrower.email }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span class="text-gray-600">{{ borrower.phone }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Borrower Information Card -->
              <div v-if="selectedBorrower" class="bg-white border border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-lg text-gray-900 mb-4">Borrower Information</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div class="p-2 bg-gray-50 rounded">{{ selectedBorrower.name }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                      <div class="p-2 bg-gray-50 rounded">{{ selectedBorrower.idNumber }}</div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div class="p-2 bg-gray-50 rounded">{{ selectedBorrower.email }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div class="p-2 bg-gray-50 rounded">{{ selectedBorrower.phone }}</div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Department/Class</label>
                    <div class="p-2 bg-gray-50 rounded">{{ selectedBorrower.department }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Loan Details -->
            <div class="space-y-6">
              <!-- Selected Material Card -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-lg text-gray-900 mb-4">Selected Material</h3>
                <div v-if="selectedMaterial" class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-lg text-gray-900">{{ selectedMaterial.title }}</h4>
                      <p class="text-gray-600">{{ selectedMaterial.author }}</p>
                      <div class="flex flex-wrap gap-2 mt-2">
                        <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {{ selectedMaterial.category }}
                        </span>
                        <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {{ selectedMaterial.type }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">ISBN:</span>
                        <span class="font-medium">{{ selectedMaterial.isbn || 'N/A' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Available Copies:</span>
                        <span class="font-medium text-green-600">{{ selectedMaterial.availableCopies }}</span>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Loan Period:</span>
                        <span class="font-medium">{{ selectedMaterial.loanPeriod || '14 days' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Status:</span>
                        <span class="font-medium" :class="getStatusColorClass(selectedMaterial.status)">
                          {{ selectedMaterial.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  No material selected
                </div>
              </div>

              <!-- Loan Settings -->
              <div class="bg-white border border-gray-200 rounded-xl p-6">
                <h3 class="font-semibold text-lg text-gray-900 mb-4">Loan Settings</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
                    <input
                      v-model="borrowForm.borrowDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      v-model="borrowForm.dueDate"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p class="mt-1 text-sm text-gray-500">Default: {{ calculateDefaultDueDate() }} days from today</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      v-model="borrowForm.notes"
                      rows="3"
                      placeholder="Add any special instructions or notes..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-else-if="currentStep === 3" class="space-y-6">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Ready to Complete Borrowing</h3>
                <p class="text-gray-600 mt-1">Please review all details before confirming</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Borrower Summary -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h4 class="font-semibold text-lg text-gray-900 mb-4">Borrower Summary</h4>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">
                      {{ getInitials(selectedBorrower?.name) }}
                    </span>
                  </div>
                  <div>
                    <h5 class="font-bold text-gray-900">{{ selectedBorrower?.name }}</h5>
                    <p class="text-sm text-gray-600">{{ selectedBorrower?.idNumber }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email:</span>
                    <span class="font-medium">{{ selectedBorrower?.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phone:</span>
                    <span class="font-medium">{{ selectedBorrower?.phone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Department:</span>
                    <span class="font-medium">{{ selectedBorrower?.department }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="font-medium" :class="selectedBorrower?.status === 'active' ? 'text-green-600' : 'text-red-600'">
                      {{ selectedBorrower?.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Material Summary -->
            <div class="bg-white border border-gray-200 rounded-xl p-6">
              <h4 class="font-semibold text-lg text-gray-900 mb-4">Material Summary</h4>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h5 class="font-bold text-gray-900">{{ selectedMaterial?.title }}</h5>
                    <p class="text-sm text-gray-600">{{ selectedMaterial?.author }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Category:</span>
                      <span class="font-medium">{{ selectedMaterial?.category }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Type:</span>
                      <span class="font-medium">{{ selectedMaterial?.type }}</span>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex justify-between">
                      <span class="text-gray-600">ISBN:</span>
                      <span class="font-medium">{{ selectedMaterial?.isbn || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Available:</span>
                      <span class="font-medium text-green-600">{{ selectedMaterial?.availableCopies }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loan Summary -->
            <div class="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
              <h4 class="font-semibold text-lg text-gray-900 mb-4">Loan Details</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center p-4 bg-gray-50 rounded-xl">
                  <div class="text-2xl font-bold text-primary mb-2">{{ borrowForm.borrowDate ? formatDate(borrowForm.borrowDate) : 'Today' }}</div>
                  <div class="text-sm text-gray-600">Borrow Date</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-xl">
                  <div class="text-2xl font-bold text-blue-600 mb-2">{{ borrowForm.dueDate ? formatDate(borrowForm.dueDate) : calculateDefaultDueDate() }}</div>
                  <div class="text-sm text-gray-600">Due Date</div>
                </div>
                <div class="text-center p-4 bg-indigo-50 rounded-xl">
                  <div class="text-2xl font-bold text-indigo-600 mb-2">
                    {{ calculateLoanDays() }}
                  </div>
                  <div class="text-sm text-gray-600">Loan Period (days)</div>
                </div>
              </div>
              <div class="mt-6" v-if="borrowForm.notes">
                <h5 class="font-medium text-gray-700 mb-2">Notes:</h5>
                <div class="bg-gray-50 p-4 rounded-lg">
                  {{ borrowForm.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-2xl">
        <div class="flex justify-between items-center">
          <div>
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Back
            </button>
          </div>
          
          <div class="flex items-center gap-3">
            <button
              @click="saveAsDraft"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              v-if="currentStep < 3"
            >
              Save as Draft
            </button>
            <button
              @click="nextStep"
              class="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {{ currentStep === 3 ? 'Confirm & Borrow' : 'Continue' }}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toasted } from "@/utils/utils"

// Modal state
const emit = defineEmits(['close', 'success'])

// Steps configuration
const steps = [
  { id: 1, label: 'Select Material' },
  { id: 2, label: 'Borrower Details' },
  { id: 3, label: 'Confirmation' }
]

// Reactive state
const currentStep = ref(1)
const searchQuery = ref('')
const activeFilters = ref(['available'])
const selectedMaterial = ref(null)
const selectedBorrower = ref(null)
const borrowerSearch = ref('')

// Borrow form
const borrowForm = ref({
  borrowDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  notes: ''
})

// Filter options
const filterOptions = [
  { id: 'available', label: 'Available' },
  { id: 'books', label: 'Books' },
  { id: 'journals', label: 'Journals' },
  { id: 'reference', label: 'Reference' },
  { id: 'digital', label: 'Digital' }
]

// Sample materials data (replace with API call)
const materials = ref([
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Cormen et al.",
    category: "Computer Science",
    type: "Book",
    status: "Available",
    isbn: "978-0262033848",
    totalCopies: 5,
    availableCopies: 3,
    loanPeriod: "14 days"
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    type: "Book",
    status: "Available",
    isbn: "978-0132350884",
    totalCopies: 3,
    availableCopies: 1,
    loanPeriod: "14 days"
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    category: "Software Engineering",
    type: "Book",
    status: "Available",
    isbn: "978-0201633610",
    totalCopies: 4,
    availableCopies: 2,
    loanPeriod: "14 days"
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    type: "Book",
    status: "Borrowed",
    isbn: "978-0201616224",
    totalCopies: 2,
    availableCopies: 0,
    loanPeriod: "14 days"
  },
  {
    id: 5,
    title: "Journal of Machine Learning",
    author: "Various",
    category: "Research",
    type: "Journal",
    status: "Available",
    totalCopies: 1,
    availableCopies: 1,
    loanPeriod: "7 days"
  }
])

// Sample borrowers data (replace with API call)
const borrowers = ref([
  {
    id: 1,
    name: "Mekdes Alem",
    idNumber: "STU001",
    email: "mekdes@example.com",
    phone: "+251 912 345 678",
    department: "Computer Science",
    status: "active"
  },
  {
    id: 2,
    name: "Samuel Tesfaye",
    idNumber: "STU002",
    email: "samuel@example.com",
    phone: "+251 911 234 567",
    department: "Software Engineering",
    status: "active"
  },
  {
    id: 3,
    name: "Tigist Worku",
    idNumber: "STU003",
    email: "tigist@example.com",
    phone: "+251 913 456 789",
    department: "Information Systems",
    status: "active"
  }
])

// Computed properties
const filteredMaterials = computed(() => {
  let filtered = materials.value
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(material =>
      material.title.toLowerCase().includes(query) ||
      material.author.toLowerCase().includes(query) ||
      material.category.toLowerCase().includes(query) ||
      (material.isbn && material.isbn.toLowerCase().includes(query))
    )
  }
  
  // Status filter
  if (activeFilters.value.includes('available')) {
    filtered = filtered.filter(material => material.status === 'Available')
  }
  
  // Type filters
  const typeFilters = filterOptions.filter(f => f.id !== 'available' && activeFilters.value.includes(f.id))
  if (typeFilters.length > 0) {
    filtered = filtered.filter(material =>
      typeFilters.some(filter => material.type.toLowerCase().includes(filter.id))
    )
  }
  
  return filtered
})

const filteredBorrowers = computed(() => {
  if (!borrowerSearch.value) return borrowers.value
  
  const query = borrowerSearch.value.toLowerCase()
  return borrowers.value.filter(borrower =>
    borrower.name.toLowerCase().includes(query) ||
    borrower.idNumber.toLowerCase().includes(query) ||
    borrower.email.toLowerCase().includes(query)
  )
})

const availableCount = computed(() => 
  materials.value.filter(m => m.status === 'Available').length
)

const borrowedCount = computed(() => 
  materials.value.filter(m => m.status === 'Borrowed').length
)

const overdueCount = computed(() => 
  materials.value.filter(m => m.status === 'Overdue').length
)

// Methods
function toggleFilter(filterId) {
  const index = activeFilters.value.indexOf(filterId)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterId)
  }
}

function selectMaterial(material) {
  if (material.status === 'Available' && material.availableCopies > 0) {
    selectedMaterial.value = material
  } else {
    toasted(false, 'This material is not available for borrowing')
  }
}

function selectBorrower(borrower) {
  if (borrower.status === 'active') {
    selectedBorrower.value = borrower
  } else {
    toasted(false, 'This borrower account is not active')
  }
}

function searchMaterials() {
  // Implement debounced search if needed
}

function searchBorrowers() {
  // Implement debounced search if needed
}

function getTypeColor(type) {
  const colors = {
    'Book': 'bg-blue-100 text-blue-800',
    'Journal': 'bg-purple-100 text-purple-800',
    'Reference': 'bg-amber-100 text-amber-800',
    'Digital': 'bg-green-100 text-green-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

function getStatusColor(status) {
  const colors = {
    'Available': 'bg-green-100 text-green-800',
    'Borrowed': 'bg-blue-100 text-blue-800',
    'Overdue': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusColorClass(status) {
  const colors = {
    'Available': 'text-green-600',
    'Borrowed': 'text-blue-600',
    'Overdue': 'text-red-600'
  }
  return colors[status] || 'text-gray-600'
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function calculateDefaultDueDate() {
  const defaultDays = selectedMaterial.value?.loanPeriod ? 
    parseInt(selectedMaterial.value.loanPeriod) : 14
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + defaultDays)
  return dueDate.toISOString().split('T')[0]
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function calculateLoanDays() {
  if (!borrowForm.value.dueDate || !borrowForm.value.borrowDate) return '0'
  const start = new Date(borrowForm.value.borrowDate)
  const end = new Date(borrowForm.value.dueDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Step navigation
function nextStep() {
  if (currentStep.value === 1) {
    if (!selectedMaterial.value) {
      toasted(false, 'Please select a material to borrow')
      return
    }
  } else if (currentStep.value === 2) {
    if (!selectedBorrower.value) {
      toasted(false, 'Please select a borrower')
      return
    }
  } else if (currentStep.value === 3) {
    confirmBorrow()
    return
  }
  
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function saveAsDraft() {
  const draft = {
    material: selectedMaterial.value,
    borrower: selectedBorrower.value,
    form: { ...borrowForm.value },
    step: currentStep.value,
    date: new Date().toISOString()
  }
  
  // Save draft to localStorage or send to API
  const drafts = JSON.parse(localStorage.getItem('borrow_drafts') || '[]')
  drafts.push(draft)
  localStorage.setItem('borrow_drafts', JSON.stringify(drafts))
  
  toasted(true, 'Draft saved successfully!')
  closeModal()
}

async function confirmBorrow() {
  try {
    // Prepare borrow data
    const borrowData = {
      materialId: selectedMaterial.value.id,
      borrowerId: selectedBorrower.value.id,
      borrowDate: borrowForm.value.borrowDate,
      dueDate: borrowForm.value.dueDate || calculateDefaultDueDate(),
      notes: borrowForm.value.notes,
      status: 'borrowed'
    }
    
    // API call would go here
    // await api.post('/borrow', borrowData)
    
    // For demo, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toasted(true, `Successfully borrowed "${selectedMaterial.value.title}"!`)
    emit('success', borrowData)
    closeModal()
    
  } catch (error) {
    console.error('Error borrowing material:', error)
    toasted(false, 'Failed to complete borrowing. Please try again.')
  }
}

function closeModal() {
  emit('close')
}

// Initialize due date
onMounted(() => {
  borrowForm.value.dueDate = calculateDefaultDueDate()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for modal */
.modal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>