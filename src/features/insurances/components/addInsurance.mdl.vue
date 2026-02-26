<script setup>
import { ref } from 'vue';
import { toasted } from "@/utils/utils";
import { closeModal } from "@customizer/modal-x";
import ModalParent from "@/components/new_form_builder/ModalParent.vue";
import { Input, Select, Textarea } from "@/components/new_form_elements";
import BaseIcon from "@/components/base/BaseIcon.vue";
import { mdiClose, mdiCloudUpload, mdiCheckCircle, mdiFileDocument, mdiLink, mdiCalendar, mdiAccountGroup, mdiTag, mdiInformation } from "@mdi/js";
import Button from "@/components/Button.vue";

// Enhanced material types and categories
const materialTypes = [
  { value: "pdf", label: "PDF Document" },
  { value: "ebook", label: "eBook" },
  { value: "audio", label: "Audio Book" },
  { value: "video", label: "Video" },
  { value: "presentation", label: "Presentation" },
  { value: "article", label: "Article" },
  { value: "course", label: "Online Course" },
  { value: "interactive", label: "Interactive Content" }
];

const categories = [
  { value: "programming", label: "Programming" },
  { value: "web_dev", label: "Web Development" },
  { value: "mobile_dev", label: "Mobile Development" },
  { value: "database", label: "Database" },
  { value: "design", label: "UI/UX Design" },
  { value: "data_science", label: "Data Science" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "business", label: "Business & Management" },
  { value: "marketing", label: "Digital Marketing" }
];

// Languages
const languages = [
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
  { value: "or", label: "Oromo" },
  { value: "ti", label: "Tigrinya" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" }
];

// Digital material state
const materialData = ref({
  title: '',
  author: '',
  description: '',
  type: '',
  category: '',
  language: '',
  tags: [],
  publishDate: '',
  publisher: '',
  isbn: '',
  duration: '', // For audio/video
  pages: '', // For eBooks/PDFs
  externalLink: '',
  cover: null,
  file: null,
  isPublic: true,
  requiresLogin: false
});

const coverPreview = ref(null);
const filePreview = ref(null);
const isUploading = ref(false);
const isDragging = ref(false);
const tagInput = ref('');
const showAdvanced = ref(false);

// Handle cover image upload
const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    if (file.size > 10 * 1024 * 1024) {
      toasted(false, "File too large", "Cover image must be less than 10MB");
      return;
    }
    materialData.value.cover = file;
    coverPreview.value = URL.createObjectURL(file);
    toasted(true, "Cover uploaded successfully");
  } else {
    toasted(false, "Invalid file", "Please select a valid image file (PNG, JPG, SVG)");
  }
};

// Handle drag & drop for cover
const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleCoverUpload({ target: { files: [files[0]] } });
  }
};

const handleDragOver = (event) => { 
  event.preventDefault(); 
  isDragging.value = true; 
};

const handleDragLeave = (event) => { 
  event.preventDefault(); 
  isDragging.value = false; 
};

// Handle digital file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toasted(false, "File too large", "File must be less than 100MB");
      return;
    }
    materialData.value.file = file;
    filePreview.value = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      icon: getFileIcon(file.type)
    };
    toasted(true, "File uploaded successfully");
  } else {
    toasted(false, "Invalid file", "Please select a valid digital file");
  }
};

// Handle tags
const addTag = () => {
  if (tagInput.value.trim() && !materialData.value.tags.includes(tagInput.value.trim())) {
    materialData.value.tags.push(tagInput.value.trim());
    tagInput.value = '';
  }
};

const removeTag = (index) => {
  materialData.value.tags.splice(index, 1);
};

// File size formatter
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('video')) return '🎬';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
  if (mimeType.includes('text')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
  return '📁';
};

