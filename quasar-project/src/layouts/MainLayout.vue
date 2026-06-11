<template>
  <q-layout view="lhh LpR lf">
    <!-- ===== HEADER ===== -->
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <!-- Hamburger toggle -->
        <q-btn
          flat
          round
          dense
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          color="white"
          size="md"
          class="header-icon-btn"
          @click="toggleLeftDrawer"
        >
          <q-tooltip>{{ leftDrawerOpen ? 'ย่อเมนู' : 'ขยายเมนู' }}</q-tooltip>
        </q-btn>

        <q-toolbar-title class="app-title">
          <span class="app-title-leaf"><q-icon name="grass" size="18px" /></span>
          <span class="app-title-text"> ระบบบริหารคลังความรู้หญ้าแฝก </span>
        </q-toolbar-title>

        <q-space />

        <!-- ผู้ใช้ที่ล็อกอิน -->
        <div v-if="isLoggedIn" class="user-badge gt-xs">
          <q-icon name="account_circle" size="16px" />
          <span>{{ firstName }}</span>
          <div v-if="isSuperAdmin" class="super-crown">
            <q-icon name="workspace_premium" size="16px" color="amber-4" />
            <q-tooltip>Super Administrator</q-tooltip>
          </div>
        </div>

        <q-btn
          v-if="isLoggedIn"
          flat
          round
          dense
          icon="logout"
          color="white"
          size="md"
          class="header-icon-btn"
          @click="handleLogout"
        >
          <q-tooltip>ออกจากระบบ</q-tooltip>
        </q-btn>

        <!-- ยังไม่ล็อกอิน → จุดเคลื่อนไหว -->
        <div v-else class="header-dots gt-xs">
          <span class="dot dot-1" />
          <span class="dot dot-2" />
          <span class="dot dot-3" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- ===== SIDEBAR DRAWER (ย่อ/ขยายได้) ===== -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :mini="sidebarMini"
      :mini-width="64"
      :breakpoint="768"
      bordered
      class="app-drawer"
      @mouseover="onSidebarHover(true)"
      @mouseleave="onSidebarHover(false)"
    >
      <div class="drawer-body">
        <!-- Brand -->
        <div class="drawer-brand">
          <div class="drawer-brand-icon">
            <q-icon name="grass" size="22px" color="white" />
          </div>
          <span v-if="!sidebarMini || sidebarHovered" class="drawer-brand-name">
            คลังความรู้หญ้าแฝก
          </span>
        </div>

        <!-- Nav -->
        <q-scroll-area class="drawer-scroll">
          <div class="nav-wrap">
            <div v-if="!sidebarMini || sidebarHovered" class="nav-section-label">หัวข้อความรู้</div>

            <!-- LOADING -->
            <template v-if="loading">
              <div v-for="n in 6" :key="n" class="nav-item nav-item--skeleton">
                <q-skeleton type="QAvatar" size="30px" />
                <q-skeleton v-if="!sidebarMini || sidebarHovered" type="text" width="62%" />
              </div>
            </template>

            <!-- ERROR -->
            <div
              v-else-if="error"
              class="nav-feedback nav-feedback--error"
              :class="{ 'nav-feedback--mini': sidebarMini && !sidebarHovered }"
            >
              <q-icon name="cloud_off" size="26px" />
              <template v-if="!sidebarMini || sidebarHovered">
                <p>{{ error }}</p>
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="refresh"
                  label="ลองอีกครั้ง"
                  class="nav-retry"
                  @click="fetchTopics"
                />
              </template>
            </div>

            <!-- EMPTY -->
            <div v-else-if="!menu.length" class="nav-feedback">
              <q-icon name="grass" size="26px" />
              <p v-if="!sidebarMini || sidebarHovered">ยังไม่มีหัวข้อ</p>
            </div>

            <!-- LIST -->
            <template v-else>
              <q-item
                v-for="m in menu"
                :key="m.slug"
                clickable
                v-ripple
                :to="`/section/${m.id}`"
                class="nav-item"
                :class="{ 'nav-item--active': activeId === m.id }"
                @click="onNavClick"
              >
                <q-item-section avatar class="nav-avatar">
                  <q-avatar
                    size="30px"
                    rounded
                    :style="
                      activeId === m.id
                        ? { background: 'rgba(255,255,255,0.18)', color: '#fff' }
                        : { background: m.accent + '22', color: m.accent }
                    "
                  >
                    <q-icon :name="m.icon" size="18px" />
                  </q-avatar>
                </q-item-section>

                <q-item-section v-if="!sidebarMini || sidebarHovered">
                  <q-item-label class="nav-label">{{ m.title }}</q-item-label>
                  <q-item-label caption class="nav-caption">{{ m.caption }}</q-item-label>
                </q-item-section>

                <q-tooltip
                  v-if="sidebarMini && !sidebarHovered"
                  anchor="center right"
                  self="center left"
                >
                  {{ m.title }}
                </q-tooltip>
              </q-item>
            </template>
          </div>
        </q-scroll-area>
      </div>
    </q-drawer>

    <!-- ===== PAGE ===== -->
    <q-page-container>
      <div class="page-content">
        <router-view />
      </div>
    </q-page-container>

    <!-- ===== FOOTER ===== -->
    <q-footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-col footer-col--brand">
            <div class="footer-brand">
              <div class="footer-brand-icon">
                <q-icon name="grass" size="20px" color="white" />
              </div>
              <span class="footer-brand-name">ระบบคลังความรู้หญ้าแฝก</span>
            </div>
            <p class="footer-desc">แหล่งรวบรวมความรู้เกี่ยวกับหญ้าแฝก</p>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">เมนูทางลัด</div>

            <div v-if="loading" class="footer-links">
              <q-skeleton v-for="n in 4" :key="n" type="text" width="70%" dark />
            </div>

            <div v-else class="footer-links">
              <router-link
                v-for="m in menu"
                :key="m.slug"
                :to="`/section/${m.id}`"
                class="footer-link"
                :class="{ 'footer-link--active': activeId === m.id }"
              >
                <q-icon :name="m.icon" size="14px" class="q-mr-xs" />{{ m.title }}
              </router-link>
            </div>
          </div>

          <div class="footer-col">
            <div class="footer-col-title">ติดต่อสอบถาม</div>
            <div class="footer-contacts">
              <a
                href="https://webapp.ldd.go.th/ICTWeb/index.php"
                target="_blank"
                class="footer-contact-item footer-link"
              >
                <q-icon name="apartment" size="15px" class="footer-contact-icon" />
                <span>ศูนย์เทคโนโลยีสารสนเทศฯ กรมพัฒนาที่ดิน</span>
              </a>
              <div class="footer-contact-item">
                <q-icon name="account_circle" size="15px" class="footer-contact-icon" />
                <span>กลุ่มฐานข้อมูลสารสนเทศ</span>
              </div>
              <div class="footer-contact-item">
                <q-icon name="call" size="15px" class="footer-contact-icon" />
                <span>02-562-5100 ต่อ 1328</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-divider" />

        <div class="footer-bottom">
          <span>กรมพัฒนาที่ดิน ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900</span>
          <span class="footer-bottom-sep gt-xs">·</span>
          <span>โทร. 1760 ต่อ 1275</span>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import axios, { type AxiosError } from 'axios';
