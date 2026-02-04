<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
import UserDropdown from '@/components/UserDropdown.vue'
</script>
<template>
  <div class="ml-1">
    <UserDropdown placement="bottom-end">
      <div class="size-9 cursor-pointer">
        <UserAvatar />
      </div>
    </UserDropdown>
  </div>
</template>