// Validate form
const validateForm = () => {
  if (!materialData.value.title.trim()) {
    toasted(false, "Validation Error", "Title is required");
    return false;
  }
  if (!materialData.value.type) {
    toasted(false, "Validation Error", "Type is required");
    return false;
  }
  if (!materialData.value.category) {
    toasted(false, "Validation Error", "Category is required");
    return false;
  }
  if (!materialData.value.cover) {
    toasted(false, "Validation Error", "Cover image is required");
    return false;
  }
  if (!materialData.value.file && !materialData.value.externalLink) {
    toasted(false, "Validation Error", "Either file or external link is required");
    return false;
  }
  return true;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) return;

  isUploading.value = true;

  try {
    // Simulate API call
    console.log("Digital material submitted:", materialData.value);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toasted(true, "Digital material added successfully!");
    closeModal();
  } catch (error) {
    toasted(false, "Error", "Failed to add digital material. Please try again.");
    console.error(error);
  } finally {
    isUploading.value = false;
  }
};

// Reset form
const resetForm = () => {
  materialData.value = {
    title: '',
    author: '',
    description: '',
    type: '',
    category: '',
    language: '',
    tags: [],
    publishDate: '',
    publisher: '',
    isbn: '',
    duration: '',
    pages: '',
    externalLink: '',
    cover: null,
    file: null,
    isPublic: true,
    requiresLogin: false
  };
  coverPreview.value = null;
  filePreview.value = null;
  tagInput.value = '';
};
</script>

