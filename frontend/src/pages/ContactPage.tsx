import { useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { sendContactMessage } from '../api'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendContactMessage({
        name: nameRef.current!.value,
        email: emailRef.current!.value,
        subject: subjectRef.current!.value,
        message: messageRef.current!.value,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Saatmine ebaõnnestus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-[610px] px-6 pt-24 text-center">
        <h1 className="font-serif text-[48px] text-accent">Kontakt</h1>
        <p className="mt-6 text-[16px] text-muted">
          Küsimuste, tagasiside või erisoovide korral võta meiega julgelt ühendust.
        </p>
      </section>

      <section className="mx-auto mt-12 flex max-w-[1252px] flex-col gap-8 px-6 lg:flex-row lg:px-0">
        <div className="w-full max-w-[503px] shrink-0">
          <h2 className="font-serif text-[24px] text-text">Leia meid</h2>
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex gap-2">
              <Icon name="location" className="mt-0.5 h-6 w-4 shrink-0" />
              <div>
                <p className="font-serif text-[16px] font-semibold text-text">Aadress</p>
                <p className="mt-2 text-[16px] text-muted">
                  Telliskivi 60a, Tallinn
                  <br />
                  Depoo toidutänav
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Icon name="phone" className="mt-0.5 size-6 shrink-0" />
              <div>
                <p className="font-serif text-[16px] font-semibold text-text">Telefon</p>
                <p className="mt-2 text-[16px] text-muted">+372 555 1234</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Icon name="mail" className="mt-0.5 size-6 shrink-0" />
              <div>
                <p className="font-serif text-[16px] font-semibold text-text">E-post</p>
                <p className="mt-2 text-[16px] text-muted">info@shoyu.ee</p>
              </div>
            </div>
          </div>

          <h2 className="mt-12 font-serif text-[24px] text-text">Lahtiolekuajad</h2>
          <div className="mt-6 flex gap-3">
            <Icon name="time" className="mt-1 size-[18px] shrink-0" />
            <div className="w-full space-y-2 text-[16px]">
              <div className="flex justify-between border-b border-muted/30 pb-2 text-muted">
                <span>Esmaspäev - Neljapäev</span>
                <span>18:00 - 02:00</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2 text-muted">
                <span>Reede - Laupäev</span>
                <span>18:00 - 05:00</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Pühapäev</span>
                <span>Suletud</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-[600px] flex-1 items-center justify-center rounded-[3px] border border-muted/30 bg-card">
          {submitted ? (
            <div className="flex flex-col items-center gap-6 px-8 text-center">
              <div className="flex size-[75px] items-center justify-center rounded-full bg-accent/20">
                <Icon name="send" className="size-[45px]" />
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[36px] text-text">Sõnum saadetud!</p>
                <p className="text-[18px] text-muted">
                  Täname kirja eest. Vastame sulle esimesel võimalusel.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full p-8 lg:p-12">
              <h2 className="font-serif text-[24px] text-text">Saada sõnum</h2>
              {error && (
                <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400">
                  {error}
                </div>
              )}
              <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="flex flex-col gap-3">
                    <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                      Nimi
                    </span>
                    <input
                      required
                      ref={nameRef}
                      type="text"
                      placeholder="Sinu nimi"
                      className="h-[39px] rounded-[1px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                    />
                  </label>
                  <label className="flex flex-col gap-3">
                    <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                      E-post
                    </span>
                    <input
                      required
                      ref={emailRef}
                      type="email"
                      placeholder="sinu@email.ee"
                      className="h-[39px] rounded-[1px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-3">
                  <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                    Teema
                  </span>
                  <input
                    ref={subjectRef}
                    type="text"
                    placeholder="Millega saame aidata?"
                    className="h-[39px] rounded-[1px] border border-muted/30 bg-bg px-3 text-[14px] text-text outline-none focus:border-accent"
                  />
                </label>
                <label className="flex flex-col gap-3">
                  <span className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                    Sõnum
                  </span>
                  <textarea
                    required
                    ref={messageRef}
                    rows={6}
                    placeholder="Kirjuta oma sõnum siia..."
                    className="resize-none rounded-[1px] border border-muted/30 bg-bg px-3 py-3 text-[14px] text-text outline-none focus:border-accent"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-fit items-center gap-2 bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-white disabled:opacity-60"
                >
                  {loading ? 'Saadan...' : 'saada sõnum'}
                  <Icon name="send" className="size-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
