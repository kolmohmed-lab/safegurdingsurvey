"use client";

import { FormEvent, useMemo, useState } from "react";

type Lang = "en" | "zh";
type AnswerMap = Record<string, string>;

const copy = {
  en: {
    languageTitle: "Choose your language",
    languageHelp: "Please select a language to begin the safeguarding survey.",
    english: "English",
    chinese: "中文",
    title: "Safeguarding Survey",
    school: "Dalian American International School",
    intro: "Thank you for taking a few moments to share your experience. Your feedback helps us maintain a safe, secure and welcoming environment for every student and visitor on campus.",
    required: "Required",
    progress: "Progress",
    submit: "Submit survey",
    submitting: "Submitting…",
    changeLanguage: "Change language",
    details: "Please tell us more",
    detailsPlaceholder: "Enter details here…",
    suggestionPlaceholder: "Share any suggestions here…",
    thanksTitle: "Thank you for your feedback",
    thanksText: "Your safeguarding survey has been submitted successfully.",
    submitError: "We could not submit your response. Please try again or speak with a member of staff.",
  },
  zh: {
    languageTitle: "请选择语言",
    languageHelp: "请选择一种语言开始填写安全保护问卷。",
    english: "English",
    chinese: "中文",
    title: "安全保护问卷",
    school: "大连美国国际学校",
    intro: "感谢您抽出几分钟分享您的体验。您的反馈将帮助我们为每一位学生和访客营造安全、安心且友好的校园环境。",
    required: "必填",
    progress: "完成进度",
    submit: "提交问卷",
    submitting: "正在提交…",
    changeLanguage: "切换语言",
    details: "请提供更多信息",
    detailsPlaceholder: "请在此填写详细信息……",
    suggestionPlaceholder: "请在此分享您的建议……",
    thanksTitle: "感谢您的反馈",
    thanksText: "您的安全保护问卷已成功提交。",
    submitError: "提交失败，请重试或联系学校工作人员。",
  },
};

const questions = [
  {
    id: "q1",
    en: "Were you greeted and signed in appropriately upon arrival?",
    zh: "您到校时是否得到了适当的接待并完成访客登记？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
  },
  {
    id: "q2",
    en: "Were you asked to wear your visitor badge around your neck at all times?",
    zh: "您是否被提醒在校期间始终佩戴访客证？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
  },
  {
    id: "q3",
    en: "Did you feel safe and secure on campus?",
    zh: "您在校园内是否感到安全和安心？",
    options: [
      ["very-safe", "Very safe & secure", "非常安全、安心"],
      ["somewhat-safe", "Somewhat safe & secure", "比较安全、安心"],
      ["neutral", "Neutral", "一般"],
      ["somewhat-unsafe", "Somewhat unsafe or insecure", "有些不安全或不安心"],
      ["very-unsafe", "Very unsafe or insecure", "非常不安全或不安心"],
    ],
  },
  {
    id: "q4",
    en: "Did you notice any areas or items on campus that felt unsafe or could be improved?",
    zh: "您是否发现校园内有任何区域或设施存在安全隐患，或认为需要改进？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
    detailsWhen: "yes",
  },
  {
    id: "q5",
    en: "Did you observe any concerning behavior or situations during your time on campus?",
    zh: "您在校期间是否观察到任何令人担忧的行为或情况？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
    detailsWhen: "yes",
  },
  {
    id: "q6",
    en: "Was a staff member available to assist you if needed?",
    zh: "当您需要帮助时，是否有工作人员可以提供协助？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
  },
  {
    id: "q7",
    en: "How would you rate your overall experience in relation to campus safety and student safeguarding?",
    zh: "您如何评价本次体验中校园安全和学生保护方面的整体情况？",
    options: [
      ["excellent", "Excellent", "优秀"],
      ["good", "Good", "良好"],
      ["fair", "Fair", "一般"],
      ["poor", "Poor", "较差"],
    ],
  },
];

