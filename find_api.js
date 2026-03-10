const apis = [
    'https://pipedapi.kavin.rocks',
    'https://piped-api.garudalinux.org',
    'https://pipedapi.lunar.icu',
    'https://pipedapi.official-esc.fr',
    'https://pipedapi.nicfab.eu',
    'https://pipedapi.leptons.xyz',
    'https://pipedapi.ducks.party',
    'https://pipedapi.drgns.space'
];

async function test() {
    for (const api of apis) {
        try {
            console.log(`Testing: ${api}`);
            const res = await fetch(`${api}/streams/dQw4w9WgXcQ`, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
                const data = await res.json();
                if (data.audioStreams && data.audioStreams.length > 0) {
                    console.log(`✅ SUCCESS: ${api}`);
                    process.exit(0);
                }
            }
            console.log(`❌ FAIL: ${api} (Status: ${res.status})`);
        } catch (e) {
            console.log(`❌ ERR: ${api} (${e.message})`);
        }
    }
}
test();
