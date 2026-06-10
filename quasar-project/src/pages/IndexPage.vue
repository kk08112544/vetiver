<template>
  <q-page class="vetiver-page">
    <!-- ───────── HERO ───────── -->
    <header class="hero">
      <!-- signature element: vetiver roots reaching down like a living wall -->
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
        <div class="eyebrow">อนุรักษ์ดินและน้ำ</div>
        <h1 class="hero-title">หญ้าแฝก</h1>
        <p class="hero-sub">
          กำแพงธรรมชาติที่หยั่งรากลึก ยึดหน้าดิน ชะลอน้ำ
          และฟื้นความชุ่มชื้นให้ผืนแผ่นดิน
        </p>

        <div class="hero-progress">
          <div class="hero-progress-top">
            <span>ทำเครื่องหมายแล้ว</span>
            <strong>{{ doneCount }} / {{ totalCount }} รายการ</strong>
          </div>
          <div class="bar">
            <div class="bar-fill" :style="{ width: overallPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- ───────── TOPIC NAV ───────── -->
    <nav class="topic-nav">
      <button
        v-for="t in topics"
        :key="t.slug"
        type="button"
        class="topic-pill"
        :class="{ active: activeSlug === t.slug }"
        :style="{ '--c': t.accent }"
        @click="activeSlug = t.slug"
      >
        <q-icon :name="t.icon" size="20px" />
        <span>{{ t.title }}</span>
      </button>
    </nav>

    <!-- ───────── CONTENT ───────── -->
    <q-tab-panels
      v-model="activeSlug"
      animated
      swipeable
      transition-prev="slide-right"
      transition-next="slide-left"
      class="panels"
    >
      <q-tab-panel
        v-for="t in topics"
        :key="t.slug"
        :name="t.slug"
        class="panel"
        :style="{ '--accent': t.accent }"
      >
        <!-- topic intro -->
        <section class="topic-intro">
          <div class="topic-intro-icon">
            <q-icon :name="t.icon" size="30px" />
          </div>
          <div class="topic-intro-text">
            <div class="topic-eyebrow">{{ t.subtitle }}</div>
            <h2 class="topic-title">{{ t.title }}</h2>
            <p class="topic-desc">{{ t.intro }}</p>
          </div>
          <div v-if="topicTotal(t) > 0" class="topic-stat">
            <div class="topic-stat-num">{{ topicPercent(t) }}%</div>
            <div class="topic-stat-label">อ่านแล้ว</div>
          </div>
        </section>

        <!-- sections -->
        <div :key="t.slug" class="section-grid">
          <article
            v-for="(s, idx) in t.sections"
            :key="s.id"
            class="section-card"
            :style="{ '--delay': idx * 60 + 'ms' }"
          >
            <h3 class="section-heading">{{ s.heading }}</h3>

            <p v-if="s.body" class="section-body">{{ s.body }}</p>

            <ul v-if="s.items.length" class="check-list">
              <li
                v-for="(item, i) in s.items"
                :key="i"
                class="check-item"
                :class="{ done: isChecked(s.id, i) }"
                role="checkbox"
                :aria-checked="isChecked(s.id, i)"
                tabindex="0"
                @click="toggle(s.id, i)"
                @keydown.enter.prevent="toggle(s.id, i)"
                @keydown.space.prevent="toggle(s.id, i)"
              >
                <span class="check-box"><q-icon name="check" size="16px" /></span>
                <span class="check-text">{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <footer class="page-foot">
      ปลูกวันนี้ เพื่อดินและน้ำของวันพรุ่งนี้ 🌱
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface Section {
  id: number;
  heading: string;
  body: string | null;
  items: string[];
}
interface Topic {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  intro: string;
  sections: Section[];
}

const topics: Topic[] = [
  {
    slug: 'what-is-vetiver',
    title: 'หญ้าแฝกคืออะไร',
    subtitle: 'รู้จักหญ้าแฝก',
    icon: 'help',
    accent: '#6fa44e',
    intro:
      'หญ้าแฝกเป็นพืชตระกูลหญ้าที่มีระบบรากลึกหยั่งลงดินเหมือนกำแพงธรรมชาติ นิยมปลูกเพื่ออนุรักษ์ดินและน้ำ',
    sections: [
      {
        id: 1,
        heading: 'ลักษณะเด่น',
        body: null,
        items: [
          'ใบเรียวยาว ขอบใบคม',
          'ขึ้นเป็นกอแน่น แตกหน่อชิดกัน',
          'รากเป็นระบบรากลึก หยั่งลงดินตรง',
          'เจริญเติบโตเร็ว ทนแล้งและน้ำท่วม',
        ],
      },
      {
        id: 2,
        heading: 'ชนิดของหญ้าแฝก',
        body: null,
        items: [
          'หญ้าแฝกลุ่ม — ขึ้นในที่ชุ่มน้ำ ใบกว้างสีเขียวเข้ม',
          'หญ้าแฝกดอน — ขึ้นในที่ดอน ใบแคบ ทนแล้งได้ดี',
        ],
      },
      {
        id: 3,
        heading: 'จุดเด่นในการอนุรักษ์',
        body: 'ระบบรากที่สานกันแน่นช่วยยึดเกาะหน้าดิน ชะลอการไหลของน้ำ ลดการชะล้างพังทลายของดิน และเก็บความชื้นไว้ในพื้นที่',
        items: [],
      },
    ],
  },
  {
    slug: 'benefits',
    title: 'ประโยชน์ของหญ้าแฝก',
    subtitle: 'ทำอะไรได้บ้าง',
    icon: 'eco',
    accent: '#3f7d3a',
    intro: 'หญ้าแฝกให้ประโยชน์หลายด้าน ตั้งแต่อนุรักษ์ดินน้ำไปจนถึงงานหัตถกรรม',
    sections: [
      {
        id: 4,
        heading: 'ด้านดินและน้ำ',
        body: null,
        items: [
          'ป้องกันการพังทลายของหน้าดิน',
          'กักเก็บน้ำและชะลอการไหล',
          'ช่วยปรับปรุงโครงสร้างดิน',
          'ดูดซับและกรองสารพิษในดิน',
        ],
      },
      {
        id: 5,
        heading: 'ด้านการเกษตร',
        body: null,
        items: ['ใช้เป็นพืชคลุมดิน', 'ทำปุ๋ยหมักและปุ๋ยพืชสด', 'ใช้เป็นอาหารสัตว์'],
      },
      {
        id: 6,
        heading: 'ด้านหัตถกรรม',
        body: null,
        items: ['ทำเชือก ตะกร้า และของใช้', 'ทำหมวกและงานจักสาน'],
      },
      {
        id: 7,
        heading: 'ด้านอื่น ๆ',
        body: null,
        items: ['สกัดน้ำมันหอมระเหย ทำเครื่องหอม', 'ช่วยฟื้นฟูและรักษาความชุ่มชื้นของดิน'],
      },
    ],
  },
  {
    slug: 'soil-prep',
    title: 'การเตรียมดิน',
    subtitle: 'ก่อนลงปลูก',
    icon: 'landscape',
    accent: '#a9772f',
    intro: 'เตรียมพื้นที่ให้พร้อมก่อนปลูก เพื่อให้หญ้าแฝกตั้งตัวและแตกกอได้ดี',
    sections: [
      {
        id: 8,
        heading: 'ขั้นตอนการเตรียมดิน',
        body: null,
        items: [
          'เก็บวัชพืชและเศษวัสดุออกจากแปลง',
          'พรวนดินให้ร่วนซุย',
          'ปรับสภาพและปรับปรุงดินตามความเหมาะสม',
          'เตรียมร่อง/แนวปลูกตามแนวระดับ',
          'รดน้ำให้ดินชุ่มก่อนปลูก',
        ],
      },
    ],
  },
  {
    slug: 'planting',
    title: 'การปลูกหญ้าแฝก',
    subtitle: 'วิธีปลูก',
    icon: 'grass',
    accent: '#4f9d56',
    intro: 'เลือกวิธีปลูกให้เหมาะกับสภาพพื้นที่ ทั้งที่ลาดชันและรอบแหล่งน้ำ',
    sections: [
      {
        id: 9,
        heading: '1. การเตรียมกล้าพันธุ์',
        body: null,
        items: [
          'ตัดใบให้เหลือยาว 10–20 ซม.',
          'ตัดรากให้สั้นพอเหมาะ',
          'ชำกล้าให้ตั้งตัวก่อนนำลงปลูก',
        ],
      },
      {
        id: 10,
        heading: '2. การปลูกในที่ลาดชัน',
        body: 'ปลูกเป็นแถวเดียวขวางความลาดเท ตามแนวระดับ เพื่อชะลอน้ำและดักตะกอน',
        items: [],
      },
      {
        id: 11,
        heading: '3. การปลูกรอบแหล่งน้ำ',
        body: null,
        items: [
          'ปลูก 1–2 แถวรอบขอบแหล่งน้ำ',
          'เว้นระยะห่างประมาณ 30–40 ซม.',
          'ช่วยป้องกันการพังทลายของตลิ่ง',
        ],
      },
    ],
  },
  {
    slug: 'care',
    title: 'การดูแลรักษา',
    subtitle: 'ดูแลหลังปลูก',
    icon: 'water_drop',
    accent: '#3f8fb0',
    intro: 'หมั่นดูแลในช่วงตั้งตัว เพื่อให้หญ้าแฝกแตกกอแน่นและทำหน้าที่ได้เต็มที่',
    sections: [
      {
        id: 12,
        heading: 'การให้ปุ๋ย',
        body: 'ใส่ปุ๋ยบำรุงทุก 3–4 เดือนในช่วงแรก เพื่อเร่งการแตกกอ',
        items: [],
      },
      {
        id: 13,
        heading: 'การรดน้ำ',
        body: 'รดน้ำสม่ำเสมอในช่วงแรกหลังปลูก โดยเฉพาะหน้าแล้ง จนกว่าจะตั้งตัวได้',
        items: [],
      },
      {
        id: 14,
        heading: 'งานดูแลทั่วไป',
        body: null,
        items: [
          'ตัดใบเมื่อสูงเกินไปเพื่อกระตุ้นการแตกกอ',
          'กำจัดวัชพืชรอบกอ',
          'ตรวจซ่อมแถวที่ตายหรือหลุด',
        ],
      },
    ],
  },
  {
    slug: 'usage',
    title: 'การใช้หญ้าแฝก',
    subtitle: 'นำไปใช้จริง',
    icon: 'recycling',
    accent: '#7a8c3a',
    intro: 'นำหญ้าแฝกไปใช้ประโยชน์ต่อยอด ทั้งบำรุงดินและขยายพันธุ์',
    sections: [
      {
        id: 15,
        heading: 'การจัดการปุ๋ย',
        body: 'ใช้ใบและเศษหญ้าแฝกคลุมโคนต้นและทำปุ๋ยหมักบำรุงดิน',
        items: [],
      },
      {
        id: 16,
        heading: 'รักษาความชื้น',
        body: 'ใบที่คลุมดินช่วยลดการระเหยของน้ำ รักษาความชุ่มชื้นให้พื้นที่',
        items: [],
      },
      {
        id: 17,
        heading: 'ปรับปรุงดิน',
        body: 'รากและซากใบที่ย่อยสลายช่วยเพิ่มอินทรียวัตถุ ทำให้ดินร่วนซุยขึ้น',
        items: [],
      },
      {
        id: 18,
        heading: 'ขยายพันธุ์',
        body: 'แยกหน่อจากกอเดิมไปปลูกเพิ่ม เพื่อขยายแนวหญ้าแฝกในพื้นที่อื่น',
        items: [],
      },
    ],
  },
];

const activeSlug = ref<string>('what-is-vetiver');

/* interactive checklist state */
const checked = reactive<Record<string, boolean>>({});
const keyOf = (sectionId: number, i: number) => `${sectionId}-${i}`;
const isChecked = (sectionId: number, i: number) => !!checked[keyOf(sectionId, i)];
function toggle(sectionId: number, i: number) {
  const k = keyOf(sectionId, i);
  checked[k] = !checked[k];
}

/* progress helpers */
function topicTotal(t: Topic) {
  return t.sections.reduce((sum, s) => sum + s.items.length, 0);
}
function topicDone(t: Topic) {
  let done = 0;
  t.sections.forEach((s) => s.items.forEach((_, i) => isChecked(s.id, i) && done++));
  return done;
}
function topicPercent(t: Topic) {
  const total = topicTotal(t);
  return total ? Math.round((topicDone(t) / total) * 100) : 0;
}

const totalCount = computed(() => topics.reduce((s, t) => s + topicTotal(t), 0));
const doneCount = computed(() => topics.reduce((s, t) => s + topicDone(t), 0));
const overallPercent = computed(() =>
  totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0,
);
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');

/* ── palette (grounded in vetiver: leaf, soil, water) ──
   paper  #F3F5EC   leaf-tinted off-white
   ink    #21291F   deep near-black green
   forest #2F5E34   botanical green (hero)
   line   #E0E2D4
*/

.vetiver-page {
  font-family: 'Sarabun', sans-serif;
  color: #21291f;
  background: #f3f5ec;
  padding-bottom: 40px;
}

/* ───────── HERO ───────── */
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(48px, 9vw, 96px) 24px clamp(40px, 7vw, 72px);
  background:
    radial-gradient(circle at 85% -10%, rgba(160, 200, 120, 0.25), transparent 50%),
    linear-gradient(165deg, #2f5e34 0%, #1b3a20 100%);
  color: #fff;
}

.roots {
  position: absolute;
  inset: auto 0 -2px 0;
  width: 100%;
  height: 220px;
  color: #c4d99a;
}

.hero-inner {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  font-family: 'Kanit', sans-serif;
  font-weight: 500;
  letter-spacing: 3px;
  font-size: 0.78rem;
  text-transform: uppercase;
  color: #c4d99a;
  border: 1px solid rgba(196, 217, 154, 0.45);
  border-radius: 999px;
  padding: 5px 16px;
  margin-bottom: 18px;
}

.hero-title {
  font-family: 'Kanit', sans-serif;
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
  margin: 0 0 32px;
  color: rgba(255, 255, 255, 0.88);
}

.hero-progress {
  max-width: 460px;
}
.hero-progress-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.85);
}
.hero-progress-top strong {
  font-family: 'Kanit', sans-serif;
}
.bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #a7d36a, #d9e8a8);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ───────── TOPIC NAV ───────── */
.topic-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 10px;
  padding: 14px clamp(16px, 5vw, 48px);
  overflow-x: auto;
  scrollbar-width: none;
  background: rgba(243, 245, 236, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e2d4;
}
.topic-nav::-webkit-scrollbar {
  display: none;
}

