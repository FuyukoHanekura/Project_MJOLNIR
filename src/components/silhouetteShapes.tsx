import type { ReactNode } from 'react'

// Shapes (viewBox 200 × 362).
export const BASE = (
  <g className="sil-base">
    <circle cx="100" cy="26" r="17" />
    <rect x="92" y="40" width="16" height="20" rx="6" />
    <path d="M64 62 Q100 52 136 62 L138 118 L134 176 L66 176 L62 118 Z" />
    <circle cx="56" cy="74" r="16" />
    <circle cx="144" cy="74" r="16" />
    <ellipse cx="52" cy="100" rx="11" ry="27" transform="rotate(8 52 100)" />
    <ellipse cx="148" cy="100" rx="11" ry="27" transform="rotate(-8 148 100)" />
    <ellipse cx="41" cy="150" rx="10" ry="28" transform="rotate(8 41 150)" />
    <ellipse cx="159" cy="150" rx="10" ry="28" transform="rotate(-8 159 150)" />
    <circle cx="34" cy="184" r="7" />
    <circle cx="166" cy="184" r="7" />
    <path d="M66 172 L99 172 L97 346 L76 346 Q63 262 66 172 Z" />
    <path d="M134 172 L101 172 L103 346 L124 346 Q137 262 134 172 Z" />
    <ellipse cx="84" cy="352" rx="13" ry="6" />
    <ellipse cx="116" cy="352" rx="13" ry="6" />
  </g>
)

const ARMS = (
  <>
    <ellipse cx="52" cy="102" rx="9" ry="21" transform="rotate(8 52 102)" />
    <ellipse cx="148" cy="102" rx="9" ry="21" transform="rotate(-8 148 102)" />
  </>
)
const FOREARMS = (
  <>
    <ellipse cx="41" cy="150" rx="8" ry="24" transform="rotate(8 41 150)" />
    <ellipse cx="159" cy="150" rx="8" ry="24" transform="rotate(-8 159 150)" />
  </>
)
const DELTS = (
  <>
    <ellipse cx="57" cy="77" rx="13" ry="15" />
    <ellipse cx="143" cy="77" rx="13" ry="15" />
  </>
)

export const FRONT: ReadonlyArray<[string, ReactNode]> = [
  ['traps', <path d="M91 48 L70 63 L90 64 Z M109 48 L130 63 L110 64 Z" />],
  ['biceps', ARMS],
  ['forearms', FOREARMS],
  ['chest', <path d="M98 68 L98 100 Q84 108 72 98 Q68 84 74 72 Q86 66 98 68 Z M102 68 L102 100 Q116 108 128 98 Q132 84 126 72 Q114 66 102 68 Z" />],
  ['obliques', <path d="M70 102 L86 104 L86 168 L76 164 Q66 140 70 102 Z M130 102 L114 104 L114 168 L124 164 Q134 140 130 102 Z" />],
  [
    'abs',
    <>
      <rect x="88.5" y="106" width="10.5" height="17" rx="3" />
      <rect x="101" y="106" width="10.5" height="17" rx="3" />
      <rect x="88.5" y="126" width="10.5" height="17" rx="3" />
      <rect x="101" y="126" width="10.5" height="17" rx="3" />
      <rect x="88.5" y="146" width="10.5" height="19" rx="3" />
      <rect x="101" y="146" width="10.5" height="19" rx="3" />
    </>,
  ],
  ['quads', <path d="M68 178 L90 180 L88 252 Q80 262 72 252 Q64 216 68 178 Z M132 178 L110 180 L112 252 Q120 262 128 252 Q136 216 132 178 Z" />],
  ['adductors', <path d="M91 184 L100 186 L98 236 L90 250 Z M109 184 L100 186 L102 236 L110 250 Z" />],
  ['shoulders', DELTS],
]

export const BACK: ReadonlyArray<[string, ReactNode]> = [
  ['traps', <path d="M100 46 L86 54 L66 68 L84 80 L100 76 L116 80 L134 68 L114 54 Z" />],
  ['triceps', ARMS],
  ['forearms', FOREARMS],
  ['lats', <path d="M68 84 L86 84 L87 120 L86 152 L80 154 Q66 132 68 84 Z M132 84 L114 84 L113 120 L114 152 L120 154 Q134 132 132 84 Z" />],
  ['mid_back', <path d="M87 82 L100 78 L113 82 L112 118 L100 124 L88 118 Z" />],
  ['lower_back', <path d="M88 126 L112 126 L113 166 Q100 173 87 166 Z" />],
  ['glutes', <path d="M70 170 L99 172 L99 204 Q82 212 70 198 Q66 184 70 170 Z M130 170 L101 172 L101 204 Q118 212 130 198 Q134 184 130 170 Z" />],
  ['hamstrings', <path d="M68 208 L98 210 L95 254 Q84 264 74 254 Q64 236 68 208 Z M132 208 L102 210 L105 254 Q116 264 126 254 Q136 236 132 208 Z" />],
  ['calves', <path d="M71 262 Q82 258 91 262 L89 300 Q87 336 80 344 Q71 322 71 262 Z M129 262 Q118 258 109 262 L111 300 Q113 336 120 344 Q129 322 129 262 Z" />],
  ['rear_delts', DELTS],
]
