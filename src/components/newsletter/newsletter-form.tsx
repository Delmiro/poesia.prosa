"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().optional(),
  notify_poems: z.boolean(),
  notify_articles: z.boolean(),
  notify_magazines: z.boolean(),
  notify_news: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function NewsletterForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      notify_poems: true,
      notify_articles: true,
      notify_magazines: true,
      notify_news: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Não foi possível cadastrar. Tente novamente.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-card p-8 text-center">
        <p className="font-display text-xl text-accent">Obrigado por se inscrever!</p>
        <p className="mt-2 text-sm text-muted">
          Você receberá nossas novidades em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-border bg-card p-8"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Nome</label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">WhatsApp (opcional)</label>
        <input
          {...register("whatsapp")}
          placeholder="(00) 00000-0000"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Quero receber sobre:</legend>
        {[
          ["notify_poems", "Novas poesias"],
          ["notify_articles", "Novos artigos"],
          ["notify_magazines", "Novas revistas"],
          ["notify_news", "Novas notícias"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" {...register(key as keyof FormData)} className="rounded" />
            {label}
          </label>
        ))}
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando…" : "Quero receber novidades"}
      </Button>
    </form>
  );
}
