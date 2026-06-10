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

        <!-- Brand : a leaf mark tying the header to the vetiver theme -->
        <q-toolbar-title class="row items-center no-wrap">
          <div class="leaf-mark q-mr-sm">
            <q-icon name="grass" size="20px" />
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
          <q-badge color="amber-5" text-color="dark" floating>3</q-badge>
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
        <div class="text-caption welcome-sub">ยินดีต้อนรับสู่คลังความรู้หญ้าแฝก</div>
      </div>

      <q-scroll-area class="drawer-scroll">
        <q-list padding>
          <q-item-label header class="section-label">หัวข้อความรู้</q-item-label>

          <q-item
            v-for="m in menu"
            :key="m.slug"
            v-ripple
            clickable
            :active="activeMenu === m.slug"
            active-class="menu-active"
            class="menu-item"
            @click="selectMenu(m.slug)"
          >
            <q-item-section avatar>
              <q-avatar
                size="34px"
                rounded
                :style="{ background: m.accent + '22', color: m.accent }"
              >
                <q-icon :name="m.icon" size="20px" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="menu-title">{{ m.title }}</q-item-label>
              <q-item-label caption>{{ m.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Drawer footer -->
      <div class="absolute-bottom q-pa-md">
        <q-btn
          unelevated
          rounded
          color="green-8"
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

const $q = useQuasar();

interface MenuItem {
  slug: string;
  title: string;
  caption: string;
  icon: string;
  accent: string;
}

// หัวข้อตรงกับข้อมูลในหน้า Index (หญ้าแฝก)
const menu: MenuItem[] = [
  { slug: 'what-is-vetiver', title: 'หญ้าแฝกคืออะไร', caption: 'รู้จักหญ้าแฝก', icon: 'help', accent: '#6fa44e' },
  { slug: 'benefits', title: 'ประโยชน์ของหญ้าแฝก', caption: 'ทำอะไรได้บ้าง', icon: 'eco', accent: '#3f7d3a' },
  { slug: 'soil-prep', title: 'การเตรียมดิน', caption: 'ก่อนลงปลูก', icon: 'landscape', accent: '#a9772f' },
  { slug: 'planting', title: 'การปลูกหญ้าแฝก', caption: 'วิธีปลูก', icon: 'grass', accent: '#4f9d56' },
  { slug: 'care', title: 'การดูแลรักษา', caption: 'ดูแลหลังปลูก', icon: 'water_drop', accent: '#3f8fb0' },
  { slug: 'usage', title: 'การใช้หญ้าแฝก', caption: 'นำไปใช้จริง', icon: 'recycling', accent: '#7a8c3a' },
];

const leftDrawerOpen = ref(false);
const search = ref('');
const activeMenu = ref<string>('what-is-vetiver');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  $q.dark.toggle();
}

function selectMenu(slug: string) {
  activeMenu.value = slug;
  // ปิด drawer อัตโนมัติบนจอเล็ก
  if (!$q.screen.gt.sm) leftDrawerOpen.value = false;
  // TODO: เชื่อมกับการสลับหัวข้อในหน้า Index
  // เช่น router.push({ name: 'topic', params: { slug } })
  // หรือใช้ Pinia store ร่วมกับ IndexPage เพื่อ set activeSlug
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');

/* ── palette (เข้าชุดกับหน้า Index: ใบ/ดิน/น้ำ) ──
   forest  #2F5E34  botanical green (header)
   deep    #1B3A20  deep green
   leaf    #A7D36A  luminous leaf accent (used with restraint)
*/

/* Header: a botanical-green gradient with a soft leaf glow as signature */
.app-header {
  background:
    radial-gradient(circle at 18% 50%, rgba(167, 211, 106, 0.35), transparent 45%),
    linear-gradient(120deg, #2f5e34 0%, #1b3a20 100%);
  box-shadow: 0 2px 18px rgba(20, 40, 20, 0.4);
}

/* The glowing leaf mark — the one bold thing on the bar */
.leaf-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #d6f0a0 0%, #8cc152 40%, #3f7d3a 100%);
  color: #16320f;
  box-shadow:
    0 0 0 2px rgba(167, 211, 106, 0.25),
    0 0 16px rgba(167, 211, 106, 0.65);
}

.brand-text {
  font-family: 'Kanit', sans-serif;
  letter-spacing: 0.3px;
  font-size: 1.05rem;
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
    0 0 0 2px rgba(167, 211, 106, 0.65),
    0 0 12px rgba(167, 211, 106, 0.45);
}

/* Drawer */
.drawer-hero {
  background:
    radial-gradient(circle at 80% 0%, rgba(167, 211, 106, 0.4), transparent 55%),
    linear-gradient(135deg, #2f5e34 0%, #1b3a20 100%);
  font-family: 'Sarabun', sans-serif;
}
.welcome-sub {
  color: #cfe8a8;
}

.drawer-scroll {
  height: calc(100% - 270px); /* hero ≈ 190px + footer ≈ 80px */
}

.section-label {
  font-family: 'Kanit', sans-serif;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  opacity: 0.6;
}

/* drawer menu items */
.menu-item {
  border-radius: 12px;
  margin: 3px 10px;
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.menu-title {
  font-family: 'Sarabun', sans-serif;
  font-weight: 600;
}
.menu-item:hover {
  background: rgba(111, 164, 78, 0.12);
  transform: translateX(4px);
}
.menu-active {
  background: rgba(111, 164, 78, 0.16);
  box-shadow: inset 3px 0 0 #4f9d56;
  color: #2f5e34;
}

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .search-box,
  .menu-item {
    transition: none;
  }
  .menu-item:hover {
    transform: none;
  }
}
</style>