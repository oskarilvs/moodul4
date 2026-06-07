import { Icon } from './Icon'

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      <img
        src="/media/footer_bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
      />
      <div className="relative border-t border-muted/30">
        <div className="mx-auto w-full max-w-[1252px] px-6 py-12 lg:px-0">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-[390px]">
              <p className="font-serif text-[27px] font-bold leading-[1.2] text-accent">
                SHOYU &amp; CO.
              </p>
              <p className="mt-6 text-[16px] leading-normal text-muted">
                Autentne öine ramen-baar, kus kohtuvad traditsioonid ja tänapäevane
                tänavatoidukultuur.
              </p>
            </div>

            <div className="w-[189px]">
              <p className="font-serif text-[24px] font-semibold text-accent">Kontakt</p>
              <div className="mt-6 flex flex-col gap-3 text-[16px] text-muted">
                <div className="flex gap-2">
                  <Icon name="location" className="mt-0.5 size-5 shrink-0 object-contain" />
                  <span>
                    Telliskivi 60a, Tallinn
                    <br />
                    (Depoo toidutänav)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="phone" className="size-5 shrink-0 object-contain" />
                  <span>+372 555 1234</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="mail" className="size-5 shrink-0 object-contain" />
                  <span>info@shoyu.ee</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[396px]">
              <p className="font-serif text-[24px] font-semibold text-accent">
                Lahtiolekuajad
              </p>
              <div className="mt-6 flex flex-col gap-3 text-[16px]">
                <div className="flex justify-between text-muted">
                  <span>E - N</span>
                  <span>18:00 - 02:00</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>R - L</span>
                  <span>18:00 - 05:00</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>P</span>
                  <span>Suletud</span>
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 h-px bg-muted/30" />

          <div className="flex flex-col gap-4 text-[16px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Shoyu &amp; Co. Kõik õigused kaitstud.</p>
            <div className="flex gap-6">
              <button type="button" className="hover:text-text">
                Privaatsuspoliitika
              </button>
              <button type="button" className="hover:text-text">
                Tingimused
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
