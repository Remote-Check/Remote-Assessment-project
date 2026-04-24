const fs = require('fs');

// 1. Create Migration for Audio Bucket
const migration = `-- supabase/migrations/20260421000007_audio_storage.sql
insert into storage.buckets (id, name, public) 
values ('audio', 'audio', true)
on conflict (id) do nothing;

create policy "Public Access to Audio"
  on storage.objects for select
  using ( bucket_id = 'audio' );

create policy "Admin Write Access to Audio"
  on storage.objects for all
  using ( bucket_id = 'audio' )
  with check ( auth.role() = 'service_role' );
`;
fs.writeFileSync('supabase/migrations/20260421000007_audio_storage.sql', migration);

// 2. Create save-audio Edge Function
const edgeFnContent = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from 'https://deno.land/std@0.198.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  let body: { sessionId: string; linkToken: string; taskId: string; audioBase64: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const { sessionId, linkToken, taskId, audioBase64 } = body;
  if (!sessionId || !linkToken || !taskId || !audioBase64) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: session } = await supabase.from('sessions').select('id, link_token').eq('id', sessionId).single();
  if (!session || session.link_token !== linkToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const taskName = taskId.replace(/^moca-/, '');
  const base64Data = audioBase64.replace(/^data:audio\\/\\w+;base64,/, '');
  const audioBytes = decode(base64Data);
  const fileName = \`\${sessionId}/\${taskName}.webm\`;

  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(fileName, audioBytes, { contentType: 'audio/webm', upsert: true });

  if (uploadError) {
    console.error(uploadError);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
  }

  const { data } = supabase.storage.from('audio').getPublicUrl(fileName);
  return new Response(JSON.stringify({ ok: true, url: data.publicUrl }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});
});
`;
fs.mkdirSync('supabase/functions/save-audio', { recursive: true });
fs.writeFileSync('supabase/functions/save-audio/index.ts', edgeFnContent);

// 3. Update AudioRecorder.tsx
let ar = fs.readFileSync('client/src/app/components/AudioRecorder.tsx', 'utf8');

if (!ar.includes('useAssessmentStore')) {
  ar = ar.replace('import { AudioStore } from "../store/audioStore";', 'import { AudioStore } from "../store/audioStore";\nimport { useAssessmentStore } from "../store/AssessmentContext";\nimport { edgeFn } from "../../lib/supabase";');
  
  ar = ar.replace('export function AudioRecorder({', 'export function AudioRecorder({\n  const { state } = useAssessmentStore();\n');

  ar = ar.replace(
    '  // Load existing audio URL if we have an ID\n  useEffect(() => {\n    let currentUrl: string | null = null;\n    if (audioId) {\n      AudioStore.getAudio(audioId).then(blob => {\n        if (blob) {\n          currentUrl = URL.createObjectURL(blob);\n          setAudioUrl(currentUrl);\n        }\n      }).catch(err => {\n        console.error("Failed to load audio from DB:", err);\n      });\n    }',
    `  // Load existing audio URL if we have an ID
  useEffect(() => {
    let currentUrl: string | null = null;
    if (audioId) {
      if (audioId.startsWith('http')) {
        setAudioUrl(audioId);
      } else {
        AudioStore.getAudio(audioId).then(blob => {
          if (blob) {
            currentUrl = URL.createObjectURL(blob);
            setAudioUrl(currentUrl);
          }
        }).catch(err => {
          console.error("Failed to load audio from DB:", err);
        });
      }
    }`
  );

  const newOnStop = `mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        
        let finalIdOrUrl = \`audio_\${taskId}_\${Date.now()}\`;
        try {
          // Upload to Supabase if session available
          if (state.id && state.linkToken) {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              const res = await fetch(edgeFn('save-audio'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: state.id, linkToken: state.linkToken, taskId, audioBase64: base64 })
              });
              if (res.ok) {
                const data = await res.json();
                finalIdOrUrl = data.url;
              }
              finishStop(finalIdOrUrl, audioBlob);
            };
            return;
          }
        } catch (e) {
          console.error("Audio upload failed, falling back to local", e);
        }
        finishStop(finalIdOrUrl, audioBlob);
      };

      const finishStop = async (idOrUrl: string, blob: Blob) => {
        if (!idOrUrl.startsWith('http')) await AudioStore.saveAudio(idOrUrl, blob);
        const url = idOrUrl.startsWith('http') ? idOrUrl : URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioId(idOrUrl);
        onRecordingComplete(idOrUrl);
        stream.getTracks().forEach(track => track.stop());
      };`;

  ar = ar.replace(/mediaRecorder.onstop = async \(\) => \{[\s\S]*?stream\.getTracks\(\)\.forEach\(track => track\.stop\(\)\);\n\s*\};/, newOnStop);
  fs.writeFileSync('client/src/app/components/AudioRecorder.tsx', ar);
}

// 4. Update PlaybackAudio.tsx
let pa = fs.readFileSync('client/src/app/components/PlaybackAudio.tsx', 'utf8');
if (!pa.includes('audioId.startsWith("http")')) {
  const oldEffect = `  useEffect(() => {
    if (!audioId) return;

    let url: string | null = null;

    AudioStore.getAudio(audioId)
      .then(blob => {
        if (blob) {
          url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } else {
          setError("לא נמצאה הקלטה עבור משימה זו.");
        }
      })
      .catch(err => {
        console.error("Failed to load audio:", err);
        setError("אירעה שגיאה בטעינת ההקלטה.");
      });

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioId]);`;

  const newEffect = `  useEffect(() => {
    if (!audioId) return;

    let url: string | null = null;

    if (audioId.startsWith('http')) {
      setAudioUrl(audioId);
    } else {
      AudioStore.getAudio(audioId)
        .then(blob => {
          if (blob) {
            url = URL.createObjectURL(blob);
            setAudioUrl(url);
          } else {
            setError("לא נמצאה הקלטה עבור משימה זו.");
          }
        })
        .catch(err => {
          console.error("Failed to load audio:", err);
          setError("אירעה שגיאה בטעינת ההקלטה.");
        });
    }

    return () => {
      if (url && !url.startsWith('http')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioId]);`;

  pa = pa.replace(oldEffect, newEffect);
  fs.writeFileSync('client/src/app/components/PlaybackAudio.tsx', pa);
}

console.log("STORAGE-03 fixed.");