import { api } from 'src/boot/axios';

// ─── Types ──────────────────────────────────────────────────────────────────
interface TopicApi {
  id?: number | string;
  slug: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
  _count?: { sections?: number };
}
interface MenuItem {
  id: string;
  slug: string;
  title: string;
  caption: string;
  icon: string;
  accent: string;
}

// ─── Design defaults ─────────────────────────────────────────────────────────
const ACCENT_PALETTE = ['#6fa44e', '#3f7d3a', '#a9772f', '#4f9d56', '#3f8fb0', '#7a8c3a'] as const;
const ICON_PALETTE = ['eco', 'grass', 'landscape', 'water_drop', 'recycling', 'park'] as const;
const pick = <T,>(arr: readonly T[], i: number): T => arr[i % arr.length]!;

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

// ─── Drawer state (ย่อ/ขยาย เหมือน backoffice) ───────────────────────────────
const leftDrawerOpen = ref<boolean>(true);
const sidebarMini = ref<boolean>(false);
const sidebarHovered = ref<boolean>(false);

const toggleLeftDrawer = (): void => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const onSidebarHover = (state: boolean): void => {
  if (sidebarMini.value) sidebarHovered.value = state;
};

// ─── Menu state ──────────────────────────────────────────────────────────────
const menu = ref<MenuItem[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const activeId = computed<string>(() => String(route.params.id ?? ''));

// ─── Auth state (อ่านจาก localStorage เหมือน backoffice) ─────────────────────
const firstName = ref<string>('');
const userRole = ref<string>('');
const isLoggedIn = computed<boolean>(() => !!firstName.value);
const isSuperAdmin = computed<boolean>(() => userRole.value === 'superAdmin');

const readLS = (key: string): string => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key) ?? '';
};
const syncAuthState = (): void => {
  firstName.value = readLS('firstName');
  userRole.value = readLS('role');
};

