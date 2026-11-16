"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const tButtons = translations[language].buttons;
  const tSections = translations[language].sections;
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorReason, setErrorReason] = useState<"validation" | "network">("validation");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setErrorReason("validation");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setStatus("success");
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Could not send message", err);
      setErrorReason("network");
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    if (status === "error") setStatus("idle");
  };

  const fieldClass = "w-full px-4 py-3.5 rounded-xl border border-border-color bg-bg-secondary text-text-primary text-[17px] placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/15 disabled:opacity-50 transition-[border-color,box-shadow] duration-200";

  return (
    <Section id="contact" title={tSections.contactTitle} subtitle={tSections.contactSubtitle}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start">
        <Reveal className="lg:col-span-5">
          <p className="text-[19px] leading-relaxed text-text-secondary">
            {language === "tr"
              ? "Backend rolleri, mikroservis mimarileri, ekip eğitimleri ya da sadece tanışmak için yazabilirsiniz."
              : "Write to me about backend roles, microservice architecture, team training, or just to say hello."}
          </p>

          <dl className="mt-10 border-b border-border-color">
            <div className="border-t border-border-color py-5">
              <dt className="text-sm text-text-secondary">{language === "tr" ? "E-posta" : "Email"}</dt>
              <dd className="mt-1">
                <a href={`mailto:${profile.email}`} className="text-[17px] text-accent-primary hover:underline break-all">
                  {profile.email}
                </a>
              </dd>
            </div>
            {profile.socials.linkedin && (
              <div className="border-t border-border-color py-5">
                <dt className="text-sm text-text-secondary">LinkedIn</dt>
                <dd className="mt-1">
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[17px] text-accent-primary hover:underline break-all"
                  >
                    {profile.socials.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-[28px] bg-bg-tertiary dark:bg-bg-secondary p-6 md:p-10 space-y-4" noValidate>
            {status === "success" && (
              <div role="status" className="flex items-start gap-3 rounded-xl bg-accent-muted p-4 text-text-primary animate-fade-in">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-accent-primary" />
                <div>
                  <p className="font-semibold">{language === "tr" ? "Mesajınız gönderildi." : "Message sent."}</p>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {language === "tr" ? "En kısa sürede dönüş yapacağım." : "I'll get back to you soon."}
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-500/10 p-4 text-text-primary animate-fade-in">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold">
                    {errorReason === "validation"
                      ? (language === "tr" ? "Tüm alanları doldurun." : "Fill in every field.")
                      : (language === "tr" ? "Mesaj gönderilemedi." : "Message not sent.")}
                  </p>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {errorReason === "validation"
                      ? (language === "tr" ? "Ad, e-posta ve mesaj gerekli." : "Name, email and message are required.")
                      : (language === "tr" ? "Tekrar deneyin ya da doğrudan e-posta gönderin." : "Try again, or email me directly.")}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="sr-only">{language === "tr" ? "Ad soyad" : "Name"}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formState.name}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  className={fieldClass}
                  placeholder={language === "tr" ? "Ad soyad" : "Name"}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">{language === "tr" ? "E-posta" : "Email"}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formState.email}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  className={fieldClass}
                  placeholder={language === "tr" ? "E-posta" : "Email"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">{language === "tr" ? "Mesaj" : "Message"}</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formState.message}
                onChange={handleChange}
                disabled={status === "sending"}
                className={`${fieldClass} resize-none`}
                placeholder={language === "tr" ? "Mesajınız" : "Message"}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="lg" disabled={status === "sending"} className="gap-2 w-full sm:w-auto">
                {status === "sending" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    {tButtons.sending}
                  </>
                ) : (
                  tButtons.sendMessage
                )}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
