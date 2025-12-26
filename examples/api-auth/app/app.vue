<script setup lang="ts">
const config = useRuntimeConfig()
const { user, isAuthenticated, login, logout, fetchUserInfo, initAuth } = useAuth()

const email = ref(config.public.defaultEmail)
const password = ref(config.public.defaultPassword)
const isLoggingIn = ref(false)
const errorMessage = ref('')

onMounted(() => {
  initAuth()
})

async function handleLogin() {
  isLoggingIn.value = true
  errorMessage.value = ''
  try {
    await login({
      email: email.value,
      password: password.value
    })
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败,请检查邮箱和密码'
  } finally {
    isLoggingIn.value = false
  }
}

async function handleLogout() {
  await logout()
}

async function handleRefreshUserInfo() {
  try {
    await fetchUserInfo()
  } catch (error: any) {
    console.error('刷新用户信息失败:', error)
  }
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <UCard v-if="!isAuthenticated">
          <template #header>
            <h2 class="text-xl font-semibold">
              用户登录
            </h2>
          </template>

          <div class="space-y-4">
            <UAlert
              v-if="errorMessage"
              color="error"
              variant="subtle"
              icon="i-lucide-alert-circle"
              :title="errorMessage"
            />

            <UFormField label="邮箱">
              <UInput
                v-model="email"
                icon="i-lucide-mail"
                type="email"
                :placeholder="config.public.defaultEmail"
              />
            </UFormField>

            <UFormField label="密码">
              <UInput
                v-model="password"
                icon="i-lucide-lock"
                type="password"
                placeholder="请输入密码"
              />
            </UFormField>

            <UButton
              icon="i-lucide-log-in"
              :loading="isLoggingIn"
              block
              @click="handleLogin"
            >
              登录
            </UButton>
          </div>

          <template #footer>
            <UAlert
              color="primary"
              variant="subtle"
              icon="i-lucide-info"
              title="默认测试账号"
              :description="`${config.public.defaultEmail} / ${config.public.defaultPassword}`"
            />
          </template>
        </UCard>

        <template v-else-if="user">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">
                  用户信息
                </h2>
                <UButton
                  icon="i-lucide-log-out"
                  color="error"
                  variant="outline"
                  @click="handleLogout"
                >
                  退出登录
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <UAvatar
                  :src="user.avatar"
                  :alt="user.nickname"
                  size="xl"
                />
                <div>
                  <div class="text-lg font-semibold">
                    {{ user.nickname }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                  <UBadge
                    :color="user.status === 'ACTIVE' ? 'success' : 'neutral'"
                    variant="subtle"
                    class="mt-1"
                  >
                    {{ user.status }}
                  </UBadge>
                </div>
              </div>

              <UDivider />

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-500">
                    用户 ID
                  </div>
                  <div class="font-medium text-xs">
                    {{ user.id }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    用户名
                  </div>
                  <div class="font-medium">
                    {{ user.username }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    手机号
                  </div>
                  <div class="font-medium">
                    {{ user.phone }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    部门
                  </div>
                  <div class="font-medium">
                    {{ user.deptName }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    性别
                  </div>
                  <div class="font-medium">
                    {{ user.gender }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">
                    上次登录 IP
                  </div>
                  <div class="font-medium">
                    {{ user.loginIp }}
                  </div>
                </div>
                <div class="col-span-2">
                  <div class="text-sm text-gray-500">
                    上次登录时间
                  </div>
                  <div class="font-medium text-xs">
                    {{ user.loginDate }}
                  </div>
                </div>
                <div class="col-span-2">
                  <div class="text-sm text-gray-500">
                    创建时间
                  </div>
                  <div class="font-medium text-xs">
                    {{ user.createdAt }}
                  </div>
                </div>
              </div>

              <UButton
                icon="i-lucide-refresh-cw"
                variant="outline"
                block
                @click="handleRefreshUserInfo"
              >
                刷新用户信息
              </UButton>
            </div>
          </UCard>
        </template>
      </div>
    </div>
  </UApp>
</template>
