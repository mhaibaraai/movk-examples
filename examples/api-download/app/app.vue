<script setup lang="ts">
interface FileItem {
  id: string
  name: string
  size: number
  type: string
}

const files = ref<FileItem[]>([
  { id: '1', name: 'document.pdf', size: 2048576, type: 'application/pdf' },
  { id: '2', name: 'image.png', size: 512000, type: 'image/png' },
  { id: '3', name: 'data.json', size: 102400, type: 'application/json' }
])

const downloadHistory = ref<Array<{ file: FileItem, downloadedAt: string }>>([])

const { progress, isDownloading, error, download, cancel } = useDownloadWithProgress()

async function handleDownload(file: FileItem) {
  const blob = await download(`/api/download/${file.id}`)

  if (blob) {
    downloadHistory.value.unshift({
      file,
      downloadedAt: new Date().toISOString()
    })
  }
}

function handleCancel() {
  cancel()
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return 'i-lucide-image'
  if (type.startsWith('video/')) return 'i-lucide-video'
  if (type === 'application/pdf') return 'i-lucide-file-text'
  if (type === 'application/json') return 'i-lucide-braces'
  return 'i-lucide-file'
}

function getFileColor(type: string) {
  if (type.startsWith('image/')) return 'primary'
  if (type.startsWith('video/')) return 'error'
  if (type === 'application/pdf') return 'warning'
  if (type === 'application/json') return 'success'
  return 'neutral'
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              Available Files
            </h2>
          </template>

          <div class="space-y-3">
            <UCard
              v-for="file in files"
              :key="file.id"
              :ui="{ body: { padding: 'p-4' } }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <UIcon
                    :name="getFileIcon(file.type)"
                    class="text-3xl"
                    :class="`text-${getFileColor(file.type)}-500`"
                  />
                  <div>
                    <div class="font-medium">
                      {{ file.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatBytes(file.size) }}
                    </div>
                  </div>
                </div>
                <UButton
                  icon="i-lucide-download"
                  :disabled="isDownloading"
                  @click="handleDownload(file)"
                >
                  Download
                </UButton>
              </div>
            </UCard>
          </div>

          <template
            v-if="isDownloading"
            #footer
          >
            <div class="space-y-3">
              <UProgress
                :value="progress"
                :max="100"
                color="primary"
              />
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  Downloading... {{ Math.round(progress) }}%
                </span>
                <UButton
                  icon="i-lucide-x"
                  size="xs"
                  color="error"
                  variant="outline"
                  @click="handleCancel"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </template>
        </UCard>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-alert-circle"
          :title="error"
        />

        <UCard v-if="downloadHistory.length > 0">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                Download History
              </h2>
              <UBadge
                color="success"
                variant="subtle"
              >
                {{ downloadHistory.length }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <UCard
              v-for="(record, index) in downloadHistory"
              :key="index"
              :ui="{ body: { padding: 'p-4' } }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <UIcon
                    name="i-lucide-check-circle"
                    class="text-2xl text-green-500"
                  />
                  <div>
                    <div class="font-medium">
                      {{ record.file.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatBytes(record.file.size) }} • {{ new Date(record.downloadedAt).toLocaleString() }}
                    </div>
                  </div>
                </div>
                <UBadge
                  :color="getFileColor(record.file.type)"
                  variant="subtle"
                >
                  {{ record.file.type.split('/')[1] }}
                </UBadge>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>
    </div>
  </UApp>
</template>
