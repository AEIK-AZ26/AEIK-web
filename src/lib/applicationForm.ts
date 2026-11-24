export type FormFieldType = 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'select';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  order: number;
}

export interface ApplicationFormConfig {
  active: boolean;
  title: string;
  intro: string;
  closedMessage: string;
  successMessage: string;
  fields: FormField[];
}

export const FORM_KEY = 'membership';

export const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  text: 'Qısa mətn',
  textarea: 'Uzun mətn',
  email: 'E-poçt',
  tel: 'Telefon',
  date: 'Tarix',
  select: 'Seçim siyahısı',
};

export const DEFAULT_APPLICATION_FORM: ApplicationFormConfig = {
  active: true,
  title: 'Üzvlük proqramına müraciət',
  intro:
    'Formu doldurun — komanda müraciətinizi nəzərdən keçirib 5 iş günü ərzində sizinlə əlaqə saxlayacaq.',
  closedMessage:
    'Müraciət hazırda bağlıdır. Yeni müraciət dövrü açıldıqda bu səhifədə məlumat yerləşdiriləcək.',
  successMessage:
    'Müraciətiniz qeydə alındı. Komanda qısa müddətdə sizinlə əlaqə saxlayacaq. Təşəkkür edirik!',
  fields: [
    { id: 'fullName', label: 'Ad və soyad', type: 'text', required: true, placeholder: 'Adınız və soyadınız', order: 1 },
    { id: 'email', label: 'E-poçt', type: 'email', required: true, placeholder: 'ad@example.com', order: 2 },
    { id: 'phone', label: 'Telefon', type: 'tel', required: false, placeholder: '+994 50 000 00 00', order: 3 },
    {
      id: 'education',
      label: 'Təhsil məlumatları',
      type: 'textarea',
      required: true,
      placeholder: 'Universitet, fakültə, kurs və məzuniyyət ili',
      help: 'Təhsil aldığınız müəssisə və ixtisası qeyd edin.',
      order: 4,
    },
    {
      id: 'degree',
      label: 'Akademik dərəcə',
      type: 'select',
      required: true,
      options: ['Bakalavr', 'Magistr', 'Doktorant', 'Dosent', 'Professor', 'Digər'],
      order: 5,
    },
    { id: 'specialty', label: 'İxtisas', type: 'text', required: true, placeholder: 'Məs: Biologiya, Kompüter elmləri', order: 6 },
    {
      id: 'field',
      label: 'Fəaliyyət sahəsi',
      type: 'select',
      required: true,
      options: ['Təbiət elmləri', 'Mühəndislik', 'Tibb və biologiya', 'İqtisadiyyat', 'Humanitar elmlər', 'İnformasiya texnologiyaları', 'Digər'],
      order: 7,
    },
    {
      id: 'about',
      label: 'Özünüz haqqında',
      type: 'textarea',
      required: true,
      placeholder: 'Təcrübəniz, maraq dairələriniz və proqrama qoşulma səbəbiniz',
      order: 8,
    },
  ],
};

export function normalizeFormConfig(raw: unknown): ApplicationFormConfig {
  const source = (raw || {}) as Partial<ApplicationFormConfig>;
  const fields = Array.isArray(source.fields) && source.fields.length ? source.fields : DEFAULT_APPLICATION_FORM.fields;

  return {
    active: source.active !== false,
    title: String(source.title || DEFAULT_APPLICATION_FORM.title),
    intro: String(source.intro || DEFAULT_APPLICATION_FORM.intro),
    closedMessage: String(source.closedMessage || DEFAULT_APPLICATION_FORM.closedMessage),
    successMessage: String(source.successMessage || DEFAULT_APPLICATION_FORM.successMessage),
    fields: fields
      .map((field, index) => ({
        id: String(field.id || `field-${index + 1}`),
        label: String(field.label || `Sual ${index + 1}`),
        type: (['text', 'textarea', 'email', 'tel', 'date', 'select'] as FormFieldType[]).includes(field.type as FormFieldType)
          ? (field.type as FormFieldType)
          : 'text',
        required: Boolean(field.required),
        placeholder: String(field.placeholder || ''),
        help: String(field.help || ''),
        options: Array.isArray(field.options) ? field.options.map((option) => String(option)).filter(Boolean) : [],
        order: Number.isFinite(Number(field.order)) ? Number(field.order) : index + 1,
      }))
      .sort((a, b) => a.order - b.order),
  };
}