const AUTH_KEYS: readonly string[] = [
  'accessToken',
  'refreshToken',
  'username',
  'userId',
  'firstName',
  'role',
];
const handleLogout = (): void => {
  if (typeof window !== 'undefined') {
    AUTH_KEYS.forEach((k) => window.localStorage.removeItem(k));
  }
  syncAuthState();
  // TODO: ปรับ path ให้ตรงกับหน้า login ของโปรเจกต์ (ถ้ามี)
  void router.push('/login');
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const normalizeMenu = (raw: TopicApi, i: number): MenuItem => ({
  id: String(raw.id ?? raw.slug),
  slug: raw.slug,
  title: raw.title?.trim() || 'ไม่มีชื่อหัวข้อ',
  caption: raw.subtitle?.trim() || 'ดูรายละเอียด',
  icon: raw.icon?.trim() || pick(ICON_PALETTE, i),
  accent: raw.accent?.trim() || pick(ACCENT_PALETTE, i),
});
const resolveError = (e: unknown): string => {
  const ax = e as AxiosError;
  if (ax.response?.status) return `เซิร์ฟเวอร์ตอบกลับสถานะ ${ax.response.status}`;
  if (ax.message) return ax.message;
  return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
};

// ─── Data fetching ──────────────────────────────────────────────────────────
let abortController: AbortController | null = null;
const fetchTopics = async (): Promise<void> => {
  abortController?.abort();
  abortController = new AbortController();
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get<TopicApi[]>('/topic/all', { signal: abortController.signal });
    const data = Array.isArray(res.data) ? res.data : [];
    menu.value = data.map(normalizeMenu);
    if (menu.value.length && !activeId.value) {
      void router.replace(`/section/${menu.value[0]!.id}`);
    }
  } catch (e) {
    if (axios.isCancel(e)) return;
    error.value = resolveError(e);
    menu.value = [];
  } finally {
    loading.value = false;
  }
};

// ─── Actions ────────────────────────────────────────────────────────────────
/** ปิด drawer อัตโนมัติบนจอเล็กเมื่อกดเมนู */
const onNavClick = (): void => {
  if (!$q.screen.gt.sm) leftDrawerOpen.value = false;
};

