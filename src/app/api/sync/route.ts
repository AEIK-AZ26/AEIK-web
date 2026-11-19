import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { 
  MemberModel, 
  AttendanceModel, 
  ProjectModel, 
  EventModel, 
  LinkModel, 
  ItemModel 
} from '@/models/CabinetData';

export async function POST(req: Request) {
  try {
    const { entity, action, id, data } = await req.json();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        connected: false,
        message: 'MongoDB qoşulmayıb, yalnız lokal yaddaş saxlanıldı.',
      });
    }

    switch (entity) {
      case 'members':
        if (action === 'delete') {
          await MemberModel.deleteOne({ id });
        } else {
          await MemberModel.findOneAndUpdate({ id }, { ...data, id }, { upsert: true });
        }
        break;

      case 'att':
        if (action === 'delete') {
          await AttendanceModel.deleteOne({ key: id });
        } else {
          await AttendanceModel.findOneAndUpdate({ key: id }, { ...data, key: id }, { upsert: true });
        }
        break;

      case 'projects':
        if (action === 'delete') {
          await ProjectModel.deleteOne({ id });
          // Delete events for this project too
          await EventModel.deleteMany({ pid: id });
        } else {
          await ProjectModel.findOneAndUpdate({ id }, { ...data, id }, { upsert: true });
        }
        break;

      case 'events':
        if (action === 'delete') {
          await EventModel.deleteOne({ id });
        } else {
          await EventModel.findOneAndUpdate({ id }, { ...data, id }, { upsert: true });
        }
        break;

      case 'links':
        if (action === 'delete') {
          await LinkModel.deleteOne({ linkId: id });
        } else {
          await LinkModel.findOneAndUpdate({ linkId: id }, { linkId: id, url: data.url }, { upsert: true });
        }
        break;

      case 'items':
        if (action === 'delete') {
          await ItemModel.deleteOne({ id });
        } else {
          await ItemModel.findOneAndUpdate({ id }, { ...data, id }, { upsert: true });
        }
        break;

      default:
        return NextResponse.json({ error: 'Naməlum obyekt növü.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, connected: true });
  } catch (error: any) {
    console.error('Sync API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Sinxronizasiya xətası.' },
      { status: 500 }
    );
  }
}