.topic-pill {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.92rem;
  font-weight: 500;
  color: #4a5443;
  background: #fff;
  border: 1.5px solid #e0e2d4;
  border-radius: 999px;
  padding: 9px 18px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.topic-pill:hover {
  border-color: var(--c);
  color: var(--c);
  transform: translateY(-1px);
}
.topic-pill.active {
  color: #fff;
  background: var(--c);
  border-color: var(--c);
  box-shadow: 0 6px 16px -6px var(--c);
}

/* ───────── PANELS ───────── */
.panels {
  background: transparent;
  max-width: 1080px;
  margin: 0 auto;
}
.panel {
  padding: clamp(24px, 5vw, 48px) clamp(16px, 5vw, 48px);
}

/* topic intro */
.topic-intro {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 28px;
}
.topic-intro-icon {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  color: #fff;
  background: var(--accent);
  box-shadow: 0 8px 18px -8px var(--accent);
}
.topic-intro-text {
  flex: 1 1 auto;
}
.topic-eyebrow {
  font-family: 'Kanit', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
}
.topic-title {
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  font-size: clamp(1.6rem, 4vw, 2.1rem);
  margin: 2px 0 8px;
}
.topic-desc {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.65;
  color: #4a5443;
  max-width: 680px;
}
.topic-stat {
  flex: 0 0 auto;
  text-align: center;
  padding: 10px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e0e2d4;
}
.topic-stat-num {
  font-family: 'Kanit', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--accent);
  line-height: 1;
}
.topic-stat-label {
  font-size: 0.72rem;
  color: #7b8270;
  margin-top: 2px;
}

