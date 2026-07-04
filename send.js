export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BOT_TOKEN = '8604900093:AAH6_OavfFsqGNgnDQdiLCkd84Lqqt0oPfU';
  const CHAT_ID   = '800060636';

  try {
    const body = req.body;

    const chipLabels = {
      uz: 'Узбекский', ru: 'Русский', en: 'Английский',
      'uz-kirill': 'Узб. (кирилл)', kk: 'Каракалп.',
      crm: 'CRM', api: 'API', excel: 'Excel/CSV',
      bank: 'Банк. система', erp: 'ERP', other: 'Другое',
      script: 'По сценарию', free: 'Свободный диалог', hybrid: 'Гибрид',
      male: 'Мужской', female: 'Женский', neutral: 'Нейтральный',
      cloud: 'Облако', 'on-prem': 'Локально', yes: 'Да', no: 'Нет', maybe: 'Возможно'
    };

    const get   = k => body[k] || '—';
    const label = vals => vals ? vals.split(',').map(v => chipLabels[v] || v).join(', ') : '—';

    const msg = `
🤖 <b>Новая анкета — AI Voice Agent</b>
━━━━━━━━━━━━━━━━━━━━

<b>👤 Контакт</b>
• Имя: ${get('contact_name')}
• Компания: ${get('contact_company')}
• Телефон/TG: ${get('contact_phone')}
• Email: ${get('contact_email')}

━━━━━━━━━━━━━━━━━━━━
<b>🎯 Цели и объём</b>
• Цель: ${get('q1')}
• Звонков в день: ${get('q2_day')} / месяц: ${get('q2_month')} / одновременно: ${get('q2_parallel')}
• Клиенты: ${get('q3')}
• Этапы долга: ${get('q4')}

━━━━━━━━━━━━━━━━━━━━
<b>🗣 Языки и диалог</b>
• Языки: ${label(get('q5'))}
• Режим: ${label(get('q8'))}
• Голос: ${label(get('q15'))}

━━━━━━━━━━━━━━━━━━━━
<b>🔗 Данные и интеграции</b>
• Данные перед звонком: ${get('q6')}
• Источники: ${label(get('q7'))}
• Интеграции: ${get('q11')}
• Телефония: ${get('q12')}

━━━━━━━━━━━━━━━━━━━━
<b>📋 После звонка</b>
• Действия AI: ${get('q9')}
• Статусы: ${get('q10')}
• Отчёты: ${get('q14')}

━━━━━━━━━━━━━━━━━━━━
<b>🛡 Инфраструктура</b>
• Безопасность: ${get('q13')}
• Размещение: ${label(get('q16'))}
• Масштабирование: ${label(get('q18'))}

━━━━━━━━━━━━━━━━━━━━
<b>💰 KPI и бюджет</b>
• KPI: ${get('q17')}
• Бюджет: ${get('q19')}
• Пилот: ${get('q20_pilot')} | Полное внедрение: ${get('q20_full')}
`.trim();

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' })
    });

    const tgData = await tgRes.json();

    if (tgData.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: tgData.description });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
