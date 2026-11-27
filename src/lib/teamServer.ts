import { connectToDatabase } from '@/lib/mongodb';
import { TeamMemberModel } from '@/models/TeamMember';
import { DEFAULT_TEAM, TeamMember } from '@/lib/team';

/** `/komanda` səhifəsi üçün dərc olunmuş komanda üzvləri (baza yoxdursa — standart siyahı). */
export async function loadPublicTeam(): Promise<TeamMember[]> {
  try {
    const conn = await connectToDatabase();
    if (!conn) return DEFAULT_TEAM;

    const docs = await TeamMemberModel.find({ status: { $ne: 'draft' } })
      .sort({ order: 1, ts: 1 })
      .lean();

    if (!docs.length) return DEFAULT_TEAM;

    return docs.map((doc) => {
      const plain = { ...(doc as unknown as Record<string, unknown>) };
      delete plain._id;
      delete plain.__v;
      return plain as unknown as TeamMember;
    });
  } catch (error) {
    console.error('Team load error:', error);
    return DEFAULT_TEAM;
  }
}
