<template>
  <q-page class="vetiver-page" :style="{ '--c': accent }">
    <!-- ═══════════════ HERO (หัวข้อหลัก) ═══════════════ -->
    <header class="hero">
      <svg class="roots" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round">
          <path d="M120 0 C128 70 110 120 124 220" stroke-width="2" opacity="0.5" />
          <path d="M300 0 C292 80 312 130 298 220" stroke-width="2.4" opacity="0.6" />
          <path d="M480 0 C488 60 470 140 484 220" stroke-width="1.8" opacity="0.4" />
          <path d="M650 0 C642 90 662 120 648 220" stroke-width="2.6" opacity="0.65" />
          <path d="M820 0 C828 70 808 150 822 220" stroke-width="2" opacity="0.5" />
          <path d="M980 0 C972 80 992 120 978 220" stroke-width="2.3" opacity="0.55" />
          <path d="M1100 0 C1108 60 1090 140 1104 220" stroke-width="1.8" opacity="0.4" />
        </g>
      </svg>

      <div class="hero-inner">
        <button type="button" class="back-btn" @click="router.push('/')">
          <q-icon name="arrow_back" size="18px" />
          <span>กลับ</span>
        </button>

        <div class="hero-top">
          <span class="hero-icon"><q-icon :name="topicInfo.icon" size="30px" /></span>
          <div class="eyebrow" v-if="topicInfo.subtitle">{{ topicInfo.subtitle }}</div>
        </div>

        <h1 class="hero-title">{{ topicInfo.title }}</h1>
        <p class="hero-sub" v-if="topicInfo.intro">{{ topicInfo.intro }}</p>
      </div>
    </header>

    <!-- ═══════════════ LOADING (skeleton) ═══════════════ -->
    <section v-if="loading && !sections.length" class="content" aria-busy="true">
      <div v-for="n in 3" :key="n" class="sec-card sec-card--skeleton">
        <div class="sec-head">
          <span class="sk sk-dot" />
          <span class="sk sk-heading" />
        </div>
        <div class="sec-body">
          <span class="sk sk-row" v-for="r in 3" :key="r" />
        </div>
      </div>
    </section>

    <!-- ═══════════════ ERROR ═══════════════ -->
    <div v-else-if="error" class="state state--error">
      <q-icon name="cloud_off" size="42px" />
      <p class="state-title">โหลดข้อมูลไม่สำเร็จ</p>
      <p class="state-detail">{{ error }}</p>
      <button type="button" class="retry-btn" @click="fetchSections">
        <q-icon name="refresh" size="18px" />
        <span>ลองอีกครั้ง</span>
      </button>
    </div>

    <!-- ═══════════════ EMPTY ═══════════════ -->
    <div v-else-if="!sections.length" class="state state--empty">
      <q-icon name="grass" size="42px" />
      <p class="state-title">ยังไม่มีหัวข้อย่อย</p>
      <p class="state-detail">หัวข้อนี้ยังไม่มีเนื้อหาให้แสดง</p>
      <button type="button" class="retry-btn" @click="goBack">
        <q-icon name="arrow_back" size="18px" />
        <span>กลับหน้าหลัก</span>
      </button>
    </div>

    <!-- ═══════════════ CONTENT ═══════════════ -->
    <section v-else class="content">
      <!-- progress bar (เรียนรู้แล้วกี่ %) -->
      <div class="progress-card">
        <div class="progress-top">
          <div class="progress-label">
            <q-icon name="task_alt" size="18px" />
            <span>ความคืบหน้า</span>
          </div>
          <div class="progress-count">{{ doneCount }} / {{ totalItems }}</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
        <transition name="fade">
          <div v-if="progressPct === 100" class="progress-done">
            <q-icon name="celebration" size="16px" /> เยี่ยมมาก! อ่านครบทุกข้อแล้ว 🌱
          </div>
        </transition>
      </div>

      <!-- toggle เปิด/ปิดทั้งหมด -->
      <div class="content-tools">
        <span class="content-count">{{ sections.length }} หัวข้อย่อย</span>
        <button type="button" class="tool-btn" @click="toggleAll">
          <q-icon :name="allOpen ? 'unfold_less' : 'unfold_more'" size="16px" />
          {{ allOpen ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด' }}
        </button>
      </div>

      <!-- accordion ของ section -->
      <div
        v-for="(s, idx) in sections"
        :key="s.id"
        class="sec-card"
        :class="{ 'sec-card--open': isOpen(s.id) }"
        :style="{ '--delay': idx * 60 + 'ms' }"
      >
        <button type="button" class="sec-head" @click="toggle(s.id)" :aria-expanded="isOpen(s.id)">
          <span class="sec-order">{{ s.order }}</span>
          <span class="sec-heading">{{ s.heading }}</span>
          <span class="sec-badge" v-if="sectionDone(s) === s.items.length && s.items.length">
            <q-icon name="check_circle" size="16px" />
          </span>
          <span class="sec-badge sec-badge--muted" v-else
            >{{ sectionDone(s) }}/{{ s.items.length }}</span
          >
          <q-icon name="expand_more" size="22px" class="sec-chevron" />
        </button>

        <transition name="expand">
          <ul v-show="isOpen(s.id)" class="sec-body">
            <li
              v-for="(item, i) in s.items"
              :key="i"
              class="item"
              :class="{ 'item--checked': isChecked(s.id, i) }"
              @click="toggleCheck(s.id, i)"
            >
              <span class="item-check">
                <q-icon
                  :name="isChecked(s.id, i) ? 'check_circle' : 'radio_button_unchecked'"
                  size="20px"
                />
              </span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>
        </transition>
      </div>

      <p class="content-foot">ปลูกวันนี้ เพื่อดินและน้ำของวันพรุ่งนี้ 🌱</p>
    </section>

    <!-- ═══════════════ LOADING DIALOG ═══════════════ -->
    <q-dialog v-model="showLoading" persistent no-backdrop-dismiss>
      <div class="loading-dialog">
        <div class="ld-orb-wrap">
          <div class="ld-orb-bg" />
          <div class="ld-orb-ring1" />
          <div class="ld-orb-ring2" />
          <div class="ld-orb-inner">🌱</div>
        </div>
        <div class="ld-title">กำลังโหลดข้อมูล</div>
        <div class="ld-pct-row">
          <span class="ld-pct-num">{{ loadingPercent }}</span>
          <span class="ld-pct-sym">%</span>
        </div>
        <div class="ld-sub">{{ loadingSteps[loadingStep]?.label ?? 'กำลังเริ่มต้น…' }}</div>
        <div class="ld-bar-track">
          <div class="ld-bar-fill" :style="{ width: loadingPercent + '%' }" />
        </div>
        <div class="ld-dots">
          <span class="ld-dot" /><span class="ld-dot" /><span class="ld-dot" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios, { type AxiosError } from 'axios';
import { api } from 'src/boot/axios';

// ─── Props / route ───────────────────────────────────────────────────────────
/** รับ id ผ่าน prop หรือ route param (`/topic/:id`) ก็ได้ */
const props = defineProps<{ id?: number | string }>();
const route = useRoute();
const router = useRouter();

const topicId = computed<string>(() => String(props.id ?? route.params.id ?? ''));

// ─── Types ──────────────────────────────────────────────────────────────────
interface TopicMeta {
  id: number;
  slug: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
  intro?: string;
}
/** section ดิบจาก API — `items` เป็น JSON string */
interface SectionApi {
  id: number;
  order: number;
  heading?: string;
  body?: string | null;
  items?: string;
  topicId: number;
  topic?: TopicMeta;
}
/** envelope ของ list endpoint */
interface ListResponse {
  data: SectionApi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
/** view-model ที่ใช้จริง */
interface Section {
  id: number;
  order: number;
  heading: string;
  body: string;
  items: string[];
}
interface TopicInfo {
  title: string;
  subtitle: string;
  intro: string;
  icon: string;
  accent: string;
}

// ─── State ──────────────────────────────────────────────────────────────────
const sections = ref<Section[]>([]);
const topicInfo = ref<TopicInfo>({
  title: 'หญ้าแฝก',
  subtitle: '',
  intro: '',
  icon: 'grass',
  accent: '#3f7d3a',
});
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const openIds = ref<Set<number>>(new Set());
const checked = ref<Set<string>>(new Set());

const accent = computed<string>(() => topicInfo.value.accent || '#3f7d3a');

// ─── Loading dialog ──────────────────────────────────────────────────────────
const showLoading = ref<boolean>(false);
const loadingStep = ref<number>(0);
const loadingPercent = ref<number>(0);
const loadingSteps = [
  { label: 'โหลดเนื้อหาหัวข้อย่อย', pct: 80 },
  { label: 'จัดเรียงและแสดงผล', pct: 100 },
] as const;

let pctTimer: ReturnType<typeof setInterval> | null = null;
const animatePct = (target: number): void => {
  if (pctTimer) clearInterval(pctTimer);
  const start = loadingPercent.value;
  const t0 = Date.now();
  pctTimer = setInterval(() => {
    const p = Math.min(1, (Date.now() - t0) / 800);
    loadingPercent.value = Math.round(start + (target - start) * p);
    if (p >= 1) {
      clearInterval(pctTimer!);
      pctTimer = null;
    }
  }, 16);
};
const startLoading = (): void => {
  showLoading.value = true;
  loadingStep.value = 0;
  loadingPercent.value = 0;
  animatePct(5);
};
const stopLoading = (): void => {
  loadingStep.value = loadingSteps.length;
  animatePct(100);
  setTimeout(() => {
    showLoading.value = false;
  }, 600);
};

// ─── Helpers ────────────────────────────────────────────────────────────────
/** `items` เป็น JSON string -> string[] อย่างปลอดภัย */
const parseItems = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw !== 'string') return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

const normalizeSection = (raw: SectionApi): Section => ({
  id: raw.id,
  order: raw.order ?? 0,
  heading: raw.heading?.trim() || 'ไม่มีหัวข้อ',
  body: raw.body?.trim() ?? '',
  items: parseItems(raw.items),
});

const resolveError = (e: unknown): string => {
  const ax = e as AxiosError;
  if (ax.response?.status) return `เซิร์ฟเวอร์ตอบกลับสถานะ ${ax.response.status}`;
  if (ax.message) return ax.message;
  return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
};

// ─── Interaction ─────────────────────────────────────────────────────────────
const isOpen = (id: number): boolean => openIds.value.has(id);
const toggle = (id: number): void => {
  const next = new Set(openIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  openIds.value = next;
};
const allOpen = computed<boolean>(
  () => sections.value.length > 0 && openIds.value.size === sections.value.length,
);
const toggleAll = (): void => {
  openIds.value = allOpen.value ? new Set() : new Set(sections.value.map((s) => s.id));
};

const keyOf = (sid: number, i: number): string => `${sid}:${i}`;
const isChecked = (sid: number, i: number): boolean => checked.value.has(keyOf(sid, i));
const toggleCheck = (sid: number, i: number): void => {
  const next = new Set(checked.value);
  const k = keyOf(sid, i);
  if (next.has(k)) next.delete(k);
  else next.add(k);
  checked.value = next;
};
const sectionDone = (s: Section): number => s.items.filter((_, i) => isChecked(s.id, i)).length;

const totalItems = computed<number>(() =>
  sections.value.reduce((sum, s) => sum + s.items.length, 0),
);
const doneCount = computed<number>(() => checked.value.size);
const progressPct = computed<number>(() =>
  totalItems.value ? Math.round((doneCount.value / totalItems.value) * 100) : 0,
);

// ─── Data fetching ──────────────────────────────────────────────────────────
let abortController: AbortController | null = null;

const fetchSections = async (): Promise<void> => {
  if (!topicId.value) {
    error.value = 'ไม่พบรหัสหัวข้อ';
    loading.value = false;
    return;
  }

  abortController?.abort();
  abortController = new AbortController();

  startLoading();
  loading.value = true;
  error.value = null;

  try {
    loadingStep.value = 0;
    animatePct(loadingSteps[0].pct);

    const res = await api.get<ListResponse>(`/section/topic/${topicId.value}`, {
      signal: abortController.signal,
    });
    const list = Array.isArray(res.data?.data) ? res.data.data : [];

    loadingStep.value = 1;
    animatePct(loadingSteps[1].pct);

    // header จาก topic ที่แนบมากับ section แรก
    const meta = list[0]?.topic;
    if (meta) {
      topicInfo.value = {
        title: meta.title?.trim() || 'หญ้าแฝก',
        subtitle: meta.subtitle?.trim() ?? '',
        intro: meta.intro?.trim() ?? '',
        icon: meta.icon?.trim() || 'grass',
        accent: meta.accent?.trim() || '#3f7d3a',
      };
    }

    sections.value = list.map(normalizeSection).sort((a, b) => a.order - b.order);
    openIds.value = new Set(sections.value.map((s) => s.id)); // เปิดทุกอันไว้ก่อน
  } catch (e) {
    if (axios.isCancel(e)) return;
    error.value = resolveError(e);
    sections.value = [];
  } finally {
    loading.value = false;
    stopLoading();
  }
};

const goBack = (): void => {
  if (window.history.length > 1) router.back();
  else void router.push({ path: '/' });
};

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  void fetchSections();
});
onUnmounted(() => {
  abortController?.abort();
  if (pctTimer) clearInterval(pctTimer);
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');

$paper: #f3f5ec;
$ink: #21291f;
$ink-soft: #2c3328;
$forest: #2f5e34;
$forest-deep: #1b3a20;
$forest-btn: #3f7d3a;
$leaf: #c4d99a;
$leaf-bright: #a7d36a;
$line-soft: #e6e8da;
$muted: #7b8270;
$muted-2: #8b9183;
$eyebrow: #6f8a55;
$rust: #9c5a3c;

$font-display: 'Kanit', sans-serif;
$font-body: 'Sarabun', sans-serif;

.vetiver-page {
  font-family: $font-body;
  color: $ink;
  background: $paper;
  padding-bottom: 40px;
  --c: #{$forest-btn};
}

// ─── Hero ───
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(36px, 7vw, 72px) 24px clamp(40px, 7vw, 64px);
  background:
    radial-gradient(circle at 85% -10%, rgba(160, 200, 120, 0.25), transparent 50%),
    linear-gradient(165deg, $forest 0%, $forest-deep 100%);
  color: #fff;
}
.roots {
  position: absolute;
  inset: auto 0 -2px 0;
  width: 100%;
  height: 200px;
  color: $leaf;
}
.hero-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background 0.18s ease;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.hero-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.hero-icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.eyebrow {
  font-family: $font-display;
  font-weight: 500;
  letter-spacing: 2px;
  font-size: 0.74rem;
  text-transform: uppercase;
  color: $leaf;
  border: 1px solid rgba(196, 217, 154, 0.45);
  border-radius: 999px;
  padding: 4px 14px;
}
.hero-title {
  font-family: $font-display;
  font-weight: 700;
  font-size: clamp(2rem, 6.5vw, 3.4rem);
  line-height: 1.1;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}
.hero-sub {
  font-size: clamp(0.95rem, 2.2vw, 1.12rem);
  line-height: 1.7;
  max-width: 600px;
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
}

// ─── Content ───
.content {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(22px, 5vw, 40px) clamp(16px, 5vw, 32px) 8px;
}

// progress
.progress-card {
  background: #fff;
  border: 1px solid $line-soft;
  border-radius: 18px;
  padding: 16px 18px;
  margin-bottom: 18px;
  box-shadow: 0 1px 2px rgba(33, 41, 31, 0.05);
}
.progress-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.progress-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: $font-display;
  font-weight: 600;
  font-size: 0.92rem;
  color: $ink-soft;
}
.progress-count {
  font-family: $font-display;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--c);
}
.progress-track {
  height: 8px;
  border-radius: 4px;
  background: rgba(47, 94, 52, 0.1);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c) 75%, #1b3a20), var(--c));
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.progress-done {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 0.85rem;
  font-weight: 600;
  color: $forest-btn;
}

