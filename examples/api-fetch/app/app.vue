<script setup lang="ts">
import type { ApiResponse, PageResponse, UserInfo } from '~/types/api'

const config = useRuntimeConfig()
const { token, user: currentUser, isAuthenticated, initAuth, login } = useAuth()

const toast = useToast()
const page = ref(0)
const size = ref(10)
const selectedUserId = ref<string>('')

onMounted(async () => {
  await initAuth()
  if (!isAuthenticated.value) {
    try {
      await login({
        email: config.public.defaultEmail,
        password: config.public.defaultPassword
      })
    } catch (error) {
      toast.add({
        title: '自动登录失败',
        description: '请手动登录',
        color: 'error'
      })
    }
  }
})

const usersData = ref<PageResponse<UserInfo> | null>(null)
const usersStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function fetchUsers() {
  if (!token.value) {
    return
  }

  usersStatus.value = 'pending'
  try {
    const response = await $fetch<ApiResponse<PageResponse<UserInfo>>>('/api/system/users', {
      baseURL: config.public.apiBaseUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      query: {
        page: page.value,
        size: size.value
      }
    })

    if (response.code === 0 && response.data) {
      usersData.value = response.data
      usersStatus.value = 'success'
    } else {
      throw new Error(response.message || '获取用户列表失败')
    }
  } catch (error: any) {
    usersStatus.value = 'error'
    toast.add({
      title: '获取失败',
      description: error.message || '获取用户列表失败',
      color: 'error'
    })
  }
}

watch(isAuthenticated, (newVal) => {
  if (newVal) {
    fetchUsers()
  }
}, { immediate: true })

const userDetail = ref<UserInfo | null>(null)
const userDetailStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function fetchUserDetail() {
  if (!token.value || !selectedUserId.value) {
    return
  }

  userDetailStatus.value = 'pending'
  try {
    const response = await $fetch<ApiResponse<UserInfo>>(`/api/system/users/${selectedUserId.value}`, {
      baseURL: config.public.apiBaseUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.code === 0 && response.data) {
      userDetail.value = response.data
      userDetailStatus.value = 'success'
    } else {
      throw new Error(response.message || '获取用户详情失败')
    }
  } catch (error: any) {
    userDetailStatus.value = 'error'
    toast.add({
      title: '获取失败',
      description: error.message || '获取用户详情失败',
      color: 'error'
    })
  }
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-6xl mx-auto space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                用户列表
              </h2>
              <UBadge
                :color="usersStatus === 'pending' ? 'neutral' : usersStatus === 'success' ? 'success' : 'error'"
                variant="subtle"
              >
                {{ usersStatus }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <UButton
                icon="i-lucide-refresh-cw"
                :loading="usersStatus === 'pending'"
                @click="fetchUsers"
              >
                刷新
              </UButton>
              <div
                v-if="usersData"
                class="text-sm text-gray-500"
              >
                共 {{ usersData.totalElements }} 条,第 {{ usersData.number + 1 }}/{{ usersData.totalPages }} 页
              </div>
            </div>

            <div
              v-if="usersData?.content"
              class="grid gap-3"
            >
              <UCard
                v-for="user in usersData.content"
                :key="user.id"
                :ui="{ body: { padding: 'p-3' } }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <UAvatar
                      :src="user.avatar"
                      :alt="user.nickname"
                      size="md"
                    />
                    <div>
                      <div class="font-medium">
                        {{ user.nickname }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                  <UBadge
                    :color="user.status === 'ACTIVE' ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ user.status }}
                  </UBadge>
                </div>
              </UCard>
            </div>

            <div
              v-if="usersData"
              class="flex items-center justify-between pt-3"
            >
              <UButton
                :disabled="usersData.first || usersStatus === 'pending'"
                variant="outline"
                @click="() => { page--; fetchUsers() }"
              >
                上一页
              </UButton>
              <UButton
                :disabled="usersData.last || usersStatus === 'pending'"
                variant="outline"
                @click="() => { page++; fetchUsers() }"
              >
                下一页
              </UButton>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              获取用户详情
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField label="选择用户">
              <USelectMenu
                v-model="selectedUserId"
                :options="usersData?.content.map(u => ({ label: u.nickname, value: u.id })) || []"
                value-key="value"
                placeholder="请选择用户"
              />
            </UFormField>

            <UButton
              icon="i-lucide-search"
              :loading="userDetailStatus === 'pending'"
              :disabled="!selectedUserId"
              block
              @click="fetchUserDetail"
            >
              获取详情
            </UButton>

            <UCard
              v-if="userDetail"
              :ui="{ body: { padding: 'p-4' } }"
            >
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-500">ID</span>
                  <span class="font-medium text-xs">{{ userDetail.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">用户名</span>
                  <span class="font-medium">{{ userDetail.username }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">昵称</span>
                  <span class="font-medium">{{ userDetail.nickname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">邮箱</span>
                  <span class="font-medium">{{ userDetail.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">手机号</span>
                  <span class="font-medium">{{ userDetail.phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">部门</span>
                  <span class="font-medium">{{ userDetail.deptName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">状态</span>
                  <UBadge
                    :color="userDetail.status === 'ACTIVE' ? 'success' : 'neutral'"
                    variant="subtle"
                  >
                    {{ userDetail.status }}
                  </UBadge>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">创建时间</span>
                  <span class="font-medium text-xs">{{ userDetail.createdAt }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </UCard>
      </div>
    </div>
  </UApp>
</template>
