<script setup lang="ts">
const selectedFiles = ref<File[]>([])
const uploadResults = ref<Array<{ filename: string, size: number, type: string, uploadedAt: string }>>([])

const { progress, isUploading, error, upload, cancel } = useUploadWithProgress()

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

async function handleUpload() {
  if (selectedFiles.value.length === 0) {
    return
  }

  const formData = new FormData()
  selectedFiles.value.forEach((file) => {
    formData.append('file', file)
  })

  const result = await upload('/api/upload', formData)

  if (result) {
    uploadResults.value.unshift(result)
    selectedFiles.value = []
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
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              File Upload
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Select Files">
              <input
                type="file"
                multiple
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
                @change="handleFileSelect"
              >
            </UFormField>

            <div
              v-if="selectedFiles.length > 0"
              class="space-y-2"
            >
              <UCard
                v-for="(file, index) in selectedFiles"
                :key="index"
                :ui="{ body: { padding: 'p-3' } }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UIcon
                      name="i-lucide-file"
                      class="text-2xl text-gray-400"
                    />
                    <div>
                      <div class="font-medium text-sm">
                        {{ file.name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatBytes(file.size) }}
                      </div>
                    </div>
                  </div>
                  <UBadge
                    color="neutral"
                    variant="subtle"
                  >
                    {{ file.type || 'unknown' }}
                  </UBadge>
                </div>
              </UCard>
            </div>

            <div
              v-if="isUploading"
              class="space-y-3"
            >
              <UProgress
                :value="progress"
                :max="100"
                color="primary"
              />
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ Math.round(progress) }}%</span>
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

            <UAlert
              v-if="error"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              :title="error"
            />

            <div class="flex gap-3">
              <UButton
                icon="i-lucide-upload"
                :disabled="selectedFiles.length === 0 || isUploading"
                :loading="isUploading"
                @click="handleUpload"
              >
                Upload
              </UButton>
              <UButton
                v-if="selectedFiles.length > 0 && !isUploading"
                icon="i-lucide-trash-2"
                variant="outline"
                color="error"
                @click="selectedFiles = []"
              >
                Clear
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard v-if="uploadResults.length > 0">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                Upload History
              </h2>
              <UBadge
                color="success"
                variant="subtle"
              >
                {{ uploadResults.length }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <UCard
              v-for="(result, index) in uploadResults"
              :key="index"
              :ui="{ body: { padding: 'p-4' } }"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UIcon
                      name="i-lucide-check-circle"
                      class="text-xl text-green-500"
                    />
                    <div class="font-medium">
                      {{ result.filename }}
                    </div>
                  </div>
                  <UBadge
                    color="success"
                    variant="subtle"
                  >
                    Success
                  </UBadge>
                </div>
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div class="text-gray-500">
                      Size
                    </div>
                    <div class="font-medium">
                      {{ formatBytes(result.size) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">
                      Type
                    </div>
                    <div class="font-medium">
                      {{ result.type }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">
                      Time
                    </div>
                    <div class="font-medium text-xs">
                      {{ new Date(result.uploadedAt).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>
    </div>
  </UApp>
</template>
