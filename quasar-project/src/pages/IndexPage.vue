<template>
  <q-page class="vetiver-page">
    <!-- ═══════════════ HERO ═══════════════ -->

    <!-- ═══════════════ LOADING (skeleton grid ใต้ dialog) ═══════════════ -->
    <section v-if="loading" class="home" aria-busy="true">
      <div class="home-head">
        <span class="home-eyebrow">เมนูหลัก</span>
        <h2 class="home-title">กำลังโหลดหัวข้อ…</h2>
      </div>
      <div class="app-grid">
        <div v-for="n in 6" :key="n" class="app-tile app-tile--skeleton">
          <span class="sk sk-icon" />
          <span class="sk sk-label" />
          <span class="sk sk-meta" />
        </div>
      </div>
    </section>

    <!-- ═══════════════ ERROR ═══════════════ -->
    <div v-else-if="error" class="state state--error">
      <q-icon name="cloud_off" size="42px" />
      <p class="state-title">โหลดข้อมูลไม่สำเร็จ</p>
      <p class="state-detail">{{ error }}</p>
      <button type="button" class="retry-btn" @click="fetchTopics">
        <q-icon name="refresh" size="18px" />
        <span>ลองอีกครั้ง</span>
      </button>
    </div>

    <!-- ═══════════════ EMPTY ═══════════════ -->
    <div v-else-if="!topics.length" class="state state--empty">
      <q-icon name="grass" size="42px" />
      <p class="state-title">ยังไม่มีหัวข้อ</p>
      <p class="state-detail">API ตอบกลับสำเร็จ แต่ยังไม่มีข้อมูลหัวข้อให้แสดง</p>
      <button type="button" class="retry-btn" @click="fetchTopics">
        <q-icon name="refresh" size="18px" />
        <span>โหลดใหม่</span>
      </button>
    </div>

    <!-- ═══════════════ LAUNCHER (เมนูหลัก) ═══════════════ -->
    <section v-else class="home">
      <div class="home-head">
        <span class="home-eyebrow">เมนูหลัก</span>
        <h2 class="home-title">เลือกหัวข้อที่ต้องการเรียนรู้</h2>
      </div>

      <div class="app-grid">
        <button
          v-for="(t, idx) in topics"
          :key="t.slug"
          type="button"
          class="app-tile"
          :style="{ '--c': t.accent, '--delay': idx * 55 + 'ms' }"
          @click="openTopic(t)"
        >
          <span class="app-icon"><q-icon :name="t.icon" size="32px" /></span>
          <span class="app-label">{{ t.title }}</span>
          <span class="app-meta">
            <template v-if="t.sectionCount > 0">
              <q-icon name="layers" size="14px" />
              {{ t.sectionCount }} หัวข้อย่อย
            </template>
            <template v-else>เร็วๆ นี้</template>
          </span>
        </button>
      </div>

      <p class="home-hint">ทั้งหมด {{ topics.length }} หัวข้อ</p>
    </section>

    <footer class="page-foot">ปลูกวันนี้ เพื่อดินและน้ำของวันพรุ่งนี้ 🌱</footer>

    <!-- ═══════════════ LOADING DIALOG (modal — ธีมหญ้าแฝก) ═══════════════ -->
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

        <div class="ld-steps">
          <div
            v-for="(s, i) in loadingSteps"
            :key="i"
            class="ld-step-row"
            :class="{
              'ld-step-row--done': i < loadingStep,
              'ld-step-row--active': i === loadingStep,
              'ld-step-row--pending': i > loadingStep,
            }"
          >
            <div
              class="ld-step-ic"
              :class="{
                'ld-step-ic--done': i < loadingStep,
                'ld-step-ic--active': i === loadingStep,
                'ld-step-ic--pending': i > loadingStep,
              }"
            >
              <span v-if="i < loadingStep">✓</span>
              <span v-else-if="i === loadingStep" class="ld-step-spinner" />
              <span v-else>·</span>
            </div>
            <div class="ld-step-label">{{ s.label }}</div>
            <div
              class="ld-step-pct"
              :class="{
                'ld-step-pct--done': i < loadingStep,
                'ld-step-pct--active': i === loadingStep,
              }"
            >
              {{ i < loadingStep ? '✓' : i === loadingStep ? s.pct + '%' : '' }}
            </div>
          </div>
        </div>

        <div class="ld-bar-track">
          <div class="ld-bar-fill" :style="{ width: loadingPercent + '%' }" />
        </div>
        <div class="ld-dots">
          <span class="ld-dot" />
          <span class="ld-dot" />
          <span class="ld-dot" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios, { type AxiosError } from 'axios';
