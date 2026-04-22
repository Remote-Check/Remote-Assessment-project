// MoCA-style line art — canonical black-and-white animal drawings.
// Matches MoCA convention: side profile, simple line work, high contrast.
// These are placeholders modeled on the MoCA style but must be replaced
// with the official licensed MoCA assets in production.

const MocaArt = {
  // Lion (אריה) — male lion, side profile, mane
  Lion: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="אריה">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Mane — outer tufted halo */}
        <path d="M82 118 C 72 106, 60 96, 56 82 C 58 94, 52 102, 44 112
                 C 54 116, 50 128, 44 138 C 54 140, 52 152, 46 164
                 C 58 162, 58 174, 54 186 C 68 180, 74 190, 76 202
                 C 84 192, 96 196, 104 204 C 108 192, 120 190, 130 198
                 C 130 184, 142 178, 152 184" />
        {/* Mane — top */}
        <path d="M82 118 C 86 100, 102 86, 122 82 C 140 78, 160 82, 172 94" />
        {/* Face outline */}
        <path d="M172 94 C 192 92, 210 98, 222 112 C 232 124, 236 138, 234 152
                 C 232 168, 224 180, 212 188 C 200 196, 184 198, 170 194
                 C 156 190, 146 180, 140 168" />
        {/* Lower jaw/chin */}
        <path d="M140 168 C 134 172, 128 178, 128 186 C 130 194, 140 198, 150 196" />
        {/* Cheek / mane inner border */}
        <path d="M140 168 C 130 158, 122 148, 118 136" />
        <path d="M118 136 C 108 140, 98 136, 92 128" />
        {/* Ear */}
        <path d="M196 96 C 198 86, 206 80, 214 82 C 218 86, 218 94, 212 100" />
        <path d="M204 92 C 206 88, 210 88, 212 92" />
        {/* Eye */}
        <ellipse cx="198" cy="128" rx="5" ry="3.5" fill="#000" stroke="none"/>
        <path d="M190 124 C 195 120, 203 120, 208 124" />
        {/* Nose */}
        <path d="M220 148 C 226 150, 228 156, 224 160 C 220 162, 214 160, 214 156 Z" fill="#000"/>
        {/* Muzzle */}
        <path d="M214 156 C 208 164, 200 170, 192 170" />
        <path d="M192 170 C 196 176, 204 178, 210 174" />
        {/* Mouth */}
        <path d="M196 176 C 200 180, 206 180, 210 176" />
        {/* Whisker dots */}
        <circle cx="200" cy="166" r="0.9" fill="#000"/>
        <circle cx="204" cy="168" r="0.9" fill="#000"/>
        <circle cx="208" cy="168" r="0.9" fill="#000"/>
        {/* Body suggestion — back line */}
        <path d="M234 152 C 252 156, 270 162, 282 176 C 290 186, 290 200, 282 210
                 C 270 220, 250 222, 232 218" />
        {/* Paw */}
        <path d="M150 196 C 148 210, 148 222, 152 230 L 176 230
                 M 158 230 L 158 222 M 166 230 L 166 222 M 174 230 L 174 222" />
        {/* Tail tuft suggestion */}
        <path d="M286 188 C 296 192, 304 200, 302 212 C 298 218, 290 220, 286 214" />
        {/* Mane radiating lines for texture */}
        <path d="M70 110 L 64 106 M 60 124 L 52 124 M 60 144 L 52 148
                 M 66 166 L 60 170 M 80 184 L 76 192
                 M 112 198 L 110 206" />
      </g>
    </svg>
  ),

  // Rhinoceros (קרנף) — side profile, two-horn
  Rhino: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="קרנף">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Body — chunky oval */}
        <path d="M60 160 C 50 140, 54 118, 74 108 C 96 100, 124 100, 150 108
                 L 178 112 C 196 112, 208 108, 218 102
                 L 228 110 C 232 118, 236 128, 240 136
                 C 252 138, 262 144, 268 154 C 274 166, 272 180, 264 190
                 C 252 200, 236 200, 224 192
                 L 218 196
                 C 200 202, 180 204, 160 202 L 90 198
                 C 76 196, 64 184, 60 172 Z" />
        {/* Head/face separation line */}
        <path d="M218 102 C 214 120, 212 134, 214 148 C 218 160, 226 166, 236 166" />
        {/* Front horn — large */}
        <path d="M212 108 C 216 92, 224 80, 238 74
                 C 242 82, 244 92, 240 104 C 234 112, 226 116, 218 116" />
        {/* Back horn — smaller */}
        <path d="M196 104 C 198 94, 204 86, 212 84 C 214 92, 212 100, 206 106" />
        {/* Eye */}
        <circle cx="202" cy="124" r="2.4" fill="#000" stroke="none"/>
        <path d="M196 120 C 200 118, 204 118, 208 120" />
        {/* Ear */}
        <path d="M182 98 C 180 86, 184 78, 192 78 C 196 84, 196 94, 192 100" />
        {/* Mouth / jaw line */}
        <path d="M232 146 C 238 150, 244 150, 250 148" />
        <path d="M236 158 C 242 160, 246 158, 250 154" />
        {/* Skin folds — signature rhino */}
        <path d="M88 122 C 108 120, 130 120, 150 124" />
        <path d="M94 140 C 118 138, 142 138, 164 142" />
        <path d="M102 160 C 124 158, 148 158, 170 160" />
        {/* Leg detail */}
        <path d="M84 198 L 84 218 M 100 198 L 100 220 M 200 200 L 200 218 M 220 196 L 220 218" />
        <path d="M74 218 L 96 218 M 90 220 L 112 220 M 190 218 L 212 218 M 210 218 L 232 218" />
        {/* Feet nails */}
        <path d="M78 218 L 78 214 M 86 218 L 86 214 M 94 218 L 94 214
                 M 94 220 L 94 216 M 102 220 L 102 216 M 110 220 L 110 216
                 M 194 218 L 194 214 M 202 218 L 202 214 M 210 218 L 210 214
                 M 214 218 L 214 214 M 222 218 L 222 214 M 230 218 L 230 214" />
        {/* Tail */}
        <path d="M60 160 C 50 158, 42 164, 40 174 C 44 180, 52 178, 56 172" />
        {/* Chest/belly fold */}
        <path d="M70 178 C 86 180, 104 178, 118 174" />
      </g>
    </svg>
  ),

  // Camel (גמל) — dromedary, one hump, side profile
  Camel: ({ width = 320 }) => (
    <svg viewBox="0 0 320 240" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }} aria-label="גמל">
      <g fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Hump + back */}
        <path d="M80 126 C 96 92, 124 70, 152 72 C 176 74, 192 92, 196 116
                 C 200 118, 210 122, 216 130" />
        {/* Neck up */}
        <path d="M216 130 C 228 108, 240 88, 252 74" />
        {/* Head */}
        <path d="M252 74 C 260 66, 272 62, 282 66 C 290 70, 294 80, 290 90
                 C 286 96, 278 98, 272 96" />
        {/* Lower jaw + mouth */}
        <path d="M272 96 C 268 98, 260 98, 252 92" />
        <path d="M252 92 C 254 86, 254 80, 252 74" />
        {/* Mouth split */}
        <path d="M276 92 C 280 92, 284 92, 286 90" />
        {/* Nostril */}
        <path d="M286 76 C 284 74, 280 74, 278 76" />
        {/* Eye */}
        <circle cx="272" cy="80" r="1.8" fill="#000" stroke="none"/>
        {/* Ear */}
        <path d="M262 66 C 258 60, 260 54, 266 54 C 270 58, 270 64, 266 68" />
        {/* Neck down (front) */}
        <path d="M252 92 C 240 114, 232 132, 226 152" />
        <path d="M226 152 C 224 164, 224 176, 228 188" />
        {/* Body underline */}
        <path d="M228 188 L 228 208" />
        {/* Back leg (front) */}
        <path d="M216 130 C 220 152, 222 172, 220 188 L 220 208" />
        {/* Belly */}
        <path d="M220 188 L 140 192" />
        {/* Back legs (rear) */}
        <path d="M140 192 L 140 208 M 124 192 L 124 208" />
        {/* Rear body */}
        <path d="M80 126 C 72 140, 68 160, 72 180 C 76 188, 84 192, 92 192" />
        <path d="M92 192 L 92 208 M 76 180 L 76 208" />
        {/* Tail */}
        <path d="M72 180 C 64 182, 58 186, 58 194 C 62 198, 68 196, 70 192" />
        {/* Hooves — split toe */}
        <g>
          {[76, 92, 124, 140, 220, 228].map((x, i) => (
            <g key={i}>
              <path d={`M${x-5} 208 L ${x+5} 208 L ${x+6} 212 L ${x-6} 212 Z`} />
              <path d={`M${x} 208 L ${x} 212`} />
            </g>
          ))}
        </g>
        {/* Mane hair on neck */}
        <path d="M240 104 C 244 108, 244 112, 242 114
                 M 232 122 C 236 124, 236 128, 234 130
                 M 226 138 C 228 140, 228 144, 226 146" />
        {/* Hump crease */}
        <path d="M120 88 C 128 92, 140 92, 148 90" />
      </g>
    </svg>
  ),
};

window.MocaArt = MocaArt;
