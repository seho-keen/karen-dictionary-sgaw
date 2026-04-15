export function getKoreanPronunciation(karenWord: string): string {
    if (!karenWord) return "";

    // 1. Define Consonant Maps based on PDF rules
    // Mapping base unicode characters to Korean equivalents
    const consonantMap: Record<string, string> = {
        'က': '까', 'ခ': '카', 'ဂ': '가', 'ဃ': '하', 'င': '응아',
        'စ': '싸', 'ဆ': '사', 'ၡ': '샤', 'ည': '냐', 'တ': '따',
        'ထ': '타', 'ဒ': '다', 'န': '나', 'ပ': '빠', 'ဖ': '파',
        'ဘ': '바', 'မ': '마', 'ယ': '야', 'ရ': '롸', 'လ': '라',
        'ဝ': '와', 'သ': '싸', 'ဟ': '하', 'အ': '아', 'ဧ': '아'
    };

    // 2. Define Medials/Clusters (e.g. ျ = ㅑ, ြ = ㅡ라, ၠ = ㅉ, ှ = ㅎ/쁘아)
    // For simplicity, we directly apply text replacement for known clusters first
    let processed = karenWord;

    const clusters = [
        { karen: 'ကျ', korean: '끌라' },
        { karen: 'ကြ', korean: '끄라' },
        { karen: 'ကၠ', korean: '짜' },
        { karen: 'ပှ', korean: '쁘아' }
    ];

    for (const cluster of clusters) {
        processed = processed.replace(new RegExp(cluster.karen, 'g'), cluster.korean);
    }

    // 3. Define Vowels
    // We split into components if needed, or we just do straight character replacements.
    // In Karen Unicode, consonants come first, followed by medials, vowels, and tones.
    // A simplified phonetic engine replaces recognized blocks:
    const vowelMap: Record<string, string> = {
        'ါ': '아', 
        'ံ': '이', // 끼 (ကံ) indicates '이' ending
        'ု': '으', // 끄 (ကု) indicates '으' ending
        'ူ': '우', // 꾸 (ကူ) indicates '우' ending
        '့': '에', // 께 (က့) indicates '에' ending
        'ဲ': '애', // 깨 (ကဲ) indicates '애' ending
        'ိ': '오', // 꼬 (ကိ) indicates '오' ending
        'ီ': '꿔'  // 꿔 (ကီ) indicates '꿔/어' ending 
    };

    // Replace basic characters mapping
    let result = '';
    for (let char of processed) {
        if (consonantMap[char]) {
            result += consonantMap[char];
        } else if (vowelMap[char]) {
            // Apply vowel transformation logic - simplified appending
            // In a full NLP engine we merge Jamo (초성, 중성, 종성), but for an approximation string concatenation suffices.
            result += `(${vowelMap[char]})`;
        } else if (['ၢ', 'ၣ်', 'ာ', 'း', 'ၤ', '်'].includes(char)) {
            // Tone markers do not strongly change phonetic spelling in Korean approximation
            continue;
        } else {
            // Unmapped characters are kept intact
            result += char;
        }
    }

    // Clean up approximations e.g. "까(아)" -> "까", "까(이)" -> "끼"
    // Since building a full Hangul Jamo synthesizer requires library (like 'hangul-js'),
    // we use a simplified regex approach for our generated output.
    const optimizations = [
        { rx: /까\(아\)/g, to: '까' },
        { rx: /까\(이\)/g, to: '끼' },
        { rx: /까\(으\)/g, to: '끄' },
        { rx: /까\(우\)/g, to: '꾸' },
        { rx: /까\(에\)/g, to: '께' },
        { rx: /까\(애\)/g, to: '깨' },
        { rx: /까\(오\)/g, to: '꼬' },
        { rx: /까\(꿔\)/g, to: '꿔' },
        // Fallback for general unmerged
        { rx: /\(아\)/g, to: '아' },
        { rx: /\(이\)/g, to: '이' },
        { rx: /\(으\)/g, to: '으' },
        { rx: /\(우\)/g, to: '우' },
        { rx: /\(에\)/g, to: '에' },
        { rx: /\(애\)/g, to: '애' },
        { rx: /\(오\)/g, to: '오' },
        { rx: /\(꿔\)/g, to: '꿔' }
    ];

    for (const opt of optimizations) {
        result = result.replace(opt.rx, opt.to);
    }

    return result.trim();
}
