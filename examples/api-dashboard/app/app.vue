<script setup lang="ts">
interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Task {
  id: number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

const email = ref('admin@example.com')
const password = ref('password')
const isLoggingIn = ref(false)
const selectedTab = ref(0)

const { user, login, logout } = useApiAuth<User>()

const { data: tasks, status: tasksStatus, refresh: refreshTasks } = useClientApiFetch<Task[]>('/api/tasks', {
  immediate: false
})

const selectedFiles = ref<File[]>([])
const { progress: uploadProgress, isUploading, upload: uploadFile } = useUploadWithProgress()

const { progress: downloadProgress, isDownloading, download: downloadFile } = useDownloadWithProgress()

async function handleLogin() {
  isLoggingIn.value = true
  try {
    await login({ email: email.value, password: password.value })
    selectedTab.value = 1
  } finally {
    isLoggingIn.value = false
  }
}

async function handleLogout() {
  await logout()
  selectedTab.value = 0
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

async function handleUpload() {
  if (selectedFiles.value.length === 0) return

  const formData = new FormData()
  selectedFiles.value.forEach(file => formData.append('file', file))

  await uploadFile('/api/upload', formData)
  selectedFiles.value = []
}

async function handleDownloadReport() {
  await downloadFile('/api/download/report')
}

function getStatusColor(status: Task['status']) {
  const colors = {
    pending: 'neutral',
    in_progress: 'primary',
    completed: 'success'
  }
  return colors[status]
}

function getPriorityColor(priority: Task['priority']) {
  const colors = {
    low: 'neutral',
    medium: 'warning',
    high: 'error'
  }
  return colors[priority]
}

const tabs = computed(() => [
  { label: 'Login', icon: 'i-lucide-log-in', disabled: !!user.value },
  { label: 'Tasks', icon: 'i-lucide-list-checks', disabled: !user.value },
  { label: 'Upload', icon: 'i-lucide-upload', disabled: !user.value },
  { label: 'Download', icon: 'i-lucide-download', disabled: !user.value }
])

watch(user, (newUser) => {
  if (newUser && selectedTab.value === 0) {
    selectedTab.value = 1
  }
  if (!newUser) {
    selectedTab.value = 0
  }
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-6xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UIcon
                name="i-lucide-layout-dashboard"
                class="text-2xl text-primary-500"
              />
              <h1 class="text-xl font-semibold">
                API Dashboard
              </h1>
            </div>
            <div
              v-if="user"
              class="flex items-center gap-3"
            >
              <UAvatar
                :alt="user.name"
                size="sm"
              />
              <div class="text-sm">
                <div class="font-medium">
                  {{ user.name }}
                </div>
                <div class="text-gray-500">
                  {{ user.email }}
                </div>
              </div>
              <UButton
                icon="i-lucide-log-out"
                color="error"
                variant="outline"
                size="xs"
                @click="handleLogout"
              >
                Logout
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto p-6">
        <UCard>
          <UTabs
            v-model="selectedTab"
            :items="tabs"
          >
            <template #item="{ item }">
              <div
                v-if="item.label === 'Login'"
                class="p-6"
              >
                <div class="max-w-md mx-auto space-y-4">
                  <UFormField label="Email">
                    <UInput
                      v-model="email"
                      icon="i-lucide-mail"
                      type="email"
                      placeholder="admin@example.com"
                    />
                  </UFormField>

                  <UFormField label="Password">
                    <UInput
                      v-model="password"
                      icon="i-lucide-lock"
                      type="password"
                      placeholder="password"
                    />
                  </UFormField>

                  <UButton
                    icon="i-lucide-log-in"
                    :loading="isLoggingIn"
                    block
                    @click="handleLogin"
                  >
                    Login
                  </UButton>

                  <UAlert
                    color="primary"
                    variant="subtle"
                    icon="i-lucide-info"
                    description="admin@example.com / password"
                  />
                </div>
              </div>

              <div
                v-if="item.label === 'Tasks'"
                class="p-6"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">
                      My Tasks
                    </h3>
                    <UButton
                      icon="i-lucide-refresh-cw"
                      :loading="tasksStatus === 'pending'"
                      @click="refreshTasks"
                    >
                      Refresh
                    </UButton>
                  </div>

                  <div
                    v-if="tasks"
                    class="grid gap-3"
                  >
                    <UCard
                      v-for="task in tasks"
                      :key="task.id"
                      :ui="{ body: { padding: 'p-4' } }"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex-1">
                          <div class="font-medium">
                            {{ task.title }}
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <UBadge
                            :color="getPriorityColor(task.priority)"
                            variant="subtle"
                          >
                            {{ task.priority }}
                          </UBadge>
                          <UBadge
                            :color="getStatusColor(task.status)"
                            variant="subtle"
                          >
                            {{ task.status }}
                          </UBadge>
                        </div>
                      </div>
                    </UCard>
                  </div>
                </div>
              </div>

              <div
                v-if="item.label === 'Upload'"
                class="p-6"
              >
                <div class="max-w-md mx-auto space-y-4">
                  <h3 class="text-lg font-semibold">
                    Upload Files
                  </h3>

                  <UFormField label="Select Files">
                    <input
                      type="file"
                      multiple
                      class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      @change="handleFileSelect"
                    >
                  </UFormField>

                  <div
                    v-if="selectedFiles.length > 0"
                    class="space-y-2"
                  >
                    <div
                      v-for="(file, index) in selectedFiles"
                      :key="index"
                      class="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    >
                      {{ file.name }}
                    </div>
                  </div>

                  <div
                    v-if="isUploading"
                    class="space-y-2"
                  >
                    <UProgress
                      :value="uploadProgress"
                      :max="100"
                      color="primary"
                    />
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ Math.round(uploadProgress) }}%
                    </div>
                  </div>

                  <UButton
                    icon="i-lucide-upload"
                    :disabled="selectedFiles.length === 0 || isUploading"
                    :loading="isUploading"
                    block
                    @click="handleUpload"
                  >
                    Upload
                  </UButton>
                </div>
              </div>

              <div
                v-if="item.label === 'Download'"
                class="p-6"
              >
                <div class="max-w-md mx-auto space-y-4">
                  <h3 class="text-lg font-semibold">
                    Download Report
                  </h3>

                  <UCard :ui="{ body: { padding: 'p-4' } }">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <UIcon
                          name="i-lucide-file-text"
                          class="text-2xl text-warning-500"
                        />
                        <div>
                          <div class="font-medium">
                            report.pdf
                          </div>
                          <div class="text-sm text-gray-500">
                            1 MB
                          </div>
                        </div>
                      </div>
                      <UButton
                        icon="i-lucide-download"
                        :disabled="isDownloading"
                        @click="handleDownloadReport"
                      >
                        Download
                      </UButton>
                    </div>
                  </UCard>

                  <div
                    v-if="isDownloading"
                    class="space-y-2"
                  >
                    <UProgress
                      :value="downloadProgress"
                      :max="100"
                      color="primary"
                    />
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Downloading... {{ Math.round(downloadProgress) }}%
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </UTabs>
        </UCard>
      </div>
    </div>
  </UApp>
</template>
