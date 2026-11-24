import mongoose, { Schema, Model } from 'mongoose';

export interface IApplication {
  id: string;
  formKey: string;
  values: Record<string, string>;
  ts: number;
}

const ApplicationSchema = new Schema<IApplication>({
  id: { type: String, required: true, unique: true },
  formKey: { type: String, default: 'membership' },
  values: { type: Schema.Types.Mixed, default: {} },
  ts: { type: Number, default: () => Date.now() },
});

export const ApplicationModel: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
