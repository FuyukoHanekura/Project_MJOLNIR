interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  name: string
  legend: string
  help?: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}

/** Groupe de boutons radio présentés en pastilles (langue, thème). Accessible au clavier. */
export default function RadioChoice<T extends string>({ name, legend, help, options, value, onChange }: Props<T>) {
  return (
    <fieldset className="mt-6">
      <legend className="font-semibold text-ink">{legend}</legend>
      {help && <p className="mt-1 text-sm text-muted">{help}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-11 min-w-20 cursor-pointer items-center justify-center rounded-lg border px-4 font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              value === o.value ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface text-ink2'
            }`}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