// ปิด drawer ทุกครั้งที่เปลี่ยนหน้า (จอเล็ก) + sync auth
watch(
  () => route.params.id,
  () => {
    if (!$q.screen.gt.sm) leftDrawerOpen.value = false;
  },
);
watch(() => route.path, syncAuthState, { immediate: true });

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  void fetchTopics();
  syncAuthState();
});
onUnmounted(() => {
  abortController?.abort();
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600;700&display=swap');

/* ── palette (ใบ/ดิน/น้ำ) ── */
$forest: #2f5e34;
$forest-deep: #1b3a20;
$forest-btn: #3f7d3a;
$leaf-bright: #a7d36a;

/* ═════════ HEADER ═════════ */
.app-header {
  background: linear-gradient(135deg, #16320f 0%, #2f5e34 50%, #3f7d3a 100%) !important;
  box-shadow: 0 2px 20px rgba(20, 40, 20, 0.4) !important;
}
.app-toolbar {
  min-height: 58px;
  height: auto;
  padding: 8px 16px;
  gap: 12px;
}
.header-icon-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 10px !important;
  transition:
    background 0.2s,
    transform 0.15s !important;
  flex-shrink: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: scale(1.05);
  }
}
.app-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.app-title-leaf {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 35% 30%, #d6f0a0 0%, #8cc152 40%, #3f7d3a 100%);
  color: #16320f;
  box-shadow: 0 0 14px rgba(167, 211, 106, 0.5);
}
.app-title-text {
  font-family: 'Kanit', sans-serif;
  font-size: clamp(13px, 3.5vw, 1.05rem);
  font-weight: 700;
  color: #fff;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;
  letter-spacing: 0.2px;
}
.user-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 20px;
  padding: 5px 13px;
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Sarabun', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}
.super-crown {
  display: flex;
  align-items: center;
  animation: crown-glow 2.2s ease-in-out infinite;
}
@keyframes crown-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.6));
    opacity: 0.85;
  }
  50% {
    filter: drop-shadow(0 0 7px rgba(251, 191, 36, 0.95));
    opacity: 1;
  }
}
.header-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}
.dot {
  border-radius: 50%;
  display: block;
  opacity: 0.6;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
.dot-1 {
  width: 6px;
  height: 6px;
  background: $leaf-bright;
}
.dot-2 {
  width: 8px;
  height: 8px;
  background: #fff;
  animation-delay: 0.2s;
}
.dot-3 {
  width: 6px;
  height: 6px;
  background: #8cc152;
  animation-delay: 0.4s;
}
@keyframes dot-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

/* ═════════ DRAWER ═════════ */
.app-drawer :deep(.q-drawer__content) {
  display: flex;
  flex-direction: column;
}
.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(20, 40, 20, 0.08);
  flex-shrink: 0;
}
.drawer-brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8cc152, #3f7d3a);
  box-shadow: 0 4px 12px -4px rgba(63, 125, 58, 0.7);
}
.drawer-brand-name {
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1a221a;
  white-space: nowrap;
}

.drawer-scroll {
  flex: 1;
}
.nav-wrap {
  padding: 10px 8px;
}
.nav-section-label {
  font-family: 'Kanit', sans-serif;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 0.68rem;
  text-transform: uppercase;
  color: #9aa48d;
  padding: 6px 10px 8px;
}

