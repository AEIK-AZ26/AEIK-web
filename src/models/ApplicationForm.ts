import mongoose, { Schema, Model } from 'mongoose';
import { FormField } from '@/lib/applicationForm';

export interface IApplicationForm {
  key: string;
  active: boolean;
  title: string;
  intro: string;
  closedMessage: string;
  successMessage: string;
  fields: FormField[];
  ts: number;
}

const FormFieldSchema = new Schema<FormField>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['text', 'textarea', 'email', 'tel', 'date', 'select'], default: 'text' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    help: { type: String, default: '' },
    options: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ApplicationFormSchema = new Schema<IApplicationForm>({
  key: { type: String, required: true, unique: true, default: 'membership' },
  active: { type: Boolean, default: true },
  title: { type: String, default: '' },
  intro: { type: String, default: '' },
  closedMessage: { type: String, default: '' },
  successMessage: { type: String, default: '' },
  fields: { type: [FormFieldSchema], default: [] },
  ts: { type: Number, default: () => Date.now() },
});

export const ApplicationFormModel: Model<IApplicationForm> =
  mongoose.models.ApplicationForm || mongoose.model<IApplicationForm>('ApplicationForm', ApplicationFormSchema);