// tools
.content-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.content-count {
  font-family: $font-display;
  font-size: 0.85rem;
  color: $muted-2;
}
.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 8%, white);
  border: 1px solid color-mix(in srgb, var(--c) 22%, white);
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.18s ease;
}
.tool-btn:hover {
  background: color-mix(in srgb, var(--c) 14%, white);
}

// section card
.sec-card {
  background: #fff;
  border: 1px solid $line-soft;
  border-radius: 18px;
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(33, 41, 31, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  animation: rise 0.45s both;
  animation-delay: var(--delay);
}
.sec-card--open {
  border-color: color-mix(in srgb, var(--c) 35%, white);
  box-shadow: 0 12px 28px -18px color-mix(in srgb, var(--c) 60%, transparent);
}
.sec-head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.sec-order {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  font-family: $font-display;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(150deg, color-mix(in srgb, var(--c) 85%, white), var(--c));
}
.sec-heading {
  flex: 1;
  font-family: $font-display;
  font-weight: 600;
  font-size: clamp(0.98rem, 2.6vw, 1.12rem);
  color: $ink;
}
.sec-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: $font-display;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--c);
}
.sec-badge--muted {
  color: $muted-2;
  background: #f1f3ea;
  border-radius: 999px;
  padding: 2px 9px;
}
.sec-chevron {
  flex-shrink: 0;
  color: $muted-2;
  transition: transform 0.28s ease;
}
.sec-card--open .sec-chevron {
  transform: rotate(180deg);
  color: var(--c);
}