/* nav item */
.nav-item {
  border-radius: 12px;
  margin-bottom: 2px;
  min-height: 48px;
  color: #1a221a;
  transition:
    background 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.4, 0.64, 1),
    box-shadow 0.2s ease;
}
.nav-item:hover {
  background: rgba(111, 164, 78, 0.1);
  transform: translateX(6px);
}
.nav-item :deep(.q-avatar) {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item:hover :deep(.q-avatar) {
  transform: scale(1.14) rotate(-6deg);
}

.nav-avatar {
  min-width: 40px;
}
.nav-label {
  font-family: 'Sarabun', sans-serif;
  font-size: 0.93rem;
  font-weight: 600;
  color: #1a221a;
}
.nav-caption {
  font-family: 'Sarabun', sans-serif;
  font-size: 0.74rem;
  color: #8b9183;
}
.nav-item--active {
  background: linear-gradient(135deg, #1b3a20, #2f5e34, #3f7d3a);
  border-left: 3px solid #4f9d56;
  box-shadow: 0 6px 16px -8px rgba(47, 94, 52, 0.8);
}
.nav-item--active .nav-label {
  color: #fff;
}
.nav-item--active .nav-caption {
  color: rgba(255, 255, 255, 0.75);
}
.nav-item--active:hover {
  background: linear-gradient(135deg, #1b3a20, #2f5e34, #3f7d3a);
}

/* skeleton / feedback */
.nav-item--skeleton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
}
.nav-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 14px;
  text-align: center;
  color: #7b8270;
  font-family: 'Sarabun', sans-serif;
  font-size: 0.86rem;
}
.nav-feedback p {
  margin: 0;
  word-break: break-word;
}
.nav-feedback--error {
  color: #9c5a3c;
}
.nav-feedback--mini {
  padding: 18px 4px;
}
.nav-retry {
  margin-top: 4px;
  font-family: 'Kanit', sans-serif;
  color: $forest-btn;
}

/* collapse toggle */
.drawer-collapse {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  margin: 8px;
  border-radius: 10px;
  color: #5a6450;
  cursor: pointer;
  border: 1px solid rgba(20, 40, 20, 0.1);
  background: #fff;
  flex-shrink: 0;
  transition: background 0.2s ease;
}
.drawer-collapse:hover {
  background: rgba(111, 164, 78, 0.1);
}
.drawer-collapse-text {
  font-family: 'Kanit', sans-serif;
  font-size: 0.82rem;
}

/* ═════════ PAGE ═════════ */
.page-content {
  min-height: 60vh;
  background: linear-gradient(150deg, #f3f5ec 0%, #eef3e6 50%, #f1f6ea 100%);
}

/* ═════════ FOOTER (โทนเขียว · โครงสร้างตาม backoffice) ═════════ */
.site-footer {
  background: linear-gradient(135deg, #14301a 0%, #1b3a20 50%, #2f5e34 100%) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'Sarabun', sans-serif;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 1.5rem;
  @media (max-width: 600px) {
    padding: 2rem 1rem 1.25rem;
  }
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 2.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }
}
.footer-col {
  min-width: 0;
}
.footer-col-title {
  font-family: 'Kanit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.9rem;
  @media (max-width: 480px) {
    justify-content: center;
  }
}
.footer-brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.footer-brand-name {
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}
.footer-desc {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.75;
  margin: 0;
}
.footer-links,
.footer-contacts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 480px) {
    align-items: center;
  }
}
.footer-link {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.86rem;
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);

  :deep(.q-icon) {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  &:hover {
    color: #d9efb2;
    transform: translateX(6px);
  }
  &:hover :deep(.q-icon) {
    transform: scale(1.25) rotate(-8deg);
  }
}
.footer-link--active {
  color: #d9efb2;
  font-weight: 600;
}
.footer-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.84rem;
  line-height: 1.5;
  @media (max-width: 480px) {
    justify-content: center;
    align-items: center;
  }
}
.footer-contact-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: $leaf-bright;
  opacity: 0.85;
}
.footer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 2rem 0 1.25rem;
}
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.6;
}
.footer-bottom-sep {
  opacity: 0.4;
}
@media (max-width: 480px) {
  .footer-bottom {
    flex-direction: column;
    gap: 4px;
  }
}

/* a11y */
@media (prefers-reduced-motion: reduce) {
  .header-icon-btn,
  .nav-item,
  .nav-item :deep(.q-avatar),
  .footer-link,
  .footer-link :deep(.q-icon),
  .drawer-collapse {
    transition: none;
  }
  .header-icon-btn:hover,
  .nav-item:hover,
  .nav-item:hover :deep(.q-avatar),
  .footer-link:hover,
  .footer-link:hover :deep(.q-icon) {
    transform: none;
  }
  .super-crown,
  .dot {
    animation: none;
  }
}
</style>