/* section cards */
.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.section-card {
  background: #fff;
  border: 1px solid #e6e8da;
  border-radius: 18px;
  padding: 22px 22px 8px;
  border-top: 4px solid var(--accent);
  box-shadow: 0 1px 2px rgba(33, 41, 31, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: rise 0.45s both;
  animation-delay: var(--delay);
}
.section-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px -16px rgba(33, 41, 31, 0.28);
}
.section-card > :last-child {
  margin-bottom: 14px;
}
.section-heading {
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  font-size: 1.18rem;
  margin: 0 0 12px;
}
.section-body {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: #4a5443;
}

/* interactive checklist */
.check-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 9px 8px;
  margin: 2px -8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ease;
}
.check-item:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}
.check-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.check-box {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  border-radius: 7px;
  border: 2px solid #cfd3c0;
  color: transparent;
  transition: all 0.18s ease;
}
.check-text {
  font-size: 0.98rem;
  line-height: 1.55;
  color: #2c3328;
  transition: color 0.18s ease;
}
.check-item.done .check-box {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.check-item.done .check-text {
  color: #8b9183;
}

/* footer */
.page-foot {
  text-align: center;
  font-family: 'Kanit', sans-serif;
  color: #7b8270;
  font-size: 0.95rem;
  padding: 28px 16px 8px;
}

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

/* dark mode (Quasar adds .body--dark on <body>) */
:global(.body--dark) .vetiver-page {
  background: #14180f;
  color: #e8ebdf;
}
:global(.body--dark) .topic-nav {
  background: rgba(20, 24, 15, 0.9);
  border-bottom-color: #2a301f;
}
:global(.body--dark) .topic-pill {
  background: #1f2418;
  border-color: #2a301f;
  color: #c5cbb8;
}
:global(.body--dark) .section-card,
:global(.body--dark) .topic-stat {
  background: #1f2418;
  border-color: #2a301f;
}
:global(.body--dark) .section-body,
:global(.body--dark) .topic-desc {
  color: #aeb6a0;
}
:global(.body--dark) .check-text {
  color: #e0e4d6;
}

/* responsive tweaks */
@media (max-width: 600px) {
  .topic-intro {
    flex-wrap: wrap;
  }
  .topic-stat {
    order: -1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .section-card,
  .bar-fill,
  .topic-pill,
  .check-item,
  .check-box {
    animation: none !important;
    transition: none !important;
  }
}
</style>