import { api } from 'src/boot/axios';

// ─── Types ──────────────────────────────────────────────────────────────────
/** รูปแบบดิบที่ได้จาก API `/topic/all` (field อาจหายได้) */
interface TopicApi {
  id?: number | string;
  slug: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
  intro?: string;
  _count?: { sections?: number };
}
interface TopicResponse {
  topic?: TopicApi[];
  message?: string;
}
/** view-model ที่ component ใช้จริง — normalize แล้ว ทุก field มีค่าแน่นอน */
interface Topic {
  id: string; // ใช้เป็น param ของ route /section/:id (id ถ้ามี ไม่งั้น slug)
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  icon: string;
  accent: string;
  sectionCount: number;
}

// ─── Design defaults (เผื่อ API ไม่ส่ง accent / icon มา) ──────────────────────
const ACCENT_PALETTE = ['#6fa44e', '#3f7d3a', '#a9772f', '#4f9d56', '#3f8fb0', '#7a8c3a'] as const;
const ICON_PALETTE = ['eco', 'grass', 'landscape', 'water_drop', 'recycling', 'park'] as const;

/** หยิบค่าจาก palette แบบวนรอบ index */
const pick = <T,>(arr: readonly T[], i: number): T => arr[i % arr.length]!;

const router = useRouter();

// ─── State ──────────────────────────────────────────────────────────────────
const topics = ref<Topic[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// ─── Loading dialog (เหมือนหน้า list-sender) ─────────────────────────────────
const showLoading = ref<boolean>(false);
const loadingStep = ref<number>(0);
const loadingPercent = ref<number>(0);
const loadingSteps = [
  { label: 'โหลดข้อมูลหัวข้อหญ้าแฝก', pct: 80 },
  { label: 'จัดเรียงและแสดงผล', pct: 100 },
] as const;

let pctTimer: ReturnType<typeof setInterval> | null = null;

/** ค่อยๆ ไล่เปอร์เซ็นต์ไปยังเป้าหมายภายใน ~0.8s */
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
  }, 700);
};

// ─── Helpers ────────────────────────────────────────────────────────────────
/** แปลงข้อมูลดิบ 1 รายการ → view-model ที่ปลอดภัย */
const normalizeTopic = (raw: TopicApi, i: number): Topic => ({
  id: String(raw.id ?? raw.slug),
  slug: raw.slug,
  title: raw.title?.trim() || 'ไม่มีชื่อหัวข้อ',
  subtitle: raw.subtitle?.trim() ?? '',
  intro: raw.intro?.trim() ?? '',
  icon: raw.icon?.trim() || pick(ICON_PALETTE, i),
  accent: raw.accent?.trim() || pick(ACCENT_PALETTE, i),
  sectionCount: raw._count?.sections ?? 0,
});

/** อ่านข้อความ error ให้สื่อความหมายกับผู้ใช้ */
const resolveError = (e: unknown): string => {
  const ax = e as AxiosError;
  if (ax.response?.status) return `เซิร์ฟเวอร์ตอบกลับสถานะ ${ax.response.status}`;
  if (ax.message) return ax.message;
  return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
};

// ─── Data fetching ──────────────────────────────────────────────────────────
let abortController: AbortController | null = null;

const fetchTopics = async (): Promise<void> => {
  // ยกเลิก request ก่อนหน้า (กันโหลดซ้อนตอนกด "ลองอีกครั้ง" รัวๆ)
  abortController?.abort();
  abortController = new AbortController();

  startLoading();
  loading.value = true;
  error.value = null;

  try {
    loadingStep.value = 0;
    animatePct(loadingSteps[0].pct);

    const res = await api.get<TopicResponse>('/topic/all', { signal: abortController.signal });
    const data = Array.isArray(res.data?.topic) ? res.data.topic : [];

    loadingStep.value = 1;
    animatePct(loadingSteps[1].pct);

    topics.value = data.map(normalizeTopic);
  } catch (e) {
    if (axios.isCancel(e)) return; // ยกเลิกเอง ไม่นับเป็น error
    error.value = resolveError(e);
    topics.value = [];
  } finally {
    loading.value = false;
    stopLoading();
  }
};

