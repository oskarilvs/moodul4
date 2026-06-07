import { Users } from 'lucide-react'
import { useState } from 'react'
import { Icon } from '../components/Icon'

type Step = 1 | 2 | 3

export function BookingPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState({
    date: '',
    time: '',
    guests: '1 Inimene',
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-[824px] px-6 pt-24">
        <div className="text-center">
          <h1 className="font-serif text-[48px] text-accent">Broneeri Laud</h1>
          <p className="mt-6 text-[16px] text-muted">
            Garanteeri endale koht linna parimas öises ramen-baaris.
          </p>
        </div>

        <div className="mx-auto mt-12 flex w-[246px] items-center justify-center">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="flex items-center">
              <div
                className={`flex size-8 items-center justify-center rounded-full text-[12px] font-semibold uppercase ${
                  step >= n ? 'bg-accent text-white' : 'bg-card text-muted'
                }`}
              >
                {n}
              </div>
              {i < 2 && (
                <div
                  className={`h-1 w-[107px] ${step > n ? 'bg-accent' : 'bg-card'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative mx-auto mt-12 max-w-[824px]">
          {step === 3 ? (
            <div className="flex min-h-[612px] flex-col items-center justify-center gap-8 rounded-[3px] border border-muted/30 bg-card px-[107px] py-[102px] text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="flex size-[75px] items-center justify-center rounded-full bg-accent/20">
                  <Icon name="check" className="size-[45px]" />
                </div>

                <div className="flex max-w-[548px] flex-col gap-3 text-center">
                  <p className="font-serif text-[36px] text-text">Broneering kinnitatud!</p>
                  <p className="text-[18px] text-muted">
                    Ootame sind {form.date || '—'} kell {form.time || '—'}. Saatsime
                    kinnituse ja lisainfo ka sinu e-postile ({form.email || 'sinu@email.ee'}).
                  </p>
                </div>

                <div className="w-[396px] bg-bg px-[14px] py-[14px] text-[14px]">
                  <div className="flex items-center justify-between font-medium uppercase tracking-[0.28px]">
                    <span className="text-muted">Nimi:</span>
                    <span className="text-text">{form.name || '—'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-medium uppercase tracking-[0.28px] text-muted">Aeg:</span>
                    <span className="text-text">
                      {form.date || '—'} / {form.time || '—'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-medium uppercase tracking-[0.28px] text-muted">Külalisi:</span>
                    <span className="text-text">{form.guests}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setForm({ date: '', time: '', guests: '1 Inimene', name: '', phone: '', email: '', notes: '' })
                }}
                className="border border-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-accent hover:bg-accent hover:text-white"
              >
                uus broneering
              </button>
            </div>
          ) : (
            <div className="rounded-[3px] border border-muted/30 bg-card p-8">
              <h2 className="font-serif text-[24px] text-text">
                {step === 1 ? 'Broneeringu andmed' : 'Kontaktandmed'}
              </h2>
              <div className="mt-3 h-px bg-muted/30" />

              {step === 1 ? (
                <div className="mt-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <label className="flex flex-col gap-3">
                      <span className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        <Icon name="calendar" className="h-4 w-[14px]" />
                        Kuupäev
                      </span>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update('date', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        <Icon name="time" className="size-4" />
                        Kellaaeg
                      </span>
                      <select
                        value={form.time}
                        onChange={(e) => update('time', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      >
                        <option value="">Vali aeg</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:00">21:00</option>
                        <option value="22:00">22:00</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        <Users className="size-4" />
                        Külalisi
                      </span>
                      <select
                        value={form.guests}
                        onChange={(e) => update('guests', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      >
                        <option>1 Inimene</option>
                        <option>2 Inimest</option>
                        <option>3 Inimest</option>
                        <option>4 Inimest</option>
                        <option>5+ Inimest</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-12 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-white"
                    >
                      edasi
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flex flex-col gap-6">
                    <label className="flex flex-col gap-3">
                      <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        Nimi
                      </span>
                      <input
                        type="text"
                        placeholder="Sinu nimi"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        Telefon
                      </span>
                      <input
                        type="tel"
                        placeholder="+372 ..."
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        E-post
                      </span>
                      <input
                        type="email"
                        placeholder="sinu@email.ee"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="h-[39px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-3">
                      <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                        Lisamärkused
                      </span>
                      <textarea
                        placeholder="Erilised soovid või allergiad..."
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        rows={4}
                        className="resize-none border border-muted/30 bg-bg px-3 py-3 text-[14px] text-text outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                  <div className="mt-12 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-white"
                    >
                      broneeri
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
