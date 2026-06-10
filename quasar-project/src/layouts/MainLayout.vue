<template>
  <q-layout view="hHh Lpr fFf">
    <!-- ───────── HEADER ───────── -->
    <q-header class="app-header text-white">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="เปิดเมนู"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        />

        <!-- Brand : the glowing "quasar" mark is the signature element -->
        <q-toolbar-title class="row items-center no-wrap">
          <div class="quasar-mark q-mr-sm">
            <q-icon name="hub" size="20px" />
          </div>
          <span class="brand-text text-weight-bold">ระบบบริหารคลังความรู้หญ้าแฝก</span>
        </q-toolbar-title>

        <!-- Search : desktop only -->
        <q-input
          v-if="$q.screen.gt.sm"
          v-model="search"
          dense
          rounded
          standout="bg-white text-dark"
          placeholder="ค้นหา…"
          class="search-box q-mr-md"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn flat dense round icon="notifications" class="q-mr-xs">
          <q-badge color="cyan-4" text-color="dark" floating>3</q-badge>
          <q-tooltip>การแจ้งเตือน</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          class="q-mr-xs"
          @click="toggleDarkMode"
        >
          <q-tooltip>{{ $q.dark.isActive ? 'โหมดสว่าง' : 'โหมดมืด' }}</q-tooltip>
        </q-btn>

        <q-btn flat dense round>
          <q-avatar size="30px" class="avatar-ring">
            <img src="https://cdn.quasar.dev/img/avatar.png" alt="โปรไฟล์" />
          </q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- ───────── DRAWER ───────── -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      bordered
      class="app-drawer"
    >
      <!-- Profile / brand header inside drawer -->
      <div class="drawer-hero text-white q-px-lg q-py-lg">
        <q-avatar size="60px" class="avatar-ring q-mb-sm">
          <img src="https://cdn.quasar.dev/img/avatar.png" alt="โปรไฟล์" />
        </q-avatar>
        <div class="text-h6 text-weight-bold">สวัสดี 👋</div>
        <div class="text-caption text-cyan-2">ยินดีต้อนรับกลับมา</div>
      </div>

      <q-scroll-area class="drawer-scroll">
        <q-list padding>
          <q-item-label header class="section-label">
            Essential Links
          </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <!-- Drawer footer -->
      <div class="absolute-bottom q-pa-md">
        <q-btn
          unelevated
          rounded
          color="primary"
          icon="logout"
          label="ออกจากระบบ"
          class="full-width"
        />
      </div>
    </q-drawer>

    <!-- ───────── PAGE ───────── -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const $q = useQuasar();

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref(false);
const search = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  $q.dark.toggle();
}
</script>

<style scoped lang="scss">
/* ── palette ─────────────────────────────
   space      #0A0E27  deep-space indigo
   indigo     #1B2559  mid indigo
   cyan glow  #38E1F0  the luminous accent (used once, with restraint)
*/

/* Header: a deep-space gradient with a single soft cyan glow as signature */
.app-header {
  background:
    radial-gradient(circle at 18% 50%, rgba(56, 225, 240, 0.35), transparent 45%),
    linear-gradient(120deg, #0a0e27 0%, #1b2559 100%);
  box-shadow: 0 2px 18px rgba(10, 14, 39, 0.45);
}

/* The glowing quasar mark — the one bold thing on the page */
.quasar-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #7af5ff 0%, #38e1f0 40%, #1b6fa3 100%);
  color: #04121f;
  box-shadow:
    0 0 0 2px rgba(56, 225, 240, 0.25),
    0 0 16px rgba(56, 225, 240, 0.7);
}

.brand-text {
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

.search-box {
  width: 240px;
  transition: width 0.3s ease;

  &:focus-within {
    width: 300px;
  }
}

.avatar-ring {
  box-shadow:
    0 0 0 2px rgba(56, 225, 240, 0.6),
    0 0 12px rgba(56, 225, 240, 0.45);
}

/* Drawer */
.app-drawer {
  :deep(.q-drawer) {
    background: var(--q-drawer-bg, #fff);
  }
}

.drawer-hero {
  background:
    radial-gradient(circle at 80% 0%, rgba(56, 225, 240, 0.4), transparent 55%),
    linear-gradient(135deg, #0a0e27 0%, #1b2559 100%);
}

.drawer-scroll {
  height: calc(100% - 270px); /* hero ≈ 190px + footer ≈ 80px */
}

.section-label {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 0.7rem;
  opacity: 0.6;
}

/* Smooth, accent-led hover for each drawer link */
:deep(.q-item) {
  border-radius: 12px;
  margin: 3px 10px;
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    background: rgba(56, 225, 240, 0.12);
    transform: translateX(4px);
    box-shadow: inset 3px 0 0 #38e1f0;
  }
}

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .search-box,
  :deep(.q-item) {
    transition: none;
  }
  :deep(.q-item:hover) {
    transform: none;
  }
}
</style>