<template>
  <ModalParent>
    <div class="bg-white rounded-2xl shadow-2xl w-[950px] max-w-[95vw] max-h-[90vh] overflow-hidden transform transition-all duration-300 animate-in fade-in-90 slide-in-from-bottom-4">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BaseIcon :path="mdiFileDocument" class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-2xl font-bold">Add New Digital Material</h2>
              <p class="text-blue-100 text-sm mt-1">Register a new digital resource for the library</p>
            </div>
          </div>
          <Button 
            @click="closeModal()" 
            class="text-white hover:bg-white/20 rounded-full p-2" 
            variant="ghost"
            size="sm"
          >
            <BaseIcon :path="mdiClose" class="w-6 h-6" />
          </Button>
        </div>
        
        <!-- Progress Steps -->
        <div class="flex items-center gap-4 mt-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">1</div>
            <span class="text-sm font-medium">Basic Info</span>
          </div>
          <div class="w-8 h-0.5 bg-white/50"></div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/30 text-white flex items-center justify-center font-bold">2</div>
            <span class="text-sm font-medium text-white/80">Upload</span>
          </div>
          <div class="w-8 h-0.5 bg-white/30"></div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 text-white/80 flex items-center justify-center font-bold">3</div>
            <span class="text-sm font-medium text-white/60">Settings</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="grid grid-cols-2 gap-8">
          <!-- Left Side - Media Upload -->
          <div class="space-y-6">
            <!-- Cover Upload -->
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div class="w-2 h-5 bg-blue-500 rounded-full"></div>
                Cover Image
                <span class="text-red-500">*</span>
              </h3>
              
              <label 
                class="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl border-3 border-dashed transition-all duration-300 cursor-pointer hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 group relative overflow-hidden"
                :class="{
                  'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg': isDragging, 
                  'border-gray-300': !isDragging
                }"
                @drop="handleDrop"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
              >
                <!-- Preview -->
                <div v-if="coverPreview" class="relative w-full">
                  <img :src="coverPreview" class="w-full h-48 object-contain rounded-xl shadow-lg" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span class="text-sm font-medium text-gray-700">Click to change</span>
                  </div>
                </div>
                
                <!-- Upload Area -->
                <div v-else class="flex flex-col items-center justify-center p-6">
                  <div class="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BaseIcon :path="mdiCloudUpload" class="w-12 h-12 text-blue-600" />
                  </div>
                  <p class="text-lg font-semibold text-gray-700 text-center mb-2">Upload Cover Image</p>
                  <p class="text-sm text-gray-500 text-center">Drag & drop or click to browse</p>
                  <p class="text-xs text-gray-400 mt-3">PNG, JPG, SVG • Max 10MB</p>
                </div>
                
                <input type="file" class="hidden" @change="handleCoverUpload" accept="image/*" />
              </label>
              
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-medium text-blue-700">Aspect Ratio</div>
                  <div class="text-xs text-blue-600">3:4 Recommended</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-sm font-medium text-green-700">Resolution</div>
                  <div class="text-xs text-green-600">Min 800×600px</div>
                </div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div class="w-2 h-5 bg-green-500 rounded-full"></div>
                Digital File
                <span class="text-red-500">*</span>
              </h3>
              
              <div class="space-y-4">
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <BaseIcon :path="mdiCloudUpload" class="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p class="font-medium text-gray-700">Upload Digital File</p>
                  <p class="text-sm text-gray-500 mt-1">Or provide external link below</p>
                  <p class="text-xs text-gray-400 mt-2">Max 100MB • All formats supported</p>
                  <input ref="fileInput" type="file" @change="handleFileUpload" class="hidden" />
                </div>
                
                <!-- External Link Alternative -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BaseIcon :path="mdiLink" class="w-4 h-4" />
                    Or External Link
                  </label>
                  <Input 
                    v-model="materialData.externalLink" 
                    placeholder="https://example.com/material" 
                    type="url"
                  />
                </div>
                
                <!-- File Preview -->
                <div v-if="filePreview" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div class="flex items-center gap-3">
                    <div class="text-2xl">{{ filePreview.icon }}</div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800 truncate">{{ filePreview.name }}</p>
                      <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{{ filePreview.size }}</span>
                        <span>•</span>
                        <span>{{ filePreview.type }}</span>
                      </div>
                    </div>
                    <BaseIcon :path="mdiCheckCircle" class="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Material Details -->
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div class="w-2 h-5 bg-purple-500 rounded-full"></div>
                Material Information
              </h3>
              
              <div class="space-y-5">
                <!-- Title & Author -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Title
                      <span class="text-red-500">*</span>
                    </label>
                    <Input 
                      v-model="materialData.title" 
                      placeholder="Enter material title" 
                      class="w-full"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Author/Creator</label>
                    <Input 
                      v-model="materialData.author" 
                      placeholder="Author name" 
                      class="w-full"
                    />
                  </div>
                </div>
                
                <!-- Type & Category -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Type
                      <span class="text-red-500">*</span>
                    </label>
                    <Select 
                      v-model="materialData.type" 
                      :options="materialTypes" 
                      placeholder="Select type"
                      searchable
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Category
                      <span class="text-red-500">*</span>
                    </label>
                    <Select 
                      v-model="materialData.category" 
                      :options="categories" 
                      placeholder="Select category"
                      searchable
                    />
                  </div>
                </div>
                
                <!-- Language & Date -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Language</label>
                    <Select 
                      v-model="materialData.language" 
                      :options="languages" 
                      placeholder="Select language"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Publish Date</label>
                    <div class="relative">
                      <Input 
                        v-model="materialData.publishDate" 
                        type="date" 
                        class="w-full pl-10"
                      />
                      <BaseIcon :path="mdiCalendar" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <!-- Description -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Description</label>
                  <Textarea 
                    v-model="materialData.description" 
                    placeholder="Brief description of the material..."
                    rows="3"
                  />
                </div>
                
                <!-- Tags -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BaseIcon :path="mdiTag" class="w-4 h-4" />
                    Tags
                  </label>
                  <div class="flex gap-2">
                    <Input 
                      v-model="tagInput" 
                      placeholder="Add tag and press Enter"
                      @keyup.enter="addTag"
                      class="flex-1"
                    />
                    <Button @click="addTag" variant="outline" size="sm">Add</Button>
                  </div>
                  <div v-if="materialData.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                    <div 
                      v-for="(tag, index) in materialData.tags" 
                      :key="index"
                      class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {{ tag }}
                      <button @click="removeTag(index)" class="text-blue-600 hover:text-blue-800">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Details (Collapsible) -->
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4 cursor-pointer" @click="showAdvanced = !showAdvanced">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div class="w-2 h-5 bg-amber-500 rounded-full"></div>
                  Additional Details
                </h3>
                <div class="transform transition-transform duration-300" :class="{ 'rotate-180': showAdvanced }">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div v-if="showAdvanced" class="space-y-5 animate-in fade-in-50 slide-in-from-top-2">
                <!-- Publisher & ISBN -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Publisher</label>
                    <Input v-model="materialData.publisher" placeholder="Publisher name" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">ISBN/Identifier</label>
                    <Input v-model="materialData.isbn" placeholder="ISBN or unique identifier" />
                  </div>
                </div>
                
                <!-- Duration & Pages -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Duration/Length</label>
                    <Input v-model="materialData.duration" placeholder="e.g., 2h 30m or 300 pages" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Pages (if applicable)</label>
                    <Input v-model="materialData.pages" type="number" placeholder="Number of pages" />
                  </div>
                </div>
                
                <!-- Access Settings -->
                <div class="space-y-4 pt-4 border-t border-gray-200">
                  <h4 class="font-medium text-gray-700 flex items-center gap-2">
                    <BaseIcon :path="mdiAccountGroup" class="w-4 h-4" />
                    Access Settings
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        v-model="materialData.isPublic" 
                        id="isPublic" 
                        class="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <label for="isPublic" class="text-sm text-gray-700">Public Access</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        v-model="materialData.requiresLogin" 
                        id="requiresLogin" 
                        class="rounded text-blue-500 focus:ring-blue-400"
                      />
                      <label for="requiresLogin" class="text-sm text-gray-700">Requires Login</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Requirements Card -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
              <div class="flex items-start gap-3">
                <BaseIcon :path="mdiInformation" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-blue-800 mb-2">Requirements</h4>
                  <ul class="text-sm text-blue-700 space-y-1.5">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Cover image is required (3:4 aspect ratio recommended)
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Either file upload OR external link is required
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Title, Type, and Category are mandatory fields
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      File size limit: 100MB for uploads
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Button @click="resetForm" variant="ghost" size="sm" class="text-gray-600">
              Reset Form
            </Button>
            <div class="text-sm text-gray-500">
              Fields marked with <span class="text-red-500">*</span> are required
            </div>
          </div>
          
          <div class="flex gap-3">
            <Button @click="closeModal()" variant="outline" size="lg">
              Cancel
            </Button>
            <Button 
              @click="submitForm" 
              :disabled="!materialData.title || !materialData.type || !materialData.category || (!materialData.cover) || (!materialData.file && !materialData.externalLink)"
              :loading="isUploading"
              size="lg"
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <template v-if="isUploading">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              </template>
              <template v-else>
                Add Digital Material
              </template>
            </Button>
          </div>
        </div>
        
        <!-- Progress Indicator -->
        <div class="mt-4">
          <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              :style="{ 
                width: (materialData.title && materialData.type && materialData.category && materialData.cover && (materialData.file || materialData.externalLink)) 
                  ? '100%' 
                  : '0%' 
              }"
            ></div>
          </div>
          <div class="text-xs text-gray-500 mt-2 text-center">
            {{ (materialData.title && materialData.type && materialData.category && materialData.cover && (materialData.file || materialData.externalLink)) 
                ? 'All requirements met' 
                : 'Fill all required fields to enable submit' 
            }}
          </div>
        </div>
      </div>
    </div>
  </ModalParent>
</template>

<style scoped>
/* Custom animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideIn 0.3s ease-out;
}

.fade-in-90 {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Gradient borders */
.border-3 {
  border-width: 3px;
}

/* Card hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>