/** กดหัวข้อ → ไปหน้า /section/:id */
const openTopic = (t: Topic): void => {
  void router.push(`/section/${t.id}`);
};

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  void fetchTopics();
});
onUnmounted(() => {
  abortController?.abort();
  if (pctTimer) clearInterval(pctTimer);
});
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');

// ─── Design Tokens (grounded in vetiver: leaf · soil · water) ────────────────
$paper: #f3f5ec;
$ink: #21291f;
$ink-soft: #2c3328;
$forest: #2f5e34;
$forest-deep: #1b3a20;
$forest-btn: #3f7d3a;
$leaf: #c4d99a;
$leaf-bright: #a7d36a;
$line: #e0e2d4;
$line-soft: #e6e8da;
$muted: #7b8270;
$muted-2: #8b9183;
$eyebrow: #6f8a55;
$rust: #9c5a3c;

$font-display: 'Kanit', sans-serif;
$font-body: 'Sarabun', sans-serif;
$r-tile: 22px;
$r-icon: 20px;

// ─── Page ────────────────────────────────────────────────────────────────────
.vetiver-page {
  font-family: $font-body;
  color: $ink;
  background: $paper;
  padding-bottom: 40px;
}

// ─── Hero ────────────────────────────────────────────────────────────────────
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(48px, 9vw, 96px) 24px clamp(40px, 7vw, 72px);
  background:
    radial-gradient(circle at 85% -10%, rgba(160, 200, 120, 0.25), transparent 50%),
    linear-gradient(165deg, $forest 0%, $forest-deep 100%);
  color: #fff;
}
.roots {
  position: absolute;
  inset: auto 0 -2px 0;
  width: 100%;
  height: 220px;
  color: $leaf;
}
.hero-inner {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
}
.eyebrow {
  display: inline-block;
  font-family: $font-display;
  font-weight: 500;
  letter-spacing: 3px;
  font-size: 0.78rem;
  text-transform: uppercase;
  color: $leaf;
  border: 1px solid rgba(196, 217, 154, 0.45);
  border-radius: 999px;
  padding: 5px 16px;
  margin-bottom: 18px;
}
.hero-title {
  font-family: $font-display;
  font-weight: 700;
  font-size: clamp(2.6rem, 9vw, 5rem);
  line-height: 1.05;
  margin: 0 0 14px;
  letter-spacing: -0.5px;
}
.hero-sub {
  font-size: clamp(1rem, 2.4vw, 1.25rem);
  line-height: 1.7;
  max-width: 600px;
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
}

// ─── State blocks (error / empty) ────────────────────────────────────────────
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

// ─── Home launcher ───────────────────────────────────────────────────────────
.home {
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(28px, 6vw, 56px) clamp(16px, 5vw, 40px) 8px;
  text-align: center;
}
.home-head {
  margin-bottom: clamp(22px, 5vw, 38px);
}
.home-eyebrow {
  font-family: $font-display;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $eyebrow;
  font-weight: 500;
}
.home-title {
  font-family: $font-display;
  font-weight: 600;
  font-size: clamp(1.4rem, 4.2vw, 2rem);
  margin: 6px 0 0;
  color: $ink;
}
.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(14px, 3vw, 22px);
}
.app-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: clamp(18px, 3.5vw, 26px) 12px 20px;
  background: #fff;
  border: 1px solid $line-soft;
  border-radius: $r-tile;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 1px 2px rgba(33, 41, 31, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  animation: rise 0.45s both;
  animation-delay: var(--delay);
}
.app-tile:hover {
  transform: translateY(-4px);
  border-color: var(--c);
  box-shadow: 0 18px 34px -18px color-mix(in srgb, var(--c) 70%, transparent);
}
.app-tile:focus-visible {
  outline: 2px solid var(--c);
  outline-offset: 2px;
}
.app-tile:active {
  transform: translateY(-1px) scale(0.99);
}
.app-icon {
  display: grid;
  place-items: center;
  width: clamp(56px, 13vw, 74px);
  height: clamp(56px, 13vw, 74px);
  border-radius: $r-icon;
  color: #fff;
  background: linear-gradient(150deg, color-mix(in srgb, var(--c) 88%, white), var(--c));
  box-shadow: 0 10px 20px -10px var(--c);
}
.app-label {
  font-family: $font-display;
  font-weight: 600;
  font-size: clamp(0.86rem, 2.4vw, 1.02rem);
  line-height: 1.25;
  color: $ink-soft;
}
.app-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 0.74rem;
  color: $muted-2;
}
.home-hint {
  margin: clamp(20px, 4vw, 30px) 0 0;
  font-size: 0.9rem;
  color: $muted-2;
}

