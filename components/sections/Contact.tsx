"use client";

import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";
import { Mail, Linkedin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const tButtons = translations[language].buttons;
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

  return (
    <section id="contact" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 07. establish_communication()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-primary">contact</span><span className="text-text-secondary">.</span>send<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Info & Links */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-display font-bold text-2xl text-text-primary mb-3 font-mono">
            {language === "tr" ? "Birlikte Yeni Projeler Geliştirelim" : "Let's build something together"}
          </h3>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-normal">
            {language === "tr" 
              ? "Yazılım geliştirme rolleri, backend mikroservis mimarileri, eğitim delivery süreçleri veya projeleriniz hakkında görüşmek için mesaj bırakabilirsiniz."
              : "Whether you want to discuss a software engineering role, backend system architectures, training programs, or just want to connect, feel free to drop me a message."}
          </p>

          {/* Contact Details */}
          <div className="space-y-4 pt-4">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3.5 p-4 rounded-xl border border-border-color bg-bg-secondary hover:border-accent-primary/40 dark:hover:border-accent-primary/20 hover:scale-[1.01] transition-all duration-200 shadow-sm"
            >
              <div className="p-2.5 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 text-accent-primary shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-0.5">
                  {language === "tr" ? "E-Posta Adresi" : "Email Me Direct"}
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {profile.email}
                </span>
              </div>
            </a>

            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-xl border border-border-color bg-bg-secondary hover:border-accent-primary/40 dark:hover:border-accent-primary/20 hover:scale-[1.01] transition-all duration-200 shadow-sm"
              >
                <div className="p-2.5 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 text-accent-primary shrink-0">
                  <Linkedin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-0.5">
                    {language === "tr" ? "LinkedIn Profili" : "Connect on LinkedIn"}
                  </span>
                  <span className="text-sm font-semibold text-text-primary break-all block">
                    {profile.socials.linkedin.replace("https://", "")}
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <Card hoverEffect={false} glassmorphism={true} className="border border-border-color p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Status Messages */}
              {status === "success" && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 animate-fade-in font-mono text-xs">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-bold">
                      {language === "tr" ? "Mesajınız başarıyla iletildi!" : "Message sent successfully!"}
                    </span>
                    <span className="text-xs mt-0.5 block opacity-90">
                      {language === "tr" ? "İletişime geçtiğiniz için teşekkürler. En kısa sürede dönüş yapacağım." : "Thank you for reaching out. I'll get back to you as soon as possible."}
                    </span>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-300 animate-fade-in font-mono text-xs">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-bold">
                      {errorReason === "validation"
                        ? (language === "tr" ? "Eksik alanlar var!" : "Incomplete fields!")
                        : (language === "tr" ? "Mesaj gönderilemedi!" : "Message failed to send!")}
                    </span>
                    <span className="text-xs mt-0.5 block opacity-90">
                      {errorReason === "validation"
                        ? (language === "tr" ? "Lütfen göndermeden önce adınızı, e-postanızı ve mesajınızı doldurun." : "Please fill out your name, email, and message before submitting.")
                        : (language === "tr" ? "Bir şeyler ters gitti, lütfen tekrar deneyin veya doğrudan e-posta gönderin." : "Something went wrong, please try again or email me directly.")}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                    {language === "tr" ? "Ad Soyad" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    disabled={status === "sending"}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary disabled:opacity-50 transition-all duration-200"
                    placeholder={language === "tr" ? "Adınızı girin" : "Enter your name"}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                    {language === "tr" ? "E-Posta" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    disabled={status === "sending"}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary disabled:opacity-50 transition-all duration-200"
                    placeholder={language === "tr" ? "E-posta adresiniz" : "Enter your email"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider font-mono">
                  {language === "tr" ? "Mesajınız" : "Your Message"}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  disabled={status === "sending"}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-color bg-bg-secondary text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary disabled:opacity-50 resize-none transition-all duration-200"
                  placeholder={language === "tr" ? "Mesajınızı veya proje detaylarını buraya yazabilirsiniz..." : "Enter details of your project or role request..."}
                />
              </div>

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 font-mono"
              >
                {status === "sending" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {tButtons.sending}
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    {tButtons.sendMessage}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Closing Gutter */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}