.sec-body {
  list-style: none;
  margin: 0;
  padding: 0 12px 10px;
}
.item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 11px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.16s ease;
}
.item:hover {
  background: color-mix(in srgb, var(--c) 6%, white);
}
.item-check {
  flex-shrink: 0;
  color: #c2c9b6;
  line-height: 1;
  margin-top: 1px;
  transition:
    color 0.18s ease,
    transform 0.18s ease;
}
.item--checked .item-check {
  color: var(--c);
  transform: scale(1.08);
}
.item-text {
  font-size: 0.96rem;
  line-height: 1.5;
  color: $ink-soft;
  transition: color 0.18s ease;
}
.item--checked .item-text {
  color: $muted-2;
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--c) 50%, transparent);
}

.content-foot {
  text-align: center;
  font-family: $font-display;
  color: $muted;
  font-size: 0.92rem;
  padding: 24px 16px 8px;
}

// ─── States ───
.state {
  max-width: 480px;
  margin: 0 auto;
  padding: clamp(48px, 10vw, 88px) 24px;
  text-align: center;
  color: #5a6450;
}
.state p {
  margin: 14px 0 0;
}
.state--error {
  color: $rust;
}
.state-title {
  font-family: $font-display;
  font-weight: 600;
  font-size: 1.2rem;
  color: $ink;
}
.state-detail {
  font-size: 0.92rem;
  color: $muted;
  word-break: break-word;
}
.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-family: $font-display;
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  background: $forest-btn;
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  cursor: pointer;
  box-shadow: 0 8px 18px -8px $forest-btn;
  transition:
    transform 0.18s ease,
    filter 0.18s ease;
}
.retry-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