// ─── Skeleton (ระหว่างโหลด) ──────────────────────────────────────────────────
.app-tile--skeleton {
  cursor: default;
  pointer-events: none;
  animation: none;
}
.sk {
  border-radius: 8px;
  background: linear-gradient(90deg, #eef0e4 25%, #e3e7d4 50%, #eef0e4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}
.sk-icon {
  width: clamp(56px, 13vw, 74px);
  height: clamp(56px, 13vw, 74px);
  border-radius: $r-icon;
}
.sk-label {
  width: 70%;
  height: 14px;
}
.sk-meta {
  width: 45%;
  height: 10px;
}

// ─── Footer ──────────────────────────────────────────────────────────────────
.page-foot {
  text-align: center;
  font-family: $font-display;
  color: $muted;
  font-size: 0.95rem;
  padding: 28px 16px 8px;
}

// ═══════════════ LOADING DIALOG (ธีมหญ้าแฝก) ═══════════════
.loading-dialog {
  background: #fff;
  border-radius: 24px;
  padding: 2rem 1.75rem 1.75rem;
  width: min(340px, 92vw);
  text-align: center;
  box-shadow: 0 24px 64px rgba(20, 40, 20, 0.22);
  font-family: $font-body;
  outline: none;
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
.ld-steps {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(47, 94, 52, 0.1);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1rem;
  text-align: left;
}
.ld-step-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 13px;
  border-bottom: 1px solid rgba(47, 94, 52, 0.08);
  transition: background 0.35s;
}
.ld-step-row:last-child {
  border-bottom: none;
}
.ld-step-row--done {
  background: rgba(79, 157, 86, 0.06);
}
.ld-step-row--active {
  background: rgba(111, 164, 78, 0.09);
}
.ld-step-ic {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}
.ld-step-ic--done {
  background: #dcf0c8;
  color: $forest-btn;
}
.ld-step-ic--active {
  background: #e7f1d9;
  animation: ldIcPulse 1s ease-in-out infinite;
}
.ld-step-ic--pending {
  background: #f1f3ea;
  color: #c2c9b6;
}
.ld-step-spinner {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 2px solid $forest-btn;
  border-top-color: transparent;
  animation: ldSpin 0.7s linear infinite;
}
.ld-step-label {
  flex: 1;
  font-size: 0.8rem;
  line-height: 1.35;
}
.ld-step-row--done .ld-step-label {
  color: #4a5443;
}
.ld-step-row--active .ld-step-label {
  color: $forest-deep;
  font-weight: 700;
}
.ld-step-row--pending .ld-step-label {
  color: #9aa48d;
}
.ld-step-pct {
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 28px;
  text-align: right;
}
.ld-step-pct--done {
  color: $forest-btn;
}
.ld-step-pct--active {
  color: #4f9d56;
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

// ─── Keyframes ───────────────────────────────────────────────────────────────
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
@keyframes ldIcPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(111, 164, 78, 0.3);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(111, 164, 78, 0);
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

// ─── Dark mode (Quasar เพิ่ม .body--dark ที่ <body>) ─────────────────────────
:global(.body--dark) .vetiver-page {
  background: #14180f;
  color: #e8ebdf;
}
:global(.body--dark) .home-title,
:global(.body--dark) .state-title {
  color: #e8ebdf;
}
:global(.body--dark) .app-tile {
  background: #1f2418;
  border-color: #2a301f;
}
:global(.body--dark) .app-label {
  color: #e0e4d6;
}
:global(.body--dark) .sk {
  background: linear-gradient(90deg, #21271a 25%, #2a301f 50%, #21271a 75%);
  background-size: 200% 100%;
}

// ─── Responsive / a11y ───────────────────────────────────────────────────────
@media (max-width: 560px) {
  .app-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-tile,
  .sk,
  .ld-orb-bg,
  .ld-orb-ring1,
  .ld-orb-ring2,
  .ld-step-ic--active,
  .ld-dot {
    animation: none !important;
  }
}
</style>