export default function Home() {
  const [lang, setLang] = useState<Lang | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [details, setDetails] = useState<AnswerMap>({});
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const answeredCount = useMemo(() => questions.filter((q) => answers[q.id]).length, [answers]);
  const completion = Math.round((answeredCount / questions.length) * 100);

  if (!lang) {
    return (
      <main className="shell language-shell">
        <section className="language-card">
          <div className="brand-row">
            <div className="brand-mark">DAIS</div>
            <div className="brand-copy">Nord Anglia Education</div>
          </div>
          <div className="language-icon" aria-hidden="true">文</div>
          <h1>{copy.en.languageTitle}</h1>
          <p className="zh-title">{copy.zh.languageTitle}</p>
          <p className="language-help">{copy.en.languageHelp}<br />{copy.zh.languageHelp}</p>
          <div className="language-buttons">
            <button onClick={() => setLang("en")} className="language-button"><span>EN</span><strong>English</strong></button>
            <button onClick={() => setLang("zh")} className="language-button"><span>中</span><strong>中文</strong></button>
          </div>
        </section>
      </main>
    );
  }

  const t = copy[lang];

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (const q of questions) {
      if (!answers[q.id]) return;
      if (q.detailsWhen && answers[q.id] === q.detailsWhen && !details[q.id]?.trim()) return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, answers, details, suggestion, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="shell success-shell">
        <section className="success-card">
          <div className="check">✓</div>
          <h1>{t.thanksTitle}</h1>
          <p>{t.thanksText}</p>
          <div className="brand-footer"><strong>DAIS</strong><span>Nord Anglia Education</span></div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell survey-shell">
      <header className="topbar">
        <div className="brand-row compact"><div className="brand-mark">DAIS</div><div className="brand-copy">Nord Anglia Education</div></div>
        <button type="button" className="lang-link" onClick={() => setLang(null)}>{t.changeLanguage}</button>
      </header>

      <section className="hero">
        <div className="eyebrow">{t.school}</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
        <div className="progress-wrap">
          <div className="progress-meta"><span>{t.progress}</span><strong>{completion}%</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }} /></div>
        </div>
      </section>

      <form onSubmit={submit} className="survey-form">
        {questions.map((q, index) => (
          <section className="question-card" key={q.id}>
            <div className="question-number">{index + 1}</div>
            <div className="question-content">
              <div className="question-heading">
                <h2>{q[lang]}</h2><span className="required">{t.required}</span>
              </div>
              <div className="options">
                {q.options.map(([value, en, zh]) => (
                  <label className={`option ${answers[q.id] === value ? "selected" : ""}`} key={value}>
                    <input required type="radio" name={q.id} value={value} checked={answers[q.id] === value} onChange={() => setAnswers((a) => ({ ...a, [q.id]: value }))} />
                    <span className="radio-dot" />
                    <span>{lang === "en" ? en : zh}</span>
                  </label>
                ))}
              </div>
              {q.detailsWhen && answers[q.id] === q.detailsWhen && (
                <label className="details-field">
                  <span>{t.details} <b>*</b></span>
                  <textarea required rows={4} value={details[q.id] || ""} placeholder={t.detailsPlaceholder} onChange={(e) => setDetails((d) => ({ ...d, [q.id]: e.target.value }))} />
                </label>
              )}
            </div>
          </section>
        ))}

        <section className="question-card optional-card">
          <div className="question-number">8</div>
          <div className="question-content">
            <div className="question-heading"><h2>{lang === "en" ? "If you have any suggestions for strengthening our safeguarding policies or procedures, please share them below." : "如果您对加强学校安全保护政策或流程有任何建议，请在下方填写。"}</h2></div>
            <textarea rows={5} value={suggestion} placeholder={t.suggestionPlaceholder} onChange={(e) => setSuggestion(e.target.value)} />
          </div>
        </section>

        {status === "error" && <div className="error-box" role="alert">{t.submitError}</div>}
        <button className="submit-button" disabled={status === "submitting"} type="submit">{status === "submitting" ? t.submitting : t.submit}</button>
        <p className="privacy-note">DAIS • Nord Anglia Education</p>
      </form>
    </main>
  );
}