// ─── Skeleton ───
.sec-card--skeleton {
  pointer-events: none;
  animation: none;
}
.sec-card--skeleton .sec-head {
  padding: 16px 18px;
}
.sec-card--skeleton .sec-body {
  padding: 0 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sk {
  display: block;
  border-radius: 8px;
  background: linear-gradient(90deg, #eef0e4 25%, #e3e7d4 50%, #eef0e4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}
.sk-dot {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
.sk-heading {
  width: 55%;
  height: 16px;
}
.sk-row {
  width: 80%;
  height: 13px;
}

// ─── Transitions ───
.expand-enter-active,
.expand-leave-active {
  transition: all 0.28s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ─── Loading dialog ───
.loading-dialog {
  background: #fff;
  border-radius: 24px;
  padding: 2rem 1.75rem 1.75rem;
  width: min(330px, 92vw);
  text-align: center;
  box-shadow: 0 24px 64px rgba(20, 40, 20, 0.22);
  font-family: $font-body;
}
.ld-orb-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ld-orb-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, $forest-deep, $forest, $leaf-bright);
  animation: ldOrbPulse 2s ease-in-out infinite;
}
.ld-orb-ring1 {
  position: absolute;
  inset: -7px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: $leaf-bright;
  border-right-color: #4f9d56;
  animation: ldSpin 1.1s linear infinite;
}
.ld-orb-ring2 {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-bottom-color: rgba(167, 211, 106, 0.3);
  animation: ldSpin 2.2s linear infinite reverse;
}
.ld-orb-inner {
  position: relative;
  z-index: 2;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}
.ld-title {
  font-family: $font-display;
  font-size: 1.05rem;
  font-weight: 700;
  color: $forest;
  margin-bottom: 0.1rem;
}
.ld-pct-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-bottom: 0.2rem;
}
.ld-pct-num {
  font-family: $font-display;
  font-size: 2.8rem;
  font-weight: 700;
  color: $forest-deep;
  line-height: 1;
  min-width: 3ch;
  text-align: right;
}
.ld-pct-sym {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4f9d56;
}
.ld-sub {
  font-size: 0.78rem;
  color: $muted;
  min-height: 1rem;
  margin-bottom: 1rem;
}
.ld-bar-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(47, 94, 52, 0.1);
  overflow: hidden;
  margin-bottom: 0.85rem;
}
.ld-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, $forest, $leaf-bright);
  transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
