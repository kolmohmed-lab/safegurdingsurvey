"use client";

import { FormEvent, useMemo, useState } from "react";

type Lang = "en" | "zh";
type AnswerMap = Record<string, string>;

const copy = {
  en: {
    languageTitle: "Choose your language",
    languageHelp: "Please select a language to begin the safeguarding survey.",
    title: "Safeguarding Survey",
    school: "Dalian American International School",
    intro: "Thank you for taking a few moments to share your experience. Your feedback helps us maintain a safe, secure and welcoming environment for every student and visitor on campus.",
    next: "Next",
    back: "Back",
    start: "Start survey",
    submit: "Submit survey",
    submitting: "Submitting…",
    changeLanguage: "Change language",
    details: "Please tell us more",
    detailsPlaceholder: "Enter details here…",
    suggestionPlaceholder: "Share any suggestions here…",
    optional: "Optional",
    question: "Question",
    of: "of",
    thanksTitle: "Thank you for your feedback",
    thanksText: "Your safeguarding survey has been submitted successfully.",
    submitError: "We could not submit your response. Please try again or speak with a member of staff.",
  },
  zh: {
    languageTitle: "请选择语言",
    languageHelp: "请选择一种语言开始填写安全保护问卷。",
    title: "安全保护问卷",
    school: "大连美国国际学校",
    intro: "感谢您抽出几分钟分享您的体验。您的反馈将帮助我们为每一位学生和访客营造安全、安心且友好的校园环境。",
    next: "下一题",
    back: "返回",
    start: "开始问卷",
    submit: "提交问卷",
    submitting: "正在提交…",
    changeLanguage: "切换语言",
    details: "请提供更多信息",
    detailsPlaceholder: "请在此填写详细信息……",
    suggestionPlaceholder: "请在此分享您的建议……",
    optional: "可选填",
    question: "问题",
    of: "/",
    thanksTitle: "感谢您的反馈",
    thanksText: "您的学生安全保护问卷已成功提交。",
    submitError: "提交失败，请重试或联系学校工作人员。",
  },
};

const questions = [
  {
    id: "q1",
    en: "Were you greeted and signed in appropriately upon arrival?",
    zh: "您到校时是否得到了接待并完成访客登记？",
    options: [["yes", "Yes", "是"], ["no", "No", "否"]],
  },
  {
    id: "q2",
    en: "Were you asked to wear your visitor badge around your neck at all times?",
    zh: "您是否被提醒在访校期间始终佩戴访客证？",
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
    zh: "您在访校期间是否观察到任何令人担忧的行为或情况？",
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
    zh: "您如何评价本次校园访问期间校园安全和学生保护方面的整体情况？",
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
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [details, setDetails] = useState<AnswerMap>({});
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const totalSteps = questions.length + 1;
  const completion = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step, totalSteps]);

  if (!lang) {
    return (
      <main className="shell language-shell">
        <section className="language-card">
          <div className="brand-row"><div className="brand-mark">DAIS</div></div>
          <h1>{copy.en.languageTitle}</h1>
          <p className="zh-title">{copy.zh.languageTitle}</p>
          <p className="language-help">{copy.en.languageHelp}<br />{copy.zh.languageHelp}</p>
          <div className="language-buttons">
            <button onClick={() => setLang("en")} className="language-button"><strong>English</strong></button>
            <button onClick={() => setLang("zh")} className="language-button"><strong>中文</strong></button>
          </div>
        </section>
      </main>
    );
  }

  const t = copy[lang];

  if (!started) {
    return (
      <main className="shell welcome-shell">
        <header className="wizard-topbar">
          <div className="brand-row compact"><div className="brand-mark">DAIS</div></div>
          <button type="button" className="lang-link" onClick={() => setLang(null)}>{t.changeLanguage}</button>
        </header>
        <section className="welcome-card">
          <div className="eyebrow dark">{t.school}</div>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          <button className="primary-button" onClick={() => setStarted(true)}>{t.start}</button>
        </section>
      </main>
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, answers, details, suggestion, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
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
          <div className="brand-footer"><strong>DAIS</strong></div>
        </section>
      </main>
    );
  }

  const isSuggestionStep = step === questions.length;
  const currentQuestion = !isSuggestionStep ? questions[step] : null;
  const requiresDetails = !!(currentQuestion?.detailsWhen && answers[currentQuestion.id] === currentQuestion.detailsWhen);
  const canContinue = isSuggestionStep || !!(currentQuestion && answers[currentQuestion.id] && (!requiresDetails || details[currentQuestion.id]?.trim()));

  function choose(value: string) {
    if (!currentQuestion) return;
    setAnswers((a) => ({ ...a, [currentQuestion.id]: value }));
    setStatus("idle");
  }

  function next() {
    if (!canContinue) return;
    if (step < totalSteps - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <main className="shell wizard-shell">
      <header className="wizard-topbar">
        <div className="brand-row compact"><div className="brand-mark">DAIS</div></div>
        <button type="button" className="lang-link" onClick={() => setLang(null)}>{t.changeLanguage}</button>
      </header>

      <div className="wizard-progress">
        <div className="wizard-progress-fill" style={{ width: `${completion}%` }} />
      </div>

      <form className="wizard-stage" onSubmit={submit}>
        <section className="single-question-card" key={step}>
          <div className="step-label">{t.question} {step + 1} {t.of} {totalSteps}</div>

          {!isSuggestionStep && currentQuestion ? (
            <>
              <div className="question-title-row">
                <h1>{currentQuestion[lang]}</h1>
              </div>

              <div className="typeform-options">
                {currentQuestion.options.map(([value, en, zh]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => choose(value)}
                    className={`typeform-option ${answers[currentQuestion.id] === value ? "selected" : ""}`}
                  >
                    <span className="option-text">{lang === "en" ? en : zh}</span>
                    <span className="option-check">✓</span>
                  </button>
                ))}
              </div>

              {requiresDetails && (
                <label className="typeform-details">
                  <span>{t.details}</span>
                  <textarea
                    autoFocus
                    rows={4}
                    value={details[currentQuestion.id] || ""}
                    placeholder={t.detailsPlaceholder}
                    onChange={(e) => setDetails((d) => ({ ...d, [currentQuestion.id]: e.target.value }))}
                  />
                </label>
              )}
            </>
          ) : (
            <>
              <div className="question-title-row">
                <h1>{lang === "en" ? "Do you have any suggestions for strengthening our safeguarding policies or procedures?" : "您对加强学校安全保护政策或流程有任何建议吗？"}</h1>
                <span className="optional-badge">{t.optional}</span>
              </div>
              <textarea className="suggestion-area" rows={6} value={suggestion} placeholder={t.suggestionPlaceholder} onChange={(e) => setSuggestion(e.target.value)} />
            </>
          )}

          {status === "error" && <div className="error-box" role="alert">{t.submitError}</div>}

          <div className="wizard-actions">
            <button type="button" className="back-button" onClick={back} disabled={step === 0}>← {t.back}</button>
            {isSuggestionStep ? (
              <button className="primary-button" disabled={status === "submitting"} type="submit">{status === "submitting" ? t.submitting : t.submit}</button>
            ) : (
              <button type="button" className="primary-button" onClick={next} disabled={!canContinue}>{t.next}</button>
            )}
          </div>
        </section>
      </form>
    </main>
  );
}