.ld-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
}
.ld-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $forest;
  display: inline-block;
  animation: ldDotB 1.2s ease-in-out infinite;
}
.ld-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.ld-dot:nth-child(3) {
  animation-delay: 0.4s;
}

// ─── Keyframes ───
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
@keyframes ldSpin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ldOrbPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(79, 157, 86, 0.3);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(79, 157, 86, 0);
  }
}
@keyframes ldDotB {
  0%,
  80%,
  100% {
    transform: scale(0.7);
    opacity: 0.35;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}

// ─── Dark mode ───
:global(.body--dark) .vetiver-page {
  background: #14180f;
  color: #e8ebdf;
}
:global(.body--dark) .progress-card,
:global(.body--dark) .sec-card {
  background: #1f2418;
  border-color: #2a301f;
}
:global(.body--dark) .sec-heading,
:global(.body--dark) .progress-label,
:global(.body--dark) .state-title {
  color: #e8ebdf;
}
:global(.body--dark) .item-text {
  color: #d6dac9;
}
:global(.body--dark) .sec-badge--muted {
  background: #2a301f;
}

// ─── a11y ───
@media (prefers-reduced-motion: reduce) {
  .sec-card,
  .sk,
  .ld-orb-bg,
  .ld-orb-ring1,
  .ld-orb-ring2,
  .ld-dot,
  .progress-fill {
    animation: none !important;
  }
  .expand-enter-active,
  .expand-leave-active {
    transition: none;
  }
}
</